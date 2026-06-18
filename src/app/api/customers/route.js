import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return Response.json({ error: "Non autorisé" }, { status: 401 });
  }
  const customers = await prisma.customer.findMany({
    orderBy: { createdAt: "desc" },
    include: { orders: true },
  });
  return Response.json(
    customers.map((c) => ({
      ...c,
      password: undefined,
      orderCount: c.orders.length,
      totalSpent: c.orders.reduce((s, o) => s + o.total, 0),
    }))
  );
}

export async function POST(req) {
  const { name, email, password, phone, address } = await req.json();
  if (!name || !email || !password) {
    return Response.json({ error: "Champs requis manquants" }, { status: 400 });
  }
  const existing = await prisma.customer.findUnique({ where: { email } });
  if (existing) {
    return Response.json({ error: "Un compte existe déjà avec cet email" }, { status: 409 });
  }
  const hashed = await bcrypt.hash(password, 10);
  const customer = await prisma.customer.create({
    data: { name, email, password: hashed, phone, address },
  });
  return Response.json({ id: customer.id, name: customer.name, email: customer.email }, { status: 201 });
}
