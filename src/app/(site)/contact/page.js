import { prisma } from "@/lib/prisma";

export const metadata = { title: "Nous trouver — ARoyal Pastry" };

const ADDRESS = "214 Ngaoundéré Bini, Ngaoundéré, Cameroun";

export default async function ContactPage() {
  const settings = await prisma.settings.upsert({
    where: { id: "settings" },
    update: {},
    create: { id: "settings" },
  });

  const mapsEmbedSrc = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    ? `https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(ADDRESS)}&zoom=16`
    : `https://www.google.com/maps?q=${encodeURIComponent(ADDRESS)}&output=embed`;
  const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ADDRESS)}`;

  return (
    <div className="mx-auto max-w-[1600px] px-6 py-12 sm:px-12">
      <h1 className="section-title">Nous trouver</h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-2">
        <div>
          <div className="card space-y-3 p-6">
            <p><b>Adresse :</b> {ADDRESS}</p>
            <p><b>Téléphone :</b> +237 6XX XXX XXX</p>
            <p><b>Email :</b> franktedongmo@gmail.com</p>
            <p><b>Heures d&apos;ouverture :</b> {settings.openingHours}</p>
            {settings.holidays && <p><b>Jours fériés :</b> {settings.holidays}</p>}
            <p><b>Zone de livraison :</b> {settings.deliveryZone}</p>
            <a href={mapsLink} target="_blank" rel="noopener noreferrer" className="btn-outline mt-4 inline-block">
              Ouvrir dans Google Maps
            </a>
          </div>

          <form className="card mt-6 space-y-4 p-6">
            <h2 className="font-serif text-xl text-cocoa dark:text-gold-100">Une question ?</h2>
            <input placeholder="Votre nom" className="w-full rounded-lg border border-gold-300 px-4 py-2" />
            <input placeholder="Votre email" type="email" className="w-full rounded-lg border border-gold-300 px-4 py-2" />
            <textarea placeholder="Votre message" className="w-full rounded-lg border border-gold-300 px-4 py-2" />
            <a href="https://wa.me/237600000000" target="_blank" rel="noopener noreferrer" className="btn-gold inline-block">
              Envoyer sur WhatsApp
            </a>
          </form>
        </div>

        <div className="overflow-hidden rounded-2xl border border-gold-200">
          <iframe
            title="ARoyal Pastry sur Google Maps"
            src={mapsEmbedSrc}
            width="100%"
            height="500"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </div>
  );
}
