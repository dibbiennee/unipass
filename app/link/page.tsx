import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink, ShoppingBag, BookOpen, Mail } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Link | UniPass",
  description: "Tutti i link utili di UniPass.",
};

const links = [
  {
    icon: ShoppingBag,
    label: "Sfoglia il catalogo",
    href: "/catalogo",
    external: false,
  },
  {
    icon: BookOpen,
    label: "Come funziona",
    href: "/#come-funziona",
    external: false,
  },
  {
    icon: Mail,
    label: "Contattaci",
    href: "/contatti",
    external: false,
  },
];

export default function LinkPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <Image
        src="/images/brand/logo-icon.svg"
        alt="UniPass"
        width={56}
        height={56}
        className="mb-4"
      />
      <h1 className="text-display-sm text-center mb-1">{SITE_CONFIG.name}</h1>
      <p className="text-body-sm text-neutral-400 text-center mb-8">
        {SITE_CONFIG.tagline}
      </p>

      <div className="w-full max-w-sm space-y-3">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            target={link.external ? "_blank" : undefined}
            className="flex items-center justify-between w-full p-4 rounded-brand bg-neutral-50 border border-neutral-200 hover:border-primary-500/50 hover:shadow-card-hover transition-all duration-200"
          >
            <div className="flex items-center gap-3">
              <link.icon size={20} className="text-primary-400" />
              <span className="text-body-md font-medium text-neutral-900">
                {link.label}
              </span>
            </div>
            {link.external && (
              <ExternalLink size={16} className="text-neutral-400" />
            )}
          </Link>
        ))}
      </div>

      <p className="text-caption text-neutral-400 mt-8">
        &copy; {new Date().getFullYear()} {SITE_CONFIG.name}
      </p>
    </div>
  );
}
