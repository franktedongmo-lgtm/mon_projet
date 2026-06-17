import { prisma } from "@/lib/prisma";

export async function POST(req) {
  const { sessionId } = await req.json();
  if (!sessionId) return Response.json({ error: "sessionId requis" }, { status: 400 });

  await prisma.visit.upsert({
    where: { sessionId },
    update: {},
    create: { sessionId },
  });

  return Response.json({ ok: true });
}

export async function GET() {
  const count = await prisma.visit.count();
  return Response.json({ count });
}
