import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PATCH(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: "Non autorisé" }, { status: 401 });

  const body = await req.json();
  const review = await prisma.review.update({
    where: { id: params.id },
    data: { published: !!body.published },
  });
  return Response.json(review);
}

export async function DELETE(_req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: "Non autorisé" }, { status: 401 });

  await prisma.review.delete({ where: { id: params.id } });
  return Response.json({ ok: true });
}
