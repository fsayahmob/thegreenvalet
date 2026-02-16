import FormData from "form-data";

const SANDBOX_URL = "https://api-sandbox.yousign.app/v3";
const PRODUCTION_URL = "https://api.yousign.app/v3";

interface YousignSignatureRequest {
  id: string;
  status: string;
}

interface YousignDocument {
  id: string;
  nature: string;
}

interface YousignSigner {
  id: string;
}

export interface SignerInfo {
  firstName: string;
  lastName: string;
  email: string;
}

export class YousignClient {
  private baseUrl: string;

  constructor(
    private apiKey: string,
    env: "sandbox" | "production" = "sandbox",
  ) {
    this.baseUrl = env === "production" ? PRODUCTION_URL : SANDBOX_URL;
  }

  private async request<T>(
    path: string,
    options: {
      method: string;
      body?: string | FormData;
      headers?: Record<string, string>;
    },
  ): Promise<T> {
    const headers: Record<string, string> = {
      Authorization: `Bearer ${this.apiKey}`,
      ...options.headers,
    };

    // form-data sets its own Content-Type with boundary
    if (options.body instanceof FormData) {
      Object.assign(headers, (options.body as FormData).getHeaders());
    }

    const res = await fetch(`${this.baseUrl}/${path}`, {
      method: options.method,
      headers,
      body: options.body instanceof FormData
        ? (options.body as unknown as BodyInit)
        : options.body,
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Yousign API error ${res.status}: ${text}`);
    }

    // Some endpoints return empty body (activate returns 201)
    const contentType = res.headers.get("content-type") ?? "";
    if (contentType.includes("application/json")) {
      return (await res.json()) as T;
    }

    // For download endpoints, return Buffer
    if (contentType.includes("application/pdf") || contentType.includes("application/octet-stream")) {
      const arrayBuffer = await res.arrayBuffer();
      return Buffer.from(arrayBuffer) as unknown as T;
    }

    return {} as T;
  }

  /**
   * Step 1: Create a new signature request (draft status)
   */
  async createSignatureRequest(name: string): Promise<YousignSignatureRequest> {
    return this.request<YousignSignatureRequest>("signature_requests", {
      method: "POST",
      body: JSON.stringify({
        name,
        delivery_mode: "email",
        timezone: "Europe/Paris",
      }),
      headers: { "Content-Type": "application/json" },
    });
  }

  /**
   * Step 2: Upload a PDF document to the signature request
   */
  async uploadDocument(
    requestId: string,
    pdfBuffer: Buffer,
    fileName: string,
  ): Promise<YousignDocument> {
    const form = new FormData();
    form.append("file", pdfBuffer, { filename: fileName, contentType: "application/pdf" });
    form.append("nature", "signable_document");

    return this.request<YousignDocument>(
      `signature_requests/${requestId}/documents`,
      { method: "POST", body: form },
    );
  }

  /**
   * Step 3: Add a signer with signature field on last page
   */
  async addSigner(
    requestId: string,
    documentId: string,
    signer: SignerInfo,
    signaturePosition?: { page: number; x: number; y: number },
  ): Promise<YousignSigner> {
    const pos = signaturePosition ?? { page: 1, x: 77, y: 700 };

    return this.request<YousignSigner>(
      `signature_requests/${requestId}/signers`,
      {
        method: "POST",
        body: JSON.stringify({
          info: {
            first_name: signer.firstName,
            last_name: signer.lastName,
            email: signer.email,
            locale: "fr",
          },
          signature_level: "electronic_signature",
          signature_authentication_mode: "no_otp",
          fields: [
            {
              document_id: documentId,
              type: "signature",
              page: pos.page,
              x: pos.x,
              y: pos.y,
            },
          ],
        }),
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  /**
   * Step 4: Activate the signature request (sends emails to signers)
   */
  async activateRequest(requestId: string): Promise<void> {
    await this.request<Record<string, unknown>>(
      `signature_requests/${requestId}/activate`,
      { method: "POST" },
    );
  }

  /**
   * Download the signed document after completion
   */
  async downloadSignedDocument(
    requestId: string,
    documentId: string,
  ): Promise<Buffer> {
    return this.request<Buffer>(
      `signature_requests/${requestId}/documents/${documentId}/download`,
      { method: "GET" },
    );
  }
}
