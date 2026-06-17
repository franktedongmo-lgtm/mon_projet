"use client";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/lib/cart-context";

const NAV = [
  { href: "/", label: "Accueil" },
  { href: "/catalogue", label: "Catalogue" },
  { href: "/avis", label: "Avis clients" },
  { href: "/contact", label: "Nous trouver" },
];

export default function Header() {
  const { count } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-gold-100 bg-cream/95 backdrop-blur dark:bg-cocoa/95 dark:border-gold-800">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-8">
        <Link href="/" className="font-serif text-2xl font-bold text-gold-600 dark:text-gold-200">
          ARoyal Pastry
        </Link>

        <nav className="hidden gap-8 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-medium text-cocoa transition hover:text-gold-600 dark:text-gold-100 dark:hover:text-gold-300"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/panier" className="relative rounded-full border border-gold-300 p-2 hover:bg-gold-50 dark:hover:bg-cocoa">
            🛒
            {count > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gold-500 text-xs text-white">
                {count}
              </span>
            )}
          </Link>
          <button
            className="md:hidden rounded-md border border-gold-300 p-2"
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
          >
            ☰
          </button>
        </div>
      </div>

      {open && (
        <nav className="flex flex-col gap-3 border-t border-gold-100 bg-cream px-4 py-4 md:hidden dark:bg-cocoa">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="font-medium text-cocoa dark:text-gold-100">
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
