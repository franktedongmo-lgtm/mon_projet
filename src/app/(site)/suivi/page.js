"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { formatXAF, statusLabel, paymentLabel } from "@/lib/format";

function SuiviContent() {
  const searchParams = useSearchParams();
  const [orderId, setOrderId] = useState(searchParams.get("order") || "");
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

  async function lookupOrder(id) {
    setError("");
    setOrder(null);
    if (!id) return;
    const res = await fetch(`/api/orders/${id}`);
    if (!res.ok) {
      setError("Commande non trouvée. Vérifiez le numéro.");
      return;
    }
    setOrder(await res.json());
  }

  useEffect(() => {
    if (searchParams.get("order")) lookupOrder(searchParams.get("order"));
  }, [searchParams]);

  const STEPS = ["PENDING", "CONFIRMED", "PREPARING", "DELIVERING", "DELIVERED"];

  return (
    <div className="mx-auto max-w-3xl px-6 py-12 sm:px-12">
      <h1 className="section-title">Suivi de commande</h1>

      <div className="mt-6 flex gap-2">
        <input
          placeholder="Numéro de commande"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          className="flex-1 rounded-lg border border-gold-300 px-4 py-2"
        />
        <button onClick={() => lookupOrder(orderId)} className="btn-gold">
          Suivre
        </button>
      </div>

      {order?.paymentStatus === "PAID" && order.status !== "CANCELLED" && (
        <div className="mt-8 rounded-2xl bg-green-50 p-4 text-green-700">
          Commande confirmée ! Préparation estimée : {order.prepMinutes} min · Livraison
          estimée : {order.deliveryMinutes} min
        </div>
      )}

      {error && <p className="mt-6 text-red-600">{error}</p>}

      {order && (
        <div className="card mt-6 p-6">
          <h2 className="font-serif text-xl text-cocoa dark:text-gold-100">
            Commande #{order.id.slice(0, 8)}
          </h2>

          {order.status !== "CANCELLED" && (
            <div className="mt-6 flex justify-between">
              {STEPS.map((s, idx) => (
                <div key={s} className="flex flex-1 flex-col items-center text-center">
                  <div
                    className={`h-3 w-3 rounded-full ${STEPS.indexOf(order.status) >= idx ? "bg-gold-500" : "bg-gold-100"}`}
                  />
                  <span className="mt-2 text-xs text-cocoa/60">{statusLabel(s)}</span>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 space-y-2 text-sm">
            <p><b>Statut :</b> {statusLabel(order.status)}</p>
            <p><b>Paiement :</b> {paymentLabel(order.paymentMethod)} ({order.paymentStatus})</p>
            <p><b>Adresse :</b> {order.deliveryAddress}</p>
          </div>

          <ul className="mt-4 divide-y divide-gold-100">
            {order.items.map((i) => (
              <li key={i.id} className="flex justify-between py-2">
                <span>{i.name} x{i.quantity}</span>
                <span>{formatXAF(i.price * i.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between border-t border-gold-200 pt-3 font-bold">
            <span>Total</span><span>{formatXAF(order.total)}</span>
          </div>

          <a
            href={`/avis?orderId=${order.id}`}
            className="btn-outline mt-6 inline-block"
          >
            Laisser un avis sur cette commande
          </a>
        </div>
      )}
    </div>
  );
}

export default function SuiviPage() {
  return (
    <Suspense>
      <SuiviContent />
    </Suspense>
  );
}
