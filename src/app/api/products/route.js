import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const search = searchParams.get("search");
  const all = searchParams.get("all");

  const where = {};
  if (!all) where.active = true;
  if (category) where.category = category;
  if (search) where.name = { contains: search };

  const products = await prisma.product.findMany({
    where,
    include: { reviews: { where: { published: true } } },
    orderBy: { createdAt: "desc" },
  });

  const withRating = products.map((p) => ({
    ...p,
    avgRating: p.reviews.length
      ? p.reviews.reduce((s, r) => s + r.rating, 0) / p.reviews.length
      : null,
    reviewCount: p.reviews.length,
  }));

  return Response.json(withRating);
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: "Non autorisé" }, { status: 401 });

  const body = await req.json();
  const product = await prisma.product.create({
    data: {
      name: body.name,
      description: body.description,
      price: Number(body.price),
      promoPrice: body.promoPrice ? Number(body.promoPrice) : null,
      category: body.category,
      imageUrl: body.imageUrl || null,
      stock: Number(body.stock || 0),
      isTopSale: !!body.isTopSale,
      isNew: !!body.isNew,
      prepMinutes: Number(body.prepMinutes || 20),
      active: body.active !== false,
    },
  });
  return Response.json(product, { status: 201 });
}
