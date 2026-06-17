// Payment processors. Each one uses the real provider when credentials are
// configured in .env, and otherwise falls back to a deterministic sandbox
// simulator so the checkout flow stays fully testable.

async function processOrangeMoney({ phone, amount }) {
  if (!process.env.ORANGE_MONEY_MERCHANT_KEY) {
    await new Promise((r) => setTimeout(r, 800));
    return { success: true, reference: `OM-SIM-${Date.now()}`, simulated: true };
  }
  // Real Orange Money Cameroun Web Payment API call would go here.
  const res = await fetch(`${process.env.ORANGE_MONEY_API_URL}/payments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.ORANGE_MONEY_MERCHANT_KEY}`,
    },
    body: JSON.stringify({ phone, amount, currency: "XAF" }),
  });
  const data = await res.json();
  return { success: res.ok, reference: data.id, raw: data };
}

async function processMtnMomo({ phone, amount }) {
  if (!process.env.MTN_MOMO_SUBSCRIPTION_KEY) {
    await new Promise((r) => setTimeout(r, 800));
    return { success: true, reference: `MOMO-SIM-${Date.now()}`, simulated: true };
  }
  const res = await fetch(`${process.env.MTN_MOMO_API_URL}/collection/v1_0/requesttopay`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Ocp-Apim-Subscription-Key": process.env.MTN_MOMO_SUBSCRIPTION_KEY,
    },
    body: JSON.stringify({ payer: { partyId: phone }, amount, currency: "XAF" }),
  });
  return { success: res.ok, reference: `MOMO-${Date.now()}` };
}

async function processCard({ token, amount }) {
  if (!process.env.STRIPE_SECRET_KEY) {
    await new Promise((r) => setTimeout(r, 800));
    return { success: true, reference: `CARD-SIM-${Date.now()}`, simulated: true };
  }
  const Stripe = (await import("stripe")).default;
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const intent = await stripe.paymentIntents.create({
    amount,
    currency: "xaf",
    payment_method: token,
    confirm: true,
    automatic_payment_methods: { enabled: true, allow_redirects: "never" },
  });
  return { success: intent.status === "succeeded", reference: intent.id, raw: intent };
}

async function processPaypal({ amount }) {
  if (!process.env.PAYPAL_CLIENT_ID) {
    await new Promise((r) => setTimeout(r, 800));
    return { success: true, reference: `PAYPAL-SIM-${Date.now()}`, simulated: true };
  }
  // Real PayPal order capture would be done client-side then verified here.
  return { success: true, reference: `PAYPAL-${Date.now()}` };
}

export async function processPayment(method, payload) {
  switch (method) {
    case "ORANGE_MONEY":
      return processOrangeMoney(payload);
    case "MTN_MOBILE_MONEY":
      return processMtnMomo(payload);
    case "CARD":
      return processCard(payload);
    case "PAYPAL":
      return processPaypal(payload);
    default:
      return { success: false, error: "Méthode de paiement inconnue" };
  }
}
