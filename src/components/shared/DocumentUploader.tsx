"use client";

import { useCallback, useState, useRef } from "react";
import { Upload, X, FileText, Image as ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DocumentUploaderProps {
  onUpload: (file: File) => Promise<void>;
  accept?: string;
  maxSizeMB?: number;
  label?: string;
}

const FILE_ICONS: Record<string, typeof FileText> = {
  "application/pdf": FileText,
  "image/jpeg": ImageIcon,
  "image/png": ImageIcon,
  "image/webp": ImageIcon,
};

export function DocumentUploader({
  onUpload,
  accept = ".pdf,.jpg,.jpeg,.png,.webp",
  maxSizeMB = 10,
  label = "Glissez un fichier ici ou cliquez pour sélectionner",
}: DocumentUploaderProps) {
  const [dragging, setDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFile = useCallback(
    (file: File): string | null => {
      if (file.size > maxSizeMB * 1024 * 1024) {
        return `Le fichier dépasse ${maxSizeMB}MB.`;
      }
      const allowed = accept.split(",").map((a) => a.trim().replace(".", ""));
      const ext = file.name.split(".").pop()?.toLowerCase();
      if (ext && !allowed.includes(ext)) {
        return `Type de fichier non autorisé. Formats acceptés : ${accept}`;
      }
      return null;
    },
    [accept, maxSizeMB],
  );

  function handleSelect(file: File) {
    const err = validateFile(file);
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    setSelectedFile(file);
  }

  async function handleUpload() {
    if (!selectedFile) return;
    setUploading(true);
    setError(null);
    try {
      await onUpload(selectedFile);
      setSelectedFile(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'upload");
    } finally {
      setUploading(false);
    }
  }

  const Icon = selectedFile ? (FILE_ICONS[selectedFile.type] ?? FileText) : Upload;

  return (
    <div className="space-y-3">
      <div
        className={`relative rounded-xl border-2 border-dashed p-6 text-center transition-colors ${
          dragging
            ? "border-green-500 bg-green-50"
            : "border-charcoal-200 hover:border-charcoal-300"
        }`}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          const file = e.dataTransfer.files[0];
          if (file) handleSelect(file);
        }}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleSelect(file);
            e.target.value = "";
          }}
        />

        {selectedFile ? (
          <div className="flex items-center justify-center gap-3">
            <Icon size={24} className="text-green-600" />
            <div className="text-left">
              <p className="text-sm font-medium text-charcoal-900">{selectedFile.name}</p>
              <p className="text-xs text-charcoal-500">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); setSelectedFile(null); }}
              className="ml-2 p-1 rounded-lg hover:bg-charcoal-100"
            >
              <X size={16} className="text-charcoal-400" />
            </button>
          </div>
        ) : (
          <>
            <Upload size={28} className="mx-auto text-charcoal-400 mb-2" />
            <p className="text-sm text-charcoal-500">{label}</p>
            <p className="text-xs text-charcoal-400 mt-1">
              PDF, JPEG, PNG, WebP — max {maxSizeMB}MB
            </p>
          </>
        )}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {selectedFile && (
        <Button
          className="w-full"
          onClick={(e) => { e.stopPropagation(); handleUpload(); }}
          disabled={uploading}
        >
          {uploading ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Upload en cours…
            </>
          ) : (
            <>
              <Upload size={16} /> Uploader le fichier
            </>
          )}
        </Button>
      )}
    </div>
  );
}
