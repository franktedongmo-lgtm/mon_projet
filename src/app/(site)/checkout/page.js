"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { formatXAF, PAYMENT_METHODS } from "@/lib/format";

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const router = useRouter();

  const [form, setForm] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    deliveryAddress: "",
    notes: "",
    paymentMethod: "ORANGE_MONEY",
  });
  const [promoCode, setPromoCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoMessage, setPromoMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const deliveryFee = 1000;
  const discount = Math.round((subtotal * discountPercent) / 100);
  const total = subtotal + deliveryFee - discount;

  async function applyPromo() {
    if (!promoCode) return;
    const res = await fetch("/api/promo/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: promoCode }),
    });
    const data = await res.json();
    if (data.valid) {
      setDiscountPercent(data.percentOff);
      setPromoMessage(`Code appliqué : -${data.percentOff}%`);
    } else {
      setDiscountPercent(0);
      setPromoMessage("Code promo invalide");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (items.length === 0) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          items,
          promoCode: discountPercent ? promoCode : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Le paiement a échoué. Veuillez réessayer.");
        setLoading(false);
        return;
      }
      clearCart();
      router.push(`/suivi?order=${data.order.id}`);
    } catch {
      setError("Une erreur est survenue. Veuillez réessayer.");
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-[1600px] px-6 py-20 text-center sm:px-12">
        <p>Votre panier est vide.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1600px] px-6 py-12 sm:px-12">
      <h1 className="section-title">Finaliser la commande</h1>

      <form onSubmit={handleSubmit} className="mt-8 grid gap-10 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="card space-y-4 p-6">
            <h2 className="font-serif text-xl text-cocoa dark:text-gold-100">Vos informations</h2>
            <input
              required
              placeholder="Nom complet"
              value={form.customerName}
              onChange={(e) => setForm({ ...form, customerName: e.target.value })}
              className="w-full rounded-lg border border-gold-300 px-4 py-2"
            />
            <input
              required
              placeholder="Téléphone (ex: 6XXXXXXXX)"
              value={form.customerPhone}
              onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
              className="w-full rounded-lg border border-gold-300 px-4 py-2"
            />
            <input
              type="email"
              placeholder="Email (optionnel, pour la confirmation)"
              value={form.customerEmail}
              onChange={(e) => setForm({ ...form, customerEmail: e.target.value })}
              className="w-full rounded-lg border border-gold-300 px-4 py-2"
            />
            <input
              required
              placeholder="Adresse de livraison à Ngaoundéré"
              value={form.deliveryAddress}
              onChange={(e) => setForm({ ...form, deliveryAddress: e.target.value })}
              className="w-full rounded-lg border border-gold-300 px-4 py-2"
            />
            <textarea
              placeholder="Notes (optionnel)"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="w-full rounded-lg border border-gold-300 px-4 py-2"
            />
          </div>

          <div className="card space-y-3 p-6">
            <h2 className="font-serif text-xl text-cocoa dark:text-gold-100">Moyen de paiement</h2>
            {PAYMENT_METHODS.map((m) => (
              <label
                key={m.value}
                className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 ${form.paymentMethod === m.value ? "border-gold-500 bg-gold-50" : "border-gold-200"}`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={form.paymentMethod === m.value}
                  onChange={() => setForm({ ...form, paymentMethod: m.value })}
                />
                {m.label}
              </label>
            ))}
            <p className="text-xs text-cocoa/50">
              Mode sandbox : aucune somme réelle ne sera débitée tant que les clés API de
              production ne sont pas configurées.
            </p>
          </div>
        </div>

        <div className="card h-fit space-y-4 p-6">
          <h2 className="font-serif text-xl text-cocoa dark:text-gold-100">Résumé</h2>
          <div className="flex justify-between"><span>Sous-total</span><span>{formatXAF(subtotal)}</span></div>
          <div className="flex justify-between"><span>Livraison</span><span>{formatXAF(deliveryFee)}</span></div>
          {discount > 0 && (
            <div className="flex justify-between text-green-600"><span>Remise</span><span>-{formatXAF(discount)}</span></div>
          )}
          <div className="flex gap-2">
            <input
              placeholder="Code promo"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              className="flex-1 rounded-lg border border-gold-300 px-3 py-2 text-sm"
            />
            <button type="button" onClick={applyPromo} className="rounded-lg border border-gold-400 px-3 py-2 text-sm">
              Appliquer
            </button>
          </div>
          {promoMessage && <p className="text-sm text-gold-700">{promoMessage}</p>}
          <div className="flex justify-between border-t border-gold-200 pt-3 text-lg font-bold">
            <span>Total</span><span>{formatXAF(total)}</span>
          </div>
          <p className="text-sm text-cocoa/60">
            Préparation : ~25 min | Livraison : ~15 min
          </p>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" disabled={loading} className="btn-gold w-full">
            {loading ? "Traitement du paiement..." : "Payer et valider la commande"}
          </button>
        </div>
      </form>
    </div>
  );
}
