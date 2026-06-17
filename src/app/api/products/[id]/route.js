import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(_req, { params }) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: { reviews: { where: { published: true }, orderBy: { createdAt: "desc" } } },
  });
  if (!product) return Response.json({ error: "Produit non trouvé" }, { status: 404 });
  return Response.json(product);
}

export async function PUT(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: "Non autorisé" }, { status: 401 });

  const body = await req.json();
  const product = await prisma.product.update({
    where: { id: params.id },
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
  return Response.json(product);
}

export async function DELETE(_req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: "Non autorisé" }, { status: 401 });

  await prisma.product.delete({ where: { id: params.id } });
  return Response.json({ ok: true });
}
