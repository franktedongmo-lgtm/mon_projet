"use client";
import { useEffect, useState } from "react";
import { formatXAF } from "@/lib/format";

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/customers").then((r) => r.json()).then(setCustomers);
  }, []);

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-serif text-3xl text-cocoa">Clients ({customers.length})</h1>
        <input
          placeholder="Rechercher un client..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-lg border border-gold-300 px-4 py-2"
        />
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-gold-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-gold-50 text-cocoa">
            <tr>
              <th className="p-3">Client</th>
              <th className="p-3">Email</th>
              <th className="p-3">Téléphone</th>
              <th className="p-3">Commandes</th>
              <th className="p-3">Total dépensé</th>
              <th className="p-3">Inscrit le</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} className="border-t border-gold-100">
                <td className="flex items-center gap-2 p-3">
                  <div className="h-8 w-8 overflow-hidden rounded-full bg-gold-100">
                    {c.profileImage ? (
                      <img src={c.profileImage} alt={c.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-gold-700">
                        {c.name[0]?.toUpperCase()}
                      </div>
                    )}
                  </div>
                  {c.name}
                </td>
                <td className="p-3">{c.email}</td>
                <td className="p-3">{c.phone || "—"}</td>
                <td className="p-3">{c.orderCount}</td>
                <td className="p-3">{formatXAF(c.totalSpent)}</td>
                <td className="p-3">{new Date(c.createdAt).toLocaleDateString("fr-FR")}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-cocoa/50">
                  Aucun client trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
