import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(_req, { params }) {
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: { items: true },
  });
  if (!order) return Response.json({ error: "Commande non trouvée" }, { status: 404 });
  return Response.json(order);
}

export async function PATCH(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: "Non autorisé" }, { status: 401 });

  const body = await req.json();
  const order = await prisma.order.update({
    where: { id: params.id },
    data: {
      ...(body.status ? { status: body.status } : {}),
      ...(body.paymentStatus ? { paymentStatus: body.paymentStatus } : {}),
    },
    include: { items: true },
  });
  return Response.json(order);
}
