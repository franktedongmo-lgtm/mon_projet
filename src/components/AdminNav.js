"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

const LINKS = [
  { href: "/admin/dashboard", label: "Tableau de bord" },
  { href: "/admin/products", label: "Produits" },
  { href: "/admin/orders", label: "Commandes" },
  { href: "/admin/reviews", label: "Avis" },
  { href: "/admin/settings", label: "Paramètres" },
];

export default function AdminNav() {
  const { data: session } = useSession();
  const pathname = usePathname();

  if (!session) return null;

  return (
    <header className="border-b border-gold-200 bg-cocoa text-gold-100">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between px-4 py-3 sm:px-8">
        <span className="font-serif text-lg text-gold-200">ARoyal Pastry — Admin</span>
        <nav className="flex flex-wrap gap-4 text-sm">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={pathname.startsWith(l.href) ? "text-gold-300 underline" : "hover:text-gold-300"}
            >
              {l.label}
            </Link>
          ))}
          <button onClick={() => signOut({ callbackUrl: "/admin/login" })} className="hover:text-red-300">
            Déconnexion
          </button>
        </nav>
      </div>
    </header>
  );
}
