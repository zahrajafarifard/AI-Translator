import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
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
  title: {
    default: "AI Translator",
    template: "%s | AI Translator",
  },

  description:
    "Translate English documents into Persian using local AI models while preserving document formatting and privacy.",

  keywords: [
    "AI Translator",
    "English to Persian",
    "Document Translation",
    "TranslateGemma",
    "Ollama",
    "PDF Translator",
    "DOCX Translator",
    "Local AI",
    "Persian Translator",
    "Offline Translation",
  ],

  applicationName: "AI Translator",

  authors: [
    {
      name: "Zahra",
    },
  ],

  creator: "Zahra",
  publisher: "AI Translator",

  robots: {
    index: true,
    follow: true,
  },

  alternates: {
    canonical: "/",
  },

  icons: {
    icon: "/translator.png",
    shortcut: "/translator.png",
    apple: "/translator.png",
  },

  openGraph: {
    title: "AI Translator",
    description:
      "Translate English documents into Persian using local AI while preserving document formatting.",
    url: "http://localhost:3000",
    siteName: "AI Translator",
    locale: "en_CA",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AI Translator",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "AI Translator",
    description: "Translate English documents into Persian using local AI.",
    images: ["/og-image.png"],
  },

  category: "Productivity",

  metadataBase: new URL("http://localhost:3000"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <SessionProvider>
        <body className="min-h-full flex flex-col">{children}</body>
      </SessionProvider>
    </html>
  );
}
