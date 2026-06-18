const ADDRESS = "214 Ngaoundéré Bini, Ngaoundéré, Cameroun";

export default function LocationSection({ settings }) {
  const mapsEmbedSrc = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    ? `https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(ADDRESS)}&zoom=16`
    : `https://www.google.com/maps?q=${encodeURIComponent(ADDRESS)}&output=embed`;
  const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ADDRESS)}`;

  return (
    <div id="localisation" className="grid gap-10 lg:grid-cols-2">
      <div className="card space-y-3 p-6">
        <p><b>Adresse :</b> {ADDRESS}</p>
        <p><b>Téléphone :</b> +237 6XX XXX XXX</p>
        <p><b>Email :</b> franktedongmo@gmail.com</p>
        {settings && (
          <>
            <p><b>Heures d&apos;ouverture :</b> {settings.openingHours}</p>
            {settings.holidays && <p><b>Jours fériés :</b> {settings.holidays}</p>}
            <p><b>Zone de livraison :</b> {settings.deliveryZone}</p>
          </>
        )}
        <a href={mapsLink} target="_blank" rel="noopener noreferrer" className="btn-outline mt-4 inline-block">
          Ouvrir dans Google Maps
        </a>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gold-200">
        <iframe
          title="ARoyal Pastry sur Google Maps"
          src={mapsEmbedSrc}
          width="100%"
          height="400"
          style={{ border: 0 }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  );
}
