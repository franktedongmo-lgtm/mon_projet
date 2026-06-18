"use client";
import Link from "next/link";
import { formatXAF } from "@/lib/format";
import { useCart } from "@/lib/cart-context";
import StarRating from "./StarRating";

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const hasPromo = product.promoPrice && product.promoPrice < product.price;

  return (
    <div className="card group flex flex-col overflow-hidden">
      <Link href={`/produit/${product.id}`} className="block">
        <div className="relative aspect-square bg-gold-50">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="h-full w-full object-cover transition group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gold-100 text-sm text-cocoa/40">
              Photo à venir
            </div>
          )}
          <div className="absolute left-2 top-2 flex flex-col gap-1">
            {product.isTopSale && (
              <span className="rounded-full bg-gold-500 px-2 py-0.5 text-xs font-bold text-white">
                Top vente
              </span>
            )}
            {product.isNew && (
              <span className="rounded-full bg-cocoa px-2 py-0.5 text-xs font-bold text-gold-100">
                Nouveauté
              </span>
            )}
          </div>
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <Link href={`/produit/${product.id}`}>
          <h3 className="font-serif text-lg text-cocoa dark:text-gold-100">{product.name}</h3>
        </Link>
        {product.avgRating != null && (
          <div className="flex items-center gap-2 text-sm">
            <StarRating value={product.avgRating} />
            <span className="text-gold-700">({product.reviewCount})</span>
          </div>
        )}
        <p className="line-clamp-2 text-sm text-cocoa/70 dark:text-gold-100/70">
          {product.description}
        </p>
        <div className="mt-auto flex items-center justify-between pt-2">
          <div>
            {hasPromo ? (
              <div className="flex items-center gap-2">
                <span className="font-bold text-gold-600">{formatXAF(product.promoPrice)}</span>
                <span className="text-sm text-cocoa/40 line-through">{formatXAF(product.price)}</span>
              </div>
            ) : (
              <span className="font-bold text-gold-600">{formatXAF(product.price)}</span>
            )}
          </div>
          <button
            onClick={() => addItem(product)}
            disabled={product.stock <= 0}
            className="rounded-full bg-gold-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gold-600 disabled:bg-gray-300"
          >
            {product.stock <= 0 ? "Épuisé" : "Ajouter"}
          </button>
        </div>
      </div>
    </div>
  );
}
