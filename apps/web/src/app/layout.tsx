import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import { tokens } from "@medsync/tokens";
import "./globals.css";

// Poppins is the brand typeface (IMG_8297). next/font self-hosts it at build
// (no runtime request to Google) and exposes it as the --font-poppins CSS var,
// which the font-sans token references first (packages/tokens/fonts.cjs).
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

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
  // Font family comes from the token layer (font-sans → Poppins → fallbacks).
  return (
    <html lang="en" className={`${poppins.variable} h-full`}>
      <body className="bg-surface-page text-content-primary flex min-h-full flex-col font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
