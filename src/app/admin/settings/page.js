"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import ImageUpload from "@/components/ImageUpload";

export default function AdminSettingsPage() {
  const { update: updateSession } = useSession();
  const [form, setForm] = useState(null);
  const [profile, setProfile] = useState(null);
  const [saved, setSaved] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);

  useEffect(() => {
    fetch("/api/settings").then((r) => r.json()).then(setForm);
    fetch("/api/admin/profile").then((r) => r.json()).then(setProfile);
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function handleProfileSubmit(e) {
    e.preventDefault();
    const res = await fetch("/api/admin/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    });
    const data = await res.json();
    await updateSession({ name: data.name, image: data.profileImage });
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2000);
  }

  if (!form || !profile) return <p>Chargement...</p>;

  return (
    <div className="max-w-xl space-y-10">
      <div>
        <h1 className="font-serif text-3xl text-cocoa">Mon profil</h1>
        <form onSubmit={handleProfileSubmit} className="mt-6 space-y-4 rounded-2xl border border-gold-200 bg-white p-6">
          <ImageUpload
            label="Photo de profil"
            value={profile.profileImage}
            onChange={(url) => setProfile({ ...profile, profileImage: url })}
          />
          <div>
            <label className="text-sm font-semibold text-cocoa">Nom</label>
            <input
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="mt-1 w-full rounded-lg border border-gold-300 px-4 py-2"
            />
          </div>
          <button type="submit" className="btn-gold">Enregistrer mon profil</button>
          {profileSaved && <p className="text-green-600">Profil mis à jour !</p>}
        </form>
      </div>

      <div>
        <h1 className="font-serif text-3xl text-cocoa">Paramètres de la boutique</h1>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4 rounded-2xl border border-gold-200 bg-white p-6">
          <div>
            <label className="text-sm font-semibold text-cocoa">Heures d&apos;ouverture</label>
            <input
              value={form.openingHours}
              onChange={(e) => setForm({ ...form, openingHours: e.target.value })}
              className="mt-1 w-full rounded-lg border border-gold-300 px-4 py-2"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-cocoa">Jours fériés</label>
            <input
              value={form.holidays}
              onChange={(e) => setForm({ ...form, holidays: e.target.value })}
              className="mt-1 w-full rounded-lg border border-gold-300 px-4 py-2"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-cocoa">Zone de livraison</label>
            <input
              value={form.deliveryZone}
              onChange={(e) => setForm({ ...form, deliveryZone: e.target.value })}
              className="mt-1 w-full rounded-lg border border-gold-300 px-4 py-2"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-cocoa">Préparation par défaut (min)</label>
              <input
                type="number"
                value={form.defaultPrepMinutes}
                onChange={(e) => setForm({ ...form, defaultPrepMinutes: e.target.value })}
                className="mt-1 w-full rounded-lg border border-gold-300 px-4 py-2"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-cocoa">Livraison par défaut (min)</label>
              <input
                type="number"
                value={form.defaultDeliveryMinutes}
                onChange={(e) => setForm({ ...form, defaultDeliveryMinutes: e.target.value })}
                className="mt-1 w-full rounded-lg border border-gold-300 px-4 py-2"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold text-cocoa">Frais de livraison (FCFA)</label>
            <input
              type="number"
              value={form.deliveryFee}
              onChange={(e) => setForm({ ...form, deliveryFee: e.target.value })}
              className="mt-1 w-full rounded-lg border border-gold-300 px-4 py-2"
            />
          </div>
          <button type="submit" className="btn-gold">Enregistrer</button>
          {saved && <p className="text-green-600">Paramètres enregistrés !</p>}
        </form>
      </div>
    </div>
  );
}
