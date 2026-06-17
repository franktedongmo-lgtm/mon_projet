"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { formatXAF, categoryLabel } from "@/lib/format";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);

  function load() {
    fetch("/api/products?all=1").then((r) => r.json()).then(setProducts);
  }

  useEffect(load, []);

  async function handleDelete(id) {
    if (!confirm("Supprimer ce produit ?")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl text-cocoa">Produits</h1>
        <Link href="/admin/products/new" className="btn-gold">+ Nouveau produit</Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-gold-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-gold-50">
            <tr>
              <th className="p-3">Nom</th>
              <th className="p-3">Catégorie</th>
              <th className="p-3">Prix</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Actif</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t border-gold-100">
                <td className="p-3">{p.name}</td>
                <td className="p-3">{categoryLabel(p.category)}</td>
                <td className="p-3">{formatXAF(p.promoPrice || p.price)}</td>
                <td className="p-3">{p.stock}</td>
                <td className="p-3">{p.active ? "Oui" : "Non"}</td>
                <td className="p-3 space-x-3">
                  <Link href={`/admin/products/${p.id}`} className="text-gold-600 hover:underline">Modifier</Link>
                  <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:underline">Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
