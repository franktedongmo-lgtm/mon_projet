"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { formatXAF, statusLabel, paymentLabel } from "@/lib/format";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch("/api/orders").then((r) => r.json()).then(setOrders);
  }, []);

  return (
    <div>
      <h1 className="font-serif text-3xl text-cocoa">Commandes</h1>
      <div className="mt-6 overflow-x-auto rounded-2xl border border-gold-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-gold-50">
            <tr>
              <th className="p-3">Date</th>
              <th className="p-3">Client</th>
              <th className="p-3">Paiement</th>
              <th className="p-3">Statut</th>
              <th className="p-3">Total</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-t border-gold-100">
                <td className="p-3">{new Date(o.createdAt).toLocaleString("fr-FR")}</td>
                <td className="p-3">{o.customerName}</td>
                <td className="p-3">{paymentLabel(o.paymentMethod)} ({o.paymentStatus})</td>
                <td className="p-3">{statusLabel(o.status)}</td>
                <td className="p-3">{formatXAF(o.total)}</td>
                <td className="p-3">
                  <Link href={`/admin/orders/${o.id}`} className="text-gold-600 hover:underline">
                    Voir
                  </Link>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr><td className="p-3" colSpan={6}>Aucune commande.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
