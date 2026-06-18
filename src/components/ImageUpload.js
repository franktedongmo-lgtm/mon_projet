"use client";
import { useState } from "react";

export default function ImageUpload({ value, onChange, label = "Image" }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();
    setUploading(false);
    if (!res.ok) {
      setError(data.error || "Échec de l'upload");
      return;
    }
    onChange(data.url);
  }

  return (
    <div>
      <label className="text-sm font-semibold text-cocoa">{label}</label>
      <div className="mt-2 flex items-center gap-4">
        <div className="h-20 w-20 overflow-hidden rounded-xl border border-gold-300 bg-gold-50">
          {value ? (
            <img src={value} alt="Aperçu" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-cocoa/40">
              Aucune image
            </div>
          )}
        </div>
        <div>
          <input type="file" accept="image/*" onChange={handleFile} className="text-sm" />
          {uploading && <p className="mt-1 text-sm text-gold-600">Envoi en cours...</p>}
          {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
      </div>
    </div>
  );
}
