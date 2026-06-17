"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import { CATEGORIES } from "@/lib/format";

export default function CatalogueClient() {
  const searchParams = useSearchParams();
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const qs = new URLSearchParams();
    if (category) qs.set("category", category);
    if (search) qs.set("search", search);
    fetch(`/api/products?${qs.toString()}`)
      .then((r) => r.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      });
  }, [category, search]);

  return (
    <div className="mx-auto max-w-[1600px] px-6 py-12 sm:px-12">
      <h1 className="section-title">Notre catalogue</h1>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <button
          onClick={() => setCategory("")}
          className={`rounded-full px-4 py-2 text-sm font-medium ${category === "" ? "bg-gold-500 text-white" : "border border-gold-300 text-cocoa dark:text-gold-100"}`}
        >
          Tous
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c.value}
            onClick={() => setCategory(c.value)}
            className={`rounded-full px-4 py-2 text-sm font-medium ${category === c.value ? "bg-gold-500 text-white" : "border border-gold-300 text-cocoa dark:text-gold-100"}`}
          >
            {c.label}
          </button>
        ))}
        <input
          type="text"
          placeholder="Rechercher un produit..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="ml-auto rounded-full border border-gold-300 px-4 py-2 text-sm focus:outline-gold-500"
        />
      </div>

      {loading ? (
        <p className="mt-12 text-center text-cocoa/60">Chargement...</p>
      ) : products.length === 0 ? (
        <p className="mt-12 text-center text-cocoa/60">Aucun produit trouvé.</p>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
