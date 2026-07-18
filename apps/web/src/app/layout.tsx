import type { Metadata, Viewport } from "next";
import { tokens } from "@medsync/tokens";
import "./globals.css";

export const metadata: Metadata = {
  title: "MedSync",
  description: "MedSync — a digital hospital operating system.",
  applicationName: "MedSync",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "MedSync",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  // Light theme only — value comes from the token layer, not a raw hex.
  // Dark is deliberately disabled (see @medsync/tokens flags.cjs).
  themeColor: tokens["surface-primary"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Font family comes from the token layer (font-sans → Neue Haas → fallbacks).
  return (
    <html lang="en" className="h-full">
      <body className="bg-surface-page text-content-primary flex min-h-full flex-col font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
