import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

function startOfDay(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}
function startOfWeek(d) {
  const x = startOfDay(d);
  const day = x.getDay() === 0 ? 6 : x.getDay() - 1;
  x.setDate(x.getDate() - day);
  return x;
}
function startOfMonth(d) {
  const x = startOfDay(d);
  x.setDate(1);
  return x;
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: "Non autorisé" }, { status: 401 });

  const now = new Date();
  const [visitors, ordersToday, ordersWeek, ordersMonth, allOrders, reviewsCount, customersCount] =
    await Promise.all([
      prisma.visit.count(),
      prisma.order.count({ where: { createdAt: { gte: startOfDay(now) } } }),
      prisma.order.count({ where: { createdAt: { gte: startOfWeek(now) } } }),
      prisma.order.count({ where: { createdAt: { gte: startOfMonth(now) } } }),
      prisma.order.findMany({ where: { paymentStatus: "PAID" } }),
      prisma.review.count(),
      prisma.customer.count(),
    ]);

  const revenue = allOrders.reduce((sum, o) => sum + o.total, 0);

  return Response.json({
    visitors,
    ordersToday,
    ordersWeek,
    ordersMonth,
    totalOrders: allOrders.length,
    revenue,
    reviewsCount,
    customersCount,
  });
}
