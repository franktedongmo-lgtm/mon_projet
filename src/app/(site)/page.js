import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";
import StarRating from "@/components/StarRating";
import OrderModal from "@/components/OrderModal";
import ContactForm from "@/components/ContactForm";
import LocationSection from "@/components/LocationSection";
import { categoryLabel } from "@/lib/format";

async function getHomeData() {
  const [topSales, newProducts, reviews, visitors, settings] = await Promise.all([
    prisma.product.findMany({ where: { active: true, isTopSale: true }, take: 6 }),
    prisma.product.findMany({ where: { active: true, isNew: true }, take: 4 }),
    prisma.review.findMany({ where: { published: true }, orderBy: { createdAt: "desc" }, take: 6 }),
    prisma.visit.count(),
    prisma.settings.upsert({ where: { id: "settings" }, update: {}, create: { id: "settings" } }),
  ]);
  return { topSales, newProducts, reviews, visitors, settings };
}

export default async function HomePage() {
  const { topSales, newProducts, reviews, visitors, settings } = await getHomeData();
  const modalProducts = [...topSales, ...newProducts].slice(0, 8);

  return (
    <div>
      {/* HERO */}
      <section className="relative w-full overflow-hidden bg-gradient-to-br from-cocoa via-gold-700 to-gold-500 text-white">
        <div className="mx-auto flex min-h-[80vh] w-full max-w-[1600px] flex-col items-center justify-center gap-8 px-6 py-24 text-center sm:px-12">
          <span className="rounded-full border border-gold-200/50 bg-white/10 px-4 py-1 text-sm font-medium tracking-wide">
            Ngaoundéré, Cameroun
          </span>
          <h1 className="font-serif text-4xl font-bold leading-tight sm:text-6xl lg:text-7xl">
            ARoyal Pastry
          </h1>
          <p className="max-w-2xl text-lg text-gold-50/90 sm:text-xl">
            Pâtisserie & restauration artisanale d&apos;exception. Gâteaux sur-mesure, viennoiseries
            fraîches, boissons et plats préparés avec passion, livrés chez vous.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <OrderModal products={modalProducts} trigger="Commander maintenant" />
            <a
              href="#localisation"
              className="rounded-full border-2 border-white/70 px-6 py-3 font-semibold transition hover:bg-white/10"
            >
              Nous trouver
            </a>
          </div>
          <p className="text-sm text-gold-100/80">
            {visitors.toLocaleString("fr-FR")} visiteurs nous font déjà confiance
          </p>
        </div>
      </section>

      {/* À PROPOS */}
      <section className="mx-auto w-full max-w-[1600px] px-6 py-16 sm:px-12">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <h2 className="section-title">Notre savoir-faire</h2>
            <p className="mt-4 text-cocoa/80 dark:text-gold-100/80">
              Depuis Ngaoundéré, ARoyal Pastry confectionne chaque jour des gâteaux sur-mesure, des
              viennoiseries fraîches et des plats traditionnels camerounais, avec des ingrédients
              soigneusement sélectionnés et un savoir-faire artisanal transmis de génération en
              génération.
            </p>
            <p className="mt-4 text-cocoa/80 dark:text-gold-100/80">
              Que ce soit pour un événement, un cadeau gourmand ou simplement pour se faire plaisir,
              notre équipe met tout son cœur dans chaque création, livrée fraîche directement chez
              vous.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="card flex flex-col items-center gap-2 p-6 text-center">
              <span className="font-serif text-3xl text-gold-600">100%</span>
              <span className="text-sm text-cocoa/70 dark:text-gold-100/70">Artisanal & frais</span>
            </div>
            <div className="card flex flex-col items-center gap-2 p-6 text-center">
              <span className="font-serif text-3xl text-gold-600">7j/7</span>
              <span className="text-sm text-cocoa/70 dark:text-gold-100/70">Livraison à Ngaoundéré</span>
            </div>
            <div className="card flex flex-col items-center gap-2 p-6 text-center">
              <span className="font-serif text-3xl text-gold-600">4</span>
              <span className="text-sm text-cocoa/70 dark:text-gold-100/70">Catégories de produits</span>
            </div>
            <div className="card flex flex-col items-center gap-2 p-6 text-center">
              <span className="font-serif text-3xl text-gold-600">{visitors}</span>
              <span className="text-sm text-cocoa/70 dark:text-gold-100/70">Visiteurs satisfaits</span>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="mx-auto w-full max-w-[1600px] px-6 py-16 sm:px-12">
        <h2 className="section-title text-center">Nos catégories</h2>
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {["GATEAUX", "VIENNOISERIES", "BOISSONS", "PLATS"].map((cat) => (
            <Link
              key={cat}
              href={`/catalogue?category=${cat}`}
              className="card flex flex-col items-center gap-3 p-8 text-center transition hover:-translate-y-1 hover:shadow-lg"
            >
              <span className="font-serif text-xl text-cocoa dark:text-gold-100">
                {categoryLabel(cat)}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* TOP SALES */}
      {topSales.length > 0 && (
        <section className="mx-auto w-full max-w-[1600px] px-6 py-16 sm:px-12">
          <div className="flex items-center justify-between">
            <h2 className="section-title">Nos meilleures ventes</h2>
            <Link href="/catalogue" className="text-gold-600 hover:underline">
              Tout voir →
            </Link>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {topSales.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* NEW PRODUCTS */}
      {newProducts.length > 0 && (
        <section className="mx-auto w-full max-w-[1600px] px-6 py-16 sm:px-12">
          <h2 className="section-title">Nos nouveautés</h2>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {newProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* REVIEWS */}
      <section id="avis" className="w-full bg-cream py-16 dark:bg-cocoa/40">
        <div className="mx-auto max-w-[1600px] px-6 sm:px-12">
          <h2 className="section-title text-center">Ce que disent nos clients</h2>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {reviews.length === 0 && (
              <p className="col-span-3 text-center text-cocoa/60">
                Soyez le premier à laisser un avis !
              </p>
            )}
            {reviews.map((r) => (
              <div key={r.id} className="card p-6">
                <StarRating value={r.rating} />
                <p className="mt-3 italic text-cocoa/80 dark:text-gold-100/80">“{r.comment}”</p>
                <p className="mt-3 font-semibold text-gold-600">— {r.pseudo}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/avis" className="btn-outline">
              Voir tous les avis / Laisser un avis
            </Link>
          </div>
        </div>
      </section>

      {/* CONTACT + LOCALISATION */}
      <section className="mx-auto w-full max-w-[1600px] px-6 py-16 sm:px-12">
        <h2 className="section-title text-center">Nous trouver & nous écrire</h2>
        <div className="mt-10 grid gap-10 lg:grid-cols-2">
          <ContactForm />
          <LocationSection settings={settings} />
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto w-full max-w-[1600px] px-6 py-20 text-center sm:px-12">
        <h2 className="section-title">Envie de nous commander ?</h2>
        <p className="mx-auto mt-4 max-w-xl text-cocoa/70 dark:text-gold-100/70">
          Paiement sécurisé via Orange Money, MTN Mobile Money, carte bancaire ou PayPal. Livraison
          rapide sur Ngaoundéré.
        </p>
        <div className="mt-8">
          <OrderModal products={modalProducts} trigger="Commander maintenant" />
        </div>
      </section>
    </div>
  );
}
