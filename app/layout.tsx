import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { ToastProvider } from "@/components/ui/toast";
import { CartHydration } from "@/components/providers/cart-hydration";
import { Analytics } from "@/components/analytics";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#FFFFFF",
};

export const metadata: Metadata = {
  title: {
    default: "UniPass — Appunti Universitari Verificati",
    template: "%s | UniPass",
  },
  description:
    "Appunti e riassunti universitari verificati per superare i tuoi esami. Studia meglio, studia meno.",
  keywords: [
    "appunti universitari",
    "riassunti università",
    "materiale studio",
    "esami universitari",
    "appunti PDF",
  ],
  authors: [{ name: "UniPass" }],
  openGraph: {
    type: "website",
    locale: "it_IT",
    siteName: "UniPass",
    title: "UniPass — Appunti Universitari Verificati",
    description:
      "Appunti e riassunti universitari verificati per superare i tuoi esami.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body className={`${inter.variable} font-sans`}>
        <ToastProvider>
          <CartHydration>
            {children}
          </CartHydration>
        </ToastProvider>
        <Analytics />
      </body>
    </html>
  );
}
