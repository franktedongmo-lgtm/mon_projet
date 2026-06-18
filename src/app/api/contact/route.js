import { sendEmail } from "@/lib/mailer";

export async function POST(req) {
  const { name, email, message } = await req.json();
  if (!name || !email || !message) {
    return Response.json({ error: "Champs requis manquants" }, { status: 400 });
  }

  await sendEmail({
    to: process.env.ADMIN_NOTIFICATION_EMAIL,
    subject: `Nouveau message de contact — ${name}`,
    html: `<p><b>Nom :</b> ${name}</p><p><b>Email :</b> ${email}</p><p><b>Message :</b></p><p>${message}</p>`,
  });

  return Response.json({ success: true });
}
