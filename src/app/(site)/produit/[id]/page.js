import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { formatXAF, categoryLabel } from "@/lib/format";
import StarRating from "@/components/StarRating";
import AddToCartBox from "./AddToCartBox";

async function getProduct(id) {
  return prisma.product.findUnique({
    where: { id },
    include: { reviews: { where: { published: true }, orderBy: { createdAt: "desc" } } },
  });
}

export default async function ProductPage({ params }) {
  const product = await getProduct(params.id);
  if (!product) notFound();

  const avgRating = product.reviews.length
    ? product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length
    : 0;

  return (
    <div className="mx-auto max-w-[1600px] px-6 py-12 sm:px-12">
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="aspect-square overflow-hidden rounded-2xl bg-gold-50">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-8xl">🍰</div>
          )}
        </div>

        <div>
          <span className="rounded-full bg-gold-100 px-3 py-1 text-sm text-gold-700">
            {categoryLabel(product.category)}
          </span>
          <h1 className="mt-4 font-serif text-4xl text-cocoa dark:text-gold-100">{product.name}</h1>
          {product.reviews.length > 0 && (
            <div className="mt-2 flex items-center gap-2">
              <StarRating value={avgRating} />
              <span className="text-sm text-cocoa/60">({product.reviews.length} avis)</span>
            </div>
          )}
          <p className="mt-4 text-cocoa/80 dark:text-gold-100/80">{product.description}</p>

          <div className="mt-6 flex items-center gap-3">
            {product.promoPrice ? (
              <>
                <span className="text-3xl font-bold text-gold-600">{formatXAF(product.promoPrice)}</span>
                <span className="text-xl text-cocoa/40 line-through">{formatXAF(product.price)}</span>
              </>
            ) : (
              <span className="text-3xl font-bold text-gold-600">{formatXAF(product.price)}</span>
            )}
          </div>

          <p className="mt-2 text-sm text-cocoa/60">
            Préparation estimée : {product.prepMinutes} min · Stock : {product.stock > 0 ? product.stock : "Épuisé"}
          </p>

          <AddToCartBox product={product} />
        </div>
      </div>

      {product.reviews.length > 0 && (
        <div className="mt-16">
          <h2 className="section-title">Avis sur ce produit</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {product.reviews.map((r) => (
              <div key={r.id} className="card p-5">
                <StarRating value={r.rating} />
                <p className="mt-2 italic text-cocoa/80 dark:text-gold-100/80">“{r.comment}”</p>
                <p className="mt-2 text-sm font-semibold text-gold-600">— {r.pseudo}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
