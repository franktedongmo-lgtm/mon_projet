import { prisma } from "@/lib/prisma";
import StarRating from "@/components/StarRating";
import ReviewForm from "./ReviewForm";

export const metadata = { title: "Avis clients — ARoyal Pastry" };

export default async function AvisPage() {
  const reviews = await prisma.review.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });
  const avg = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;

  return (
    <div className="mx-auto max-w-4xl px-6 py-12 sm:px-12">
      <h1 className="section-title">Avis clients</h1>
      {reviews.length > 0 && (
        <div className="mt-4 flex items-center gap-3">
          <StarRating value={avg} size="h-6 w-6" />
          <span className="text-cocoa/70">{avg.toFixed(1)} / 5 ({reviews.length} avis)</span>
        </div>
      )}

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {reviews.map((r) => (
          <div key={r.id} className="card p-5">
            <StarRating value={r.rating} />
            <p className="mt-2 italic text-cocoa/80 dark:text-gold-100/80">“{r.comment}”</p>
            <p className="mt-2 text-sm font-semibold text-gold-600">
              — {r.pseudo} · {new Date(r.createdAt).toLocaleDateString("fr-FR")}
            </p>
          </div>
        ))}
        {reviews.length === 0 && <p className="text-cocoa/60">Aucun avis publié pour le moment.</p>}
      </div>

      <div className="mt-12">
        <h2 className="font-serif text-2xl text-cocoa dark:text-gold-100">Laisser un avis</h2>
        <p className="mt-1 text-sm text-cocoa/60">
          Votre avis sera publié après validation par notre équipe.
        </p>
        <ReviewForm />
      </div>
    </div>
  );
}
