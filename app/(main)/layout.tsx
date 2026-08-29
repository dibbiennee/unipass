import Script from "next/script";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Tracking centralizzato Nucleo (multi-sito) */}
      <Script
        src="https://victoranalytics-live.vercel.app/t.js"
        data-site="esamefacile"
        strategy="afterInteractive"
      />
      <Navbar />
      <main className="min-h-screen pt-14">{children}</main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
