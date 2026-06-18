"use client";
import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { formatXAF, categoryLabel } from "@/lib/format";

export default function OrderModal({ products, trigger }) {
  const [open, setOpen] = useState(false);
  const { addItem } = useCart();
  const [added, setAdded] = useState({});

  function handleAdd(product) {
    addItem(product);
    setAdded((a) => ({ ...a, [product.id]: true }));
  }

  return (
    <>
      <button onClick={() => setOpen(true)} className="btn-gold">
        {trigger || "Commander maintenant"}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="max-h-[85vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-cream p-6 dark:bg-cocoa sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-2xl text-cocoa dark:text-gold-100">
                Que souhaitez-vous commander ?
              </h2>
              <button
                onClick={() => setOpen(false)}
                aria-label="Fermer"
                className="rounded-full border border-gold-300 p-2 text-cocoa hover:bg-gold-50 dark:text-gold-100"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {products.map((p) => (
                <div key={p.id} className="card flex items-center gap-3 p-3">
                  <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-gold-50">
                    {p.imageUrl ? (
                      <img src={p.imageUrl} alt={p.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-[10px] text-cocoa/40">
                        Photo
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-cocoa dark:text-gold-100">{p.name}</p>
                    <p className="text-xs text-cocoa/60 dark:text-gold-100/60">{categoryLabel(p.category)}</p>
                    <p className="text-sm font-bold text-gold-600">{formatXAF(p.promoPrice || p.price)}</p>
                  </div>
                  <button
                    onClick={() => handleAdd(p)}
                    className="rounded-full bg-gold-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-gold-600"
                  >
                    {added[p.id] ? "Ajouté ✓" : "Ajouter"}
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-gold-200 pt-4">
              <Link href="/catalogue" onClick={() => setOpen(false)} className="text-gold-600 hover:underline">
                Voir tout le catalogue →
              </Link>
              <Link href="/panier" onClick={() => setOpen(false)} className="btn-gold">
                Voir mon panier
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
