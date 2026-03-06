import Link from "next/link";
import Image from "next/image";
import { FOOTER_LINKS, SITE_CONFIG } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-white">
      <div className="container-app py-8">
        <div className="flex flex-col gap-6">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/images/brand/logo-icon.svg"
              alt="UniPass"
              width={24}
              height={24}
            />
            <span className="font-bold text-body-md text-neutral-900">
              UniPass
            </span>
          </Link>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-caption text-neutral-400 uppercase tracking-wider mb-3">
                Info
              </h3>
              <ul className="flex flex-col gap-2">
                {FOOTER_LINKS.info.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-body-sm text-neutral-500 hover:text-neutral-900 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-caption text-neutral-400 uppercase tracking-wider mb-3">
                Legale
              </h3>
              <ul className="flex flex-col gap-2">
                {FOOTER_LINKS.legal.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-body-sm text-neutral-500 hover:text-neutral-900 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-200">
            <p className="text-caption text-neutral-400">
              &copy; {new Date().getFullYear()} {SITE_CONFIG.name}. Tutti i
              diritti riservati.
            </p>
          </div>
        </div>
      </div>
      <div className="safe-bottom" />
    </footer>
  );
}
