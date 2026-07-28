import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Il Percorso delle Sei Parole — MACASS Psy Workshop",
  description:
    "Un percorso immersivo di sei tappe per scoprire le sei parole della consapevolezza. Scansiona i QR Code, affronta le sfide e scopri la frase completa.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "MACASS Psy",
  },
  openGraph: {
    title: "Il Percorso delle Sei Parole",
    description:
      "Scansiona i QR Code, affronta le sfide e scopri le sei parole della consapevolezza.",
    type: "website",
    locale: "it_IT",
  },
  twitter: {
    card: "summary_large_image",
    title: "Il Percorso delle Sei Parole",
    description:
      "Un percorso immersivo di sei tappe per scoprire le sei parole della consapevolezza.",
  },
};

export const viewport: Viewport = {
  themeColor: "#e85a8f",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
