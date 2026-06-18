"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/customers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Erreur lors de l'inscription");
      setLoading(false);
      return;
    }
    const signInRes = await signIn("customer", {
      redirect: false,
      email: form.email,
      password: form.password,
    });
    setLoading(false);
    if (signInRes?.error) {
      router.push("/compte/connexion");
      return;
    }
    router.push("/compte/dashboard");
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-4 py-16">
      <form onSubmit={handleSubmit} className="w-full rounded-2xl border border-gold-200 bg-white p-8 shadow-xl">
        <h1 className="font-serif text-2xl text-cocoa">Créer mon compte</h1>
        <div className="mt-6 space-y-4">
          <input
            required
            placeholder="Nom complet"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full rounded-lg border border-gold-300 px-4 py-2"
          />
          <input
            required
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full rounded-lg border border-gold-300 px-4 py-2"
          />
          <input
            placeholder="Téléphone (optionnel)"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full rounded-lg border border-gold-300 px-4 py-2"
          />
          <input
            required
            type="password"
            placeholder="Mot de passe"
            minLength={6}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full rounded-lg border border-gold-300 px-4 py-2"
          />
        </div>
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        <button type="submit" disabled={loading} className="btn-gold mt-6 w-full">
          {loading ? "Création..." : "Créer mon compte"}
        </button>
        <p className="mt-4 text-center text-sm text-cocoa/70">
          Déjà inscrit ? <Link href="/compte/connexion" className="text-gold-600 hover:underline">Se connecter</Link>
        </p>
      </form>
    </div>
  );
}
