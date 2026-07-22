import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import { tokens } from "@medsync/tokens";
import { ForceDesktopViewport } from "@/components/force-desktop-viewport";
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
  // Desktop app: mobile responsiveness is intentionally DISABLED. The web build
  // is a desktop surface; the mobile experience ships as the Expo app. A fixed
  // layout-viewport width makes phone browsers render the scaled desktop layout
  // instead of reflowing to a mobile view. (No initial/maximum scale so the
  // browser fits 1280 to the device width and pinch-zoom still works.)
  width: 1280,
  // null (not omitted) cancels Next's default initial-scale=1, so the browser
  // scales the 1280 layout to fit the device instead of rendering it 1:1.
  initialScale: null as unknown as number,
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
        <ForceDesktopViewport />
        {children}
      </body>
    </html>
  );
}
