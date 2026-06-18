import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "CUSTOMER") {
    return Response.json({ error: "Non autorisé" }, { status: 401 });
  }
  const customer = await prisma.customer.findUnique({
    where: { id: session.user.id },
    include: { orders: { include: { items: true }, orderBy: { createdAt: "desc" } } },
  });
  if (!customer) return Response.json({ error: "Introuvable" }, { status: 404 });
  return Response.json({ ...customer, password: undefined });
}

export async function PUT(req) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "CUSTOMER") {
    return Response.json({ error: "Non autorisé" }, { status: 401 });
  }
  const { name, phone, address, profileImage } = await req.json();
  const customer = await prisma.customer.update({
    where: { id: session.user.id },
    data: { name, phone, address, profileImage },
  });
  return Response.json({ ...customer, password: undefined });
}
