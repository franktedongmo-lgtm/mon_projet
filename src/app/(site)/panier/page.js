"use client";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { formatXAF } from "@/lib/format";

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotal } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-[1600px] px-6 py-20 text-center sm:px-12">
        <h1 className="section-title">Votre panier est vide</h1>
        <Link href="/catalogue" className="btn-gold mt-8 inline-block">
          Découvrir le catalogue
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1600px] px-6 py-12 sm:px-12">
      <h1 className="section-title">Votre panier</h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {items.map((item) => (
            <div key={item.id} className="card flex items-center gap-4 p-4">
              <div className="h-20 w-20 overflow-hidden rounded-xl bg-gold-50">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gold-100 text-xs text-cocoa/40">
                    Photo
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-cocoa dark:text-gold-100">{item.name}</h3>
                <p className="text-gold-600">{formatXAF(item.price)}</p>
              </div>
              <div className="flex items-center rounded-full border border-gold-300">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="px-3 py-1"
                >
                  -
                </button>
                <span className="px-2">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="px-3 py-1"
                >
                  +
                </button>
              </div>
              <button onClick={() => removeItem(item.id)} className="text-red-500 hover:underline">
                Retirer
              </button>
            </div>
          ))}
        </div>

        <div className="card h-fit p-6">
          <h2 className="font-serif text-xl text-cocoa dark:text-gold-100">Résumé</h2>
          <div className="mt-4 flex justify-between text-cocoa/80 dark:text-gold-100/80">
            <span>Sous-total</span>
            <span>{formatXAF(subtotal)}</span>
          </div>
          <p className="mt-2 text-sm text-cocoa/60">
            Frais de livraison calculés à l&apos;étape suivante.
          </p>
          <Link href="/checkout" className="btn-gold mt-6 block text-center">
            Passer la commande
          </Link>
        </div>
      </div>
    </div>
  );
}
