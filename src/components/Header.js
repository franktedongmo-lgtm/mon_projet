"use client";
import Link from "next/link";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useCart } from "@/lib/cart-context";

const NAV = [
  { href: "/", label: "Accueil" },
  { href: "/catalogue", label: "Catalogue" },
  { href: "/#avis", label: "Avis clients" },
  { href: "/#localisation", label: "Nous trouver" },
];

export default function Header() {
  const { count } = useCart();
  const { data: session } = useSession();
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
          <Link
            href={session ? "/compte/dashboard" : "/compte/connexion"}
            className="hidden text-sm font-medium text-cocoa hover:text-gold-600 dark:text-gold-100 sm:block"
          >
            {session ? `Bonjour, ${session.user.name?.split(" ")[0]}` : "Mon compte"}
          </Link>
          <Link href="/panier" className="relative rounded-full border border-gold-300 p-2 hover:bg-gold-50 dark:hover:bg-cocoa" aria-label="Panier">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
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
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
            </svg>
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
          <Link href={session ? "/compte/dashboard" : "/compte/connexion"} onClick={() => setOpen(false)} className="font-medium text-cocoa dark:text-gold-100">
            {session ? "Mon compte" : "Connexion / Inscription"}
          </Link>
        </nav>
      )}
    </header>
  );
}
