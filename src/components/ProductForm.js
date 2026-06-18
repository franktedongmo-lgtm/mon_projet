"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CATEGORIES } from "@/lib/format";
import ImageUpload from "@/components/ImageUpload";

export default function ProductForm({ initial, productId }) {
  const router = useRouter();
  const [form, setForm] = useState(
    initial || {
      name: "",
      description: "",
      price: "",
      promoPrice: "",
      category: "GATEAUX",
      imageUrl: "",
      stock: 0,
      isTopSale: false,
      isNew: false,
      prepMinutes: 20,
      active: true,
    }
  );
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    const url = productId ? `/api/products/${productId}` : "/api/products";
    const method = productId ? "PUT" : "POST";
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    router.push("/admin/products");
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-4 rounded-2xl border border-gold-200 bg-white p-6">
      <input
        required
        placeholder="Nom du produit"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className="w-full rounded-lg border border-gold-300 px-4 py-2"
      />
      <textarea
        required
        placeholder="Description"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        className="w-full rounded-lg border border-gold-300 px-4 py-2"
      />
      <div className="grid grid-cols-2 gap-4">
        <input
          required
          type="number"
          placeholder="Prix (FCFA)"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          className="rounded-lg border border-gold-300 px-4 py-2"
        />
        <input
          type="number"
          placeholder="Prix promo (FCFA, optionnel)"
          value={form.promoPrice || ""}
          onChange={(e) => setForm({ ...form, promoPrice: e.target.value })}
          className="rounded-lg border border-gold-300 px-4 py-2"
        />
      </div>
      <select
        value={form.category}
        onChange={(e) => setForm({ ...form, category: e.target.value })}
        className="w-full rounded-lg border border-gold-300 px-4 py-2"
      >
        {CATEGORIES.map((c) => (
          <option key={c.value} value={c.value}>{c.label}</option>
        ))}
      </select>
      <ImageUpload
        label="Photo du produit"
        value={form.imageUrl}
        onChange={(url) => setForm({ ...form, imageUrl: url })}
      />
      <div className="grid grid-cols-2 gap-4">
        <input
          type="number"
          placeholder="Stock"
          value={form.stock}
          onChange={(e) => setForm({ ...form, stock: e.target.value })}
          className="rounded-lg border border-gold-300 px-4 py-2"
        />
        <input
          type="number"
          placeholder="Temps de préparation (min)"
          value={form.prepMinutes}
          onChange={(e) => setForm({ ...form, prepMinutes: e.target.value })}
          className="rounded-lg border border-gold-300 px-4 py-2"
        />
      </div>
      <div className="flex gap-6">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.isTopSale}
            onChange={(e) => setForm({ ...form, isTopSale: e.target.checked })}
          />
          Top vente
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.isNew}
            onChange={(e) => setForm({ ...form, isNew: e.target.checked })}
          />
          Nouveauté
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.active}
            onChange={(e) => setForm({ ...form, active: e.target.checked })}
          />
          Actif
        </label>
      </div>
      <button type="submit" disabled={saving} className="btn-gold">
        {saving ? "Enregistrement..." : "Enregistrer"}
      </button>
    </form>
  );
}
