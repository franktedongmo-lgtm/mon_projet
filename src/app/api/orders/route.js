import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { processPayment } from "@/lib/payments";
import { sendEmail, orderAdminEmailHtml, orderCustomerEmailHtml } from "@/lib/mailer";

export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: "Non autorisé" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const orders = await prisma.order.findMany({
    where: status ? { status } : {},
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });
  return Response.json(orders);
}

export async function POST(req) {
  const body = await req.json();
  const {
    customerName,
    customerPhone,
    customerEmail,
    deliveryAddress,
    notes,
    paymentMethod,
    items,
    promoCode,
    cardToken,
    customerId,
  } = body;

  if (!customerName || !customerPhone || !deliveryAddress || !items?.length) {
    return Response.json({ error: "Champs requis manquants" }, { status: 400 });
  }

  const settings = await prisma.settings.findUnique({ where: { id: "settings" } });
  const products = await prisma.product.findMany({
    where: { id: { in: items.map((i) => i.id) } },
  });

  let subtotal = 0;
  const orderItemsData = items.map((i) => {
    const product = products.find((p) => p.id === i.id);
    const price = product?.promoPrice || product?.price || i.price;
    subtotal += price * i.quantity;
    return {
      productId: i.id,
      name: product?.name || i.name,
      price,
      quantity: i.quantity,
    };
  });

  let discount = 0;
  if (promoCode) {
    const promo = await prisma.promoCode.findUnique({ where: { code: promoCode } });
    if (promo && promo.active) discount = Math.round((subtotal * promo.percentOff) / 100);
  }

  const deliveryFee = settings?.deliveryFee ?? 1000;
  const total = subtotal + deliveryFee - discount;

  const paymentResult = await processPayment(paymentMethod, {
    phone: customerPhone,
    amount: total,
    token: cardToken,
  });

  const order = await prisma.order.create({
    data: {
      customerId: customerId || null,
      customerName,
      customerPhone,
      customerEmail,
      deliveryAddress,
      notes,
      paymentMethod,
      paymentStatus: paymentResult.success ? "PAID" : "FAILED",
      subtotal,
      deliveryFee,
      discount,
      total,
      promoCode: promoCode || null,
      prepMinutes: settings?.defaultPrepMinutes ?? 25,
      deliveryMinutes: settings?.defaultDeliveryMinutes ?? 15,
      items: { create: orderItemsData },
    },
    include: { items: true },
  });

  for (const item of orderItemsData) {
    await prisma.product.updateMany({
      where: { id: item.productId, stock: { gt: 0 } },
      data: { stock: { decrement: item.quantity } },
    });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  await sendEmail({
    to: process.env.ADMIN_NOTIFICATION_EMAIL,
    subject: `Nouvelle commande #${order.id.slice(0, 8)} — ARoyal Pastry`,
    html: orderAdminEmailHtml(order, siteUrl),
  });
  if (customerEmail) {
    await sendEmail({
      to: customerEmail,
      subject: "Confirmation de votre commande — ARoyal Pastry",
      html: orderCustomerEmailHtml(order),
    });
  }

  return Response.json(
    { order, paymentResult },
    { status: paymentResult.success ? 201 : 402 }
  );
}
