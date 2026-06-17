import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: "Non autorisé" }, { status: 401 });

  const orders = await prisma.order.findMany({
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  const header = [
    "ID",
    "Date",
    "Client",
    "Téléphone",
    "Adresse",
    "Paiement",
    "Statut paiement",
    "Statut commande",
    "Sous-total",
    "Livraison",
    "Remise",
    "Total",
  ].join(",");

  const rows = orders.map((o) =>
    [
      o.id,
      o.createdAt.toISOString(),
      `"${o.customerName}"`,
      o.customerPhone,
      `"${o.deliveryAddress.replace(/"/g, "'")}"`,
      o.paymentMethod,
      o.paymentStatus,
      o.status,
      o.subtotal,
      o.deliveryFee,
      o.discount,
      o.total,
    ].join(",")
  );

  const csv = [header, ...rows].join("\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": "attachment; filename=commandes_aroyal.csv",
    },
  });
}
