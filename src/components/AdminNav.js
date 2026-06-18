"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

const LINKS = [
  { href: "/admin/dashboard", label: "Tableau de bord" },
  { href: "/admin/products", label: "Produits" },
  { href: "/admin/orders", label: "Commandes" },
  { href: "/admin/customers", label: "Clients" },
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
        <nav className="flex flex-wrap items-center gap-4 text-sm">
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
          <div className="flex items-center gap-2 border-l border-gold-700 pl-4">
            <div className="h-8 w-8 overflow-hidden rounded-full bg-gold-700">
              {session.user.image ? (
                <img src={session.user.image} alt={session.user.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-gold-100">
                  {session.user.name?.[0]?.toUpperCase()}
                </div>
              )}
            </div>
            <span className="text-gold-100">{session.user.name}</span>
          </div>
        </nav>
      </div>
    </header>
  );
}
