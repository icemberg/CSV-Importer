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

export const metadata = {
  title: "GrowEasy CSV Importer — AI-Powered Lead Import",
  description:
    "Upload any CSV file and let AI intelligently map your leads into GrowEasy CRM format. Supports Facebook, Google Ads, real estate exports, and more.",
  keywords: "CSV importer, CRM, lead import, AI, GrowEasy",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
