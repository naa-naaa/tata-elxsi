import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
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
  themeColor: "#f6f8f8",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
