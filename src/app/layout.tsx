/* refactored: tokens */
import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/cn";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Il Percorso delle Sei Parole — MACASS Psy Workshop",
  description: "Un percorso immersivo di sei tappe per scoprire le sei parole della consapevolezza.",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "MACASS Psy",
  },
  openGraph: {
    title: "Il Percorso delle Sei Parole",
    description: "Scansiona i QR Code, affronta le sfide e scopri le sei parole della consapevolezza.",
    type: "website",
    locale: "it_IT",
  },
  twitter: {
    card: "summary_large_image",
    title: "Il Percorso delle Sei Parole",
    description: "Un percorso immersivo di sei tappe per scoprire le sei parole della consapevolezza.",
  },
};

export const viewport: Viewport = {
  themeColor: "var(--color-accent)",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <head>
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png" />
      </head>
      <body className={cn(cormorant.variable, outfit.variable, "antialiased flex flex-col min-h-dvh")}>
        {children}
        <footer className="app-footer">
          <p className="text-xs text-[var(--color-muted-strong)]">Made with love by Adelant</p>
        </footer>
      </body>
    </html>
  );
}
