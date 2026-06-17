"use client";
import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import { useRouter } from "next/navigation";

export default function AddToCartBox({ product }) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();

  return (
    <div className="mt-6 flex items-center gap-4">
      <div className="flex items-center rounded-full border border-gold-300">
        <button
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          className="px-4 py-2 text-lg"
        >
          -
        </button>
        <span className="px-2">{quantity}</span>
        <button onClick={() => setQuantity((q) => q + 1)} className="px-4 py-2 text-lg">
          +
        </button>
      </div>
      <button
        disabled={product.stock <= 0}
        onClick={() => addItem(product, quantity)}
        className="btn-gold disabled:bg-gray-300"
      >
        Ajouter au panier
      </button>
      <button
        disabled={product.stock <= 0}
        onClick={() => {
          addItem(product, quantity);
          router.push("/panier");
        }}
        className="btn-outline disabled:opacity-50"
      >
        Commander maintenant
      </button>
    </div>
  );
}
