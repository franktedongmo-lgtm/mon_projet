import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return Response.json({ error: "Non autorisé" }, { status: 401 });
  }
  const admin = await prisma.admin.findUnique({ where: { id: session.user.id } });
  return Response.json({ name: admin.name, email: admin.email, profileImage: admin.profileImage });
}

export async function PUT(req) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return Response.json({ error: "Non autorisé" }, { status: 401 });
  }
  const { name, profileImage } = await req.json();
  const admin = await prisma.admin.update({
    where: { id: session.user.id },
    data: { name, profileImage },
  });
  return Response.json({ name: admin.name, email: admin.email, profileImage: admin.profileImage });
}
