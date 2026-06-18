"use client";
import { useState } from "react";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("idle");

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setStatus(res.ok ? "sent" : "error");
    if (res.ok) setForm({ name: "", email: "", message: "" });
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-4 p-6">
      <h2 className="font-serif text-xl text-cocoa dark:text-gold-100">Une question ?</h2>
      <input
        required
        placeholder="Votre nom"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className="w-full rounded-lg border border-gold-300 px-4 py-2"
      />
      <input
        required
        type="email"
        placeholder="Votre email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        className="w-full rounded-lg border border-gold-300 px-4 py-2"
      />
      <textarea
        required
        placeholder="Votre message"
        value={form.message}
        onChange={(e) => setForm({ ...form, message: e.target.value })}
        rows={4}
        className="w-full rounded-lg border border-gold-300 px-4 py-2"
      />
      <button type="submit" disabled={status === "sending"} className="btn-gold w-full">
        {status === "sending" ? "Envoi..." : "Envoyer le message"}
      </button>
      {status === "sent" && <p className="text-green-600">Message envoyé ! Nous vous répondrons rapidement.</p>}
      {status === "error" && <p className="text-red-600">Échec de l&apos;envoi. Réessayez ou contactez-nous via WhatsApp.</p>}
    </form>
  );
}
