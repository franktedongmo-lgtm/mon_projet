import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const settings = await prisma.settings.upsert({
    where: { id: "settings" },
    update: {},
    create: { id: "settings" },
  });
  return Response.json(settings);
}

export async function PUT(req) {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: "Non autorisé" }, { status: 401 });

  const body = await req.json();
  const settings = await prisma.settings.upsert({
    where: { id: "settings" },
    update: {
      openingHours: body.openingHours,
      holidays: body.holidays,
      deliveryZone: body.deliveryZone,
      defaultPrepMinutes: Number(body.defaultPrepMinutes),
      defaultDeliveryMinutes: Number(body.defaultDeliveryMinutes),
      deliveryFee: Number(body.deliveryFee),
    },
    create: {
      id: "settings",
      openingHours: body.openingHours,
      holidays: body.holidays,
      deliveryZone: body.deliveryZone,
      defaultPrepMinutes: Number(body.defaultPrepMinutes),
      defaultDeliveryMinutes: Number(body.defaultDeliveryMinutes),
      deliveryFee: Number(body.deliveryFee),
    },
  });
  return Response.json(settings);
}
