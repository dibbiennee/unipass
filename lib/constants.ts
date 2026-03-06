export const SITE_CONFIG = {
  name: process.env.NEXT_PUBLIC_APP_NAME || "UniPass",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  description:
    "Appunti e riassunti universitari verificati. Studia meglio, studia meno.",
  tagline: "Studia smart, passa gli esami.",
  email: "info@unipass.it",
} as const;

export const DOWNLOAD_CONFIG = {
  maxDownloads: 5,
  expiryHours: 48,
  signedUrlDurationSeconds: 60,
} as const;

export const NAVIGATION_ITEMS = [
  { label: "Catalogo", href: "/catalogo" },
  { label: "Come funziona", href: "/#come-funziona" },
  { label: "FAQ", href: "/#faq" },
  { label: "Contatti", href: "/contatti" },
] as const;

export const FOOTER_LINKS = {
  info: [
    { label: "Chi siamo", href: "/chi-siamo" },
    { label: "Contatti", href: "/contatti" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Termini e Condizioni", href: "/termini" },
  ],
} as const;

export const UNIVERSITIES = [
  "Università di Bologna",
  "Politecnico di Milano",
  "Sapienza Università di Roma",
  "Università di Padova",
  "Università di Firenze",
  "Università di Napoli Federico II",
  "Università di Torino",
  "Politecnico di Torino",
  "Università di Milano",
  "Università di Pisa",
  "Università di Bari",
  "Università di Catania",
  "Università di Genova",
  "Università di Palermo",
  "Università di Verona",
] as const;
