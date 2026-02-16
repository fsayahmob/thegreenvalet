import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://thegreenvalet.fr"),
  title: "The Green Valet — Lavage vapeur éco-responsable sur les golfs",
  description:
    "Le premier service de lavage vapeur intégré aux golfs. Zéro investissement, zéro contrainte, 100% image premium pour votre club.",
  keywords: [
    "lavage vapeur",
    "golf",
    "éco-responsable",
    "green valet",
    "detailing",
    "container",
  ],
  icons: {
    icon: [
      { url: "/images/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/images/favicon.png", sizes: "180x180", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "The Green Valet — Lavage vapeur éco-responsable sur les golfs",
    description:
      "Le premier service de lavage vapeur intégré aux golfs. Zéro investissement, zéro contrainte, 100% image premium.",
    images: [{ url: "/images/hero.jpg", width: 2400, height: 1028 }],
    locale: "fr_FR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" data-scroll-behavior="smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
