"use client";
import { useEffect, useState } from "react";
import StarRating from "@/components/StarRating";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState([]);

  function load() {
    fetch("/api/reviews?all=1").then((r) => r.json()).then(setReviews);
  }
  useEffect(load, []);

  async function togglePublish(id, published) {
    await fetch(`/api/reviews/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published }),
    });
    load();
  }

  async function remove(id) {
    if (!confirm("Supprimer cet avis ?")) return;
    await fetch(`/api/reviews/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <h1 className="font-serif text-3xl text-cocoa">Modération des avis</h1>
      <div className="mt-6 space-y-4">
        {reviews.map((r) => (
          <div key={r.id} className="rounded-2xl border border-gold-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <StarRating value={r.rating} />
              <span className={`rounded-full px-3 py-1 text-xs ${r.published ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                {r.published ? "Publié" : "En attente"}
              </span>
            </div>
            <p className="mt-2 italic">“{r.comment}”</p>
            <p className="mt-1 text-sm font-semibold text-gold-600">
              — {r.pseudo} {r.product ? `(produit : ${r.product.name})` : ""}
            </p>
            <div className="mt-3 flex gap-3 text-sm">
              <button onClick={() => togglePublish(r.id, !r.published)} className="text-gold-600 hover:underline">
                {r.published ? "Dépublier" : "Publier"}
              </button>
              <button onClick={() => remove(r.id)} className="text-red-500 hover:underline">
                Supprimer
              </button>
            </div>
          </div>
        ))}
        {reviews.length === 0 && <p>Aucun avis pour le moment.</p>}
      </div>
    </div>
  );
}
