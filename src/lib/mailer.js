import nodemailer from "nodemailer";

function getTransport() {
  if (!process.env.SMTP_HOST) return null;
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: process.env.SMTP_USER
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      : undefined,
  });
}

// Sends an email via SMTP if configured, otherwise logs to console (dev simulator)
// so the flow is fully testable without real credentials.
export async function sendEmail({ to, subject, html }) {
  const transport = getTransport();
  if (!transport) {
    console.log("\n--- [SIMULATEUR EMAIL] ---");
    console.log("To:", to);
    console.log("Subject:", subject);
    console.log(html.replace(/<[^>]+>/g, " ").slice(0, 500));
    console.log("--------------------------\n");
    return { simulated: true };
  }
  return transport.sendMail({
    from: process.env.SMTP_FROM || "ARoyal Pastry <no-reply@aroyalpastry.com>",
    to,
    subject,
    html,
  });
}

export function orderAdminEmailHtml(order, siteUrl) {
  const itemsHtml = order.items
    .map(
      (i) =>
        `<tr><td style="padding:4px 8px">${i.name}</td><td style="padding:4px 8px">x${i.quantity}</td><td style="padding:4px 8px">${i.price * i.quantity} FCFA</td></tr>`
    )
    .join("");
  return `
    <div style="font-family:sans-serif">
      <h2>Nouvelle commande #${order.id.slice(0, 8)}</h2>
      <p><b>Client :</b> ${order.customerName} — ${order.customerPhone}</p>
      <p><b>Adresse :</b> ${order.deliveryAddress}</p>
      <p><b>Paiement :</b> ${order.paymentMethod} (${order.paymentStatus})</p>
      <table border="0" cellspacing="0">${itemsHtml}</table>
      <p><b>Sous-total :</b> ${order.subtotal} FCFA</p>
      <p><b>Livraison :</b> ${order.deliveryFee} FCFA</p>
      <p><b>Remise :</b> -${order.discount} FCFA</p>
      <p><b>Total :</b> ${order.total} FCFA</p>
      <p><a href="${siteUrl}/admin/orders/${order.id}">Voir la commande dans le dashboard</a></p>
    </div>
  `;
}

export function orderCustomerEmailHtml(order) {
  return `
    <div style="font-family:sans-serif">
      <h2>Merci pour votre commande, ${order.customerName} !</h2>
      <p>Votre commande #${order.id.slice(0, 8)} chez ARoyal Pastry a bien été reçue.</p>
      <p><b>Préparation estimée :</b> ${order.prepMinutes} min</p>
      <p><b>Livraison estimée :</b> ${order.deliveryMinutes} min</p>
      <p><b>Total :</b> ${order.total} FCFA</p>
      <p>Nous vous tiendrons informé de l'avancement de votre commande.</p>
      <p>— L'équipe ARoyal Pastry, Ngaoundéré</p>
    </div>
  `;
}
