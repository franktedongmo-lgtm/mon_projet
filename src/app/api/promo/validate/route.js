import { prisma } from "@/lib/prisma";

export async function POST(req) {
  const { code } = await req.json();
  const promo = await prisma.promoCode.findUnique({ where: { code } });
  if (!promo || !promo.active || (promo.expiresAt && promo.expiresAt < new Date())) {
    return Response.json({ valid: false });
  }
  return Response.json({ valid: true, percentOff: promo.percentOff });
}
