import type { Metadata, Viewport } from "next";
import { DM_Serif_Display, Geist_Mono, Manrope } from "next/font/google";
import "./globals.css";
import "./theme-overrides.css";

const manrope = Manrope({ variable: "--font-manrope", subsets: ["latin"] });
const dmSerifDisplay = DM_Serif_Display({ variable: "--font-dm-serif-display", subsets: ["latin"], weight: "400" });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LabelGuard AI | Intelligent Medical Device Labeling",
  description: "A simulated end-to-end medical device labeling lifecycle: specification changes, AI-assisted impact analysis, deterministic validation, human approval, and controlled release.",
  applicationName: "LabelGuard AI",
  keywords: ["medical device labeling", "label lifecycle", "regulatory technology", "simulation"],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f5f7f5",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${manrope.variable} ${dmSerifDisplay.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
