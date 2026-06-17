"use client";
import { useEffect, useState } from "react";
import { formatXAF } from "@/lib/format";

export default function DashboardPage() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch("/api/stats").then((r) => r.json()).then(setStats);
  }, []);

  if (!stats) return <p>Chargement...</p>;

  const cards = [
    { label: "Visiteurs uniques", value: stats.visitors },
    { label: "Commandes aujourd'hui", value: stats.ordersToday },
    { label: "Commandes cette semaine", value: stats.ordersWeek },
    { label: "Commandes ce mois", value: stats.ordersMonth },
    { label: "Chiffre d'affaires", value: formatXAF(stats.revenue) },
    { label: "Avis reçus", value: stats.reviewsCount },
  ];

  return (
    <div>
      <h1 className="font-serif text-3xl text-cocoa">Tableau de bord</h1>
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl border border-gold-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">{c.label}</p>
            <p className="mt-2 text-3xl font-bold text-gold-600">{c.value}</p>
          </div>
        ))}
      </div>
      <a href="/api/export/orders" className="btn-gold mt-8 inline-block">
        Exporter les commandes (CSV)
      </a>
    </div>
  );
}
