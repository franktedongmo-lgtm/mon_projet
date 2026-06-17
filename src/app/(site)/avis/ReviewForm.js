"use client";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";

function ReviewFormContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") || "";
  const [form, setForm] = useState({ pseudo: "", rating: 5, comment: "" });
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, orderId: orderId || undefined }),
    });
    setSubmitted(true);
  }

  if (submitted) {
    return <p className="mt-6 rounded-xl bg-green-50 p-4 text-green-700">Merci ! Votre avis a été envoyé pour modération.</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="card mt-6 space-y-4 p-6">
      <input
        required
        placeholder="Votre pseudo"
        value={form.pseudo}
        onChange={(e) => setForm({ ...form, pseudo: e.target.value })}
        className="w-full rounded-lg border border-gold-300 px-4 py-2"
      />
      <select
        value={form.rating}
        onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
        className="w-full rounded-lg border border-gold-300 px-4 py-2"
      >
        {[5, 4, 3, 2, 1].map((n) => (
          <option key={n} value={n}>{n} étoile{n > 1 ? "s" : ""}</option>
        ))}
      </select>
      <textarea
        required
        placeholder="Votre commentaire"
        value={form.comment}
        onChange={(e) => setForm({ ...form, comment: e.target.value })}
        className="w-full rounded-lg border border-gold-300 px-4 py-2"
      />
      <button type="submit" className="btn-gold">Envoyer mon avis</button>
    </form>
  );
}

export default function ReviewForm() {
  return (
    <Suspense>
      <ReviewFormContent />
    </Suspense>
  );
}
