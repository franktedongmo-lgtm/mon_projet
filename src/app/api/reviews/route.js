import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const all = searchParams.get("all");
  const productId = searchParams.get("productId");

  let where = {};
  if (!all) where.published = true;
  if (productId) where.productId = productId;

  if (all) {
    const session = await getServerSession(authOptions);
    if (!session) return Response.json({ error: "Non autorisé" }, { status: 401 });
  }

  const reviews = await prisma.review.findMany({
    where,
    include: { product: true },
    orderBy: { createdAt: "desc" },
  });
  return Response.json(reviews);
}

export async function POST(req) {
  const body = await req.json();
  const { pseudo, rating, comment, productId, orderId } = body;
  if (!pseudo || !rating || !comment) {
    return Response.json({ error: "Champs requis manquants" }, { status: 400 });
  }
  const review = await prisma.review.create({
    data: {
      pseudo,
      rating: Math.min(5, Math.max(1, Number(rating))),
      comment,
      productId: productId || null,
      orderId: orderId || null,
      published: false,
    },
  });
  return Response.json(review, { status: 201 });
}
