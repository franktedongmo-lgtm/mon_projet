"use client";
import { useEffect, useState } from "react";
import { formatXAF, statusLabel, paymentLabel, ORDER_STATUSES } from "@/lib/format";

export default function AdminOrderDetailPage({ params }) {
  const [order, setOrder] = useState(null);

  function load() {
    fetch(`/api/orders/${params.id}`).then((r) => r.json()).then(setOrder);
  }
  useEffect(load, [params.id]);

  async function updateStatus(status) {
    await fetch(`/api/orders/${params.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    load();
  }

  if (!order) return <p>Chargement...</p>;

  return (
    <div className="max-w-3xl">
      <h1 className="font-serif text-3xl text-cocoa">Commande #{order.id.slice(0, 8)}</h1>

      <div className="mt-6 rounded-2xl border border-gold-200 bg-white p-6">
        <h2 className="font-semibold text-cocoa">Client</h2>
        <p>{order.customerName} — {order.customerPhone}</p>
        {order.customerEmail && <p>{order.customerEmail}</p>}
        <p>{order.deliveryAddress}</p>
        {order.notes && <p className="text-sm text-gray-500">Note : {order.notes}</p>}

        <h2 className="mt-6 font-semibold text-cocoa">Produits</h2>
        <ul className="divide-y divide-gold-100">
          {order.items.map((i) => (
            <li key={i.id} className="flex justify-between py-2">
              <span>{i.name} x{i.quantity}</span>
              <span>{formatXAF(i.price * i.quantity)}</span>
            </li>
          ))}
        </ul>

        <div className="mt-4 space-y-1 border-t border-gold-200 pt-3 text-sm">
          <div className="flex justify-between"><span>Sous-total</span><span>{formatXAF(order.subtotal)}</span></div>
          <div className="flex justify-between"><span>Livraison</span><span>{formatXAF(order.deliveryFee)}</span></div>
          <div className="flex justify-between"><span>Remise</span><span>-{formatXAF(order.discount)}</span></div>
          <div className="flex justify-between font-bold"><span>Total</span><span>{formatXAF(order.total)}</span></div>
        </div>

        <p className="mt-4">Paiement : {paymentLabel(order.paymentMethod)} ({order.paymentStatus})</p>

        <div className="mt-6">
          <label className="block text-sm font-semibold text-cocoa">Statut de la commande</label>
          <select
            value={order.status}
            onChange={(e) => updateStatus(e.target.value)}
            className="mt-2 rounded-lg border border-gold-300 px-4 py-2"
          >
            {ORDER_STATUSES.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
