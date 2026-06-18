import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { formatXAF } from "@/lib/format";
import PDFDocument from "pdfkit";

export async function GET(req, { params }) {
  const session = await getServerSession(authOptions);
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: { items: true },
  });
  if (!order) return Response.json({ error: "Commande non trouvée" }, { status: 404 });

  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");
  const isOwner = session?.user?.role === "CUSTOMER" && session.user.id === order.customerId;
  const isAdmin = session?.user?.role === "ADMIN";
  const hasValidToken = token && token === order.reviewToken;
  if (!isOwner && !isAdmin && !hasValidToken) {
    return Response.json({ error: "Non autorisé" }, { status: 401 });
  }

  const doc = new PDFDocument({ margin: 50 });
  const chunks = [];
  doc.on("data", (chunk) => chunks.push(chunk));

  doc.fontSize(20).text("ARoyal Pastry", { align: "left" });
  doc.fontSize(10).text("Ngaoundéré, Cameroun — franktedongmo@gmail.com");
  doc.moveDown();
  doc.fontSize(16).text(`Facture #${order.id.slice(0, 8)}`);
  doc.fontSize(10).text(`Date : ${new Date(order.createdAt).toLocaleDateString("fr-FR")}`);
  doc.moveDown();
  doc.fontSize(12).text(`Client : ${order.customerName}`);
  doc.text(`Téléphone : ${order.customerPhone}`);
  if (order.customerEmail) doc.text(`Email : ${order.customerEmail}`);
  doc.text(`Adresse de livraison : ${order.deliveryAddress}`);
  doc.moveDown();

  doc.fontSize(12).text("Articles", { underline: true });
  doc.moveDown(0.5);
  order.items.forEach((item) => {
    doc.fontSize(11).text(`${item.name}  x${item.quantity}  —  ${formatXAF(item.price * item.quantity)}`);
  });
  doc.moveDown();

  doc.fontSize(11).text(`Sous-total : ${formatXAF(order.subtotal)}`);
  doc.text(`Livraison : ${formatXAF(order.deliveryFee)}`);
  if (order.discount > 0) doc.text(`Remise : -${formatXAF(order.discount)}`);
  doc.fontSize(13).text(`Total : ${formatXAF(order.total)}`, { underline: true });
  doc.moveDown();
  doc.fontSize(10).text(`Mode de paiement : ${order.paymentMethod} (${order.paymentStatus})`);
  doc.text(`Statut de la commande : ${order.status}`);

  doc.end();

  const pdfBuffer = await new Promise((resolve) => {
    doc.on("end", () => resolve(Buffer.concat(chunks)));
  });

  return new Response(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="facture-${order.id.slice(0, 8)}.pdf"`,
    },
  });
}
