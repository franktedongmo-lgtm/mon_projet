"use client";
import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import { formatXAF, statusLabel, paymentLabel } from "@/lib/format";
import ImageUpload from "@/components/ImageUpload";

export default function CustomerDashboard() {
  const [customer, setCustomer] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(null);

  useEffect(() => {
    fetch("/api/customers/me")
      .then((r) => r.json())
      .then((data) => {
        setCustomer(data);
        setForm({ name: data.name, phone: data.phone || "", address: data.address || "", profileImage: data.profileImage });
      });
  }, []);

  async function handleSave(e) {
    e.preventDefault();
    const res = await fetch("/api/customers/me", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setCustomer({ ...customer, ...data });
    setEditing(false);
  }

  if (!customer) return <p className="px-6 py-20 text-center">Chargement...</p>;

  return (
    <div className="mx-auto max-w-4xl px-6 py-12 sm:px-12">
      <div className="flex items-center justify-between">
        <h1 className="section-title">Mon compte</h1>
        <button onClick={() => signOut({ callbackUrl: "/" })} className="btn-outline">
          Se déconnecter
        </button>
      </div>

      <div className="mt-8 card flex items-center gap-4 p-6">
        <div className="h-16 w-16 overflow-hidden rounded-full bg-gold-100">
          {customer.profileImage ? (
            <img src={customer.profileImage} alt={customer.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center font-serif text-xl text-gold-600">
              {customer.name?.[0]?.toUpperCase()}
            </div>
          )}
        </div>
        <div>
          <p className="font-semibold text-cocoa">{customer.name}</p>
          <p className="text-sm text-cocoa/60">{customer.email}</p>
        </div>
        <button onClick={() => setEditing((e) => !e)} className="ml-auto text-gold-600 hover:underline">
          {editing ? "Annuler" : "Modifier mon profil"}
        </button>
      </div>

      {editing && (
        <form onSubmit={handleSave} className="mt-4 card space-y-4 p-6">
          <ImageUpload label="Photo de profil" value={form.profileImage} onChange={(url) => setForm({ ...form, profileImage: url })} />
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Nom complet"
            className="w-full rounded-lg border border-gold-300 px-4 py-2"
          />
          <input
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="Téléphone"
            className="w-full rounded-lg border border-gold-300 px-4 py-2"
          />
          <input
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            placeholder="Adresse de livraison habituelle"
            className="w-full rounded-lg border border-gold-300 px-4 py-2"
          />
          <button type="submit" className="btn-gold">Enregistrer</button>
        </form>
      )}

      <h2 className="mt-10 font-serif text-2xl text-cocoa">Mes commandes</h2>
      <div className="mt-4 space-y-4">
        {customer.orders.length === 0 && <p className="text-cocoa/60">Aucune commande pour le moment.</p>}
        {customer.orders.map((order) => (
          <div key={order.id} className="card p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-semibold text-cocoa">Commande #{order.id.slice(0, 8)}</p>
                <p className="text-sm text-cocoa/60">
                  {new Date(order.createdAt).toLocaleDateString("fr-FR")} · {statusLabel(order.status)} · {paymentLabel(order.paymentMethod)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold text-gold-600">{formatXAF(order.total)}</span>
                <a href={`/api/orders/${order.id}/invoice`} target="_blank" rel="noopener noreferrer" className="btn-outline px-4 py-2 text-sm">
                  Facture PDF
                </a>
              </div>
            </div>
            <ul className="mt-3 text-sm text-cocoa/70">
              {order.items.map((item) => (
                <li key={item.id}>{item.name} × {item.quantity}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
