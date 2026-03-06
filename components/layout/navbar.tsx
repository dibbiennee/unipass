"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { NAVIGATION_ITEMS } from "@/lib/constants";
import { useCart } from "@/hooks/use-cart";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { itemCount } = useCart();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-200">
      <div className="container-app flex items-center justify-between h-14">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/brand/logo-icon.svg"
            alt="UniPass"
            width={28}
            height={28}
          />
          <span className="font-bold text-body-lg text-neutral-900">
            UniPass
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/checkout"
            className="relative p-2.5 text-neutral-700 hover:text-neutral-900 transition-colors"
          >
            <ShoppingCart size={22} />
            {itemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-primary-500 text-white text-[10px] font-bold w-4.5 h-4.5 flex items-center justify-center rounded-full min-w-[18px] h-[18px]">
                {itemCount}
              </span>
            )}
          </Link>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2.5 text-neutral-700 hover:text-neutral-900 transition-colors"
            aria-label={menuOpen ? "Chiudi menu" : "Apri menu"}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-neutral-200 bg-white/95 backdrop-blur-md"
          >
            <div className="container-app py-4 flex flex-col gap-1">
              {NAVIGATION_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    "px-3 py-2.5 rounded-brand text-body-md text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
