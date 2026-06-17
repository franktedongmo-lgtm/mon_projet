# ARoyal Pastry — Site e-commerce & dashboard admin

Site web complet pour ARoyal Pastry, pâtisserie et restauration artisanale à
Ngaoundéré, Cameroun. Construit avec **Next.js 14 (App Router)**, **Prisma
(SQLite)** et **Tailwind CSS**.

## Fonctionnalités

- Page d'accueil large (landing), catalogue filtrable, page produit, panier,
  checkout, suivi de commande, avis clients, page contact avec Google Maps.
- Paiements : Orange Money, MTN Mobile Money, Carte (Stripe), PayPal — en
  mode **simulateur sandbox** par défaut, bascule automatique sur l'API
  réelle si les clés sont renseignées dans `.env`.
- Emails automatiques (admin + client) à la commande, via Nodemailer. Si
  aucun SMTP n'est configuré, les emails sont affichés dans la console
  (simulateur).
- Dashboard admin protégé (NextAuth) : statistiques (visiteurs, commandes,
  CA, avis), CRUD produits, gestion des commandes et statuts, modération
  des avis, paramètres (horaires, délais, frais de livraison), export CSV.
- Compteur de visiteurs uniques par session.
- Codes promo, badges "top vente" / "nouveauté", bouton WhatsApp flottant.

## Installation

```bash
npm install
cp .env.example .env   # puis renseignez vos clés si besoin
npx prisma migrate dev --name init
npm run db:seed        # crée le compte admin + produits de démo + code promo
npm run dev
```

Le site est accessible sur http://localhost:3000.
L'admin est sur http://localhost:3000/admin/login.

Identifiants admin par défaut (modifiables dans `.env` avant le seed) :
- Email : `franktedongmo@gmail.com`
- Mot de passe : `ARoyal2024!`

## Variables d'environnement (`.env`)

Voir `.env.example` pour la liste complète. Tant que les clés des
prestataires (Stripe, PayPal, Orange Money, MTN MoMo, SMTP, Google Maps) ne
sont pas renseignées, le site utilise des simulateurs fonctionnels :
- Paiements : succès simulé avec une référence `*-SIM-<timestamp>`.
- Emails : affichés dans la console du serveur.
- Carte : Google Maps embed en mode public (sans clé API).

## Passage en production

1. Renseigner `DATABASE_URL` (PostgreSQL/MySQL recommandé en prod) et lancer
   `npx prisma migrate deploy`.
2. Renseigner les clés Stripe (live), PayPal (live), les API Orange
   Money / MTN MoMo réelles, et un SMTP (SendGrid/Brevo/Gmail App
   Password).
3. Renseigner `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` pour la carte interactive
   complète.
4. Changer `NEXTAUTH_SECRET` et le mot de passe admin.
5. Déployer le frontend/backend (mono-repo Next.js) sur Vercel, Railway ou
   un VPS avec Node.js.

## Structure

- `src/app/(site)` — pages publiques.
- `src/app/admin` — dashboard admin (protégé par middleware NextAuth).
- `src/app/api` — routes API (produits, commandes, avis, paiements,
  paramètres, stats, export).
- `src/lib` — Prisma client, auth, mailer, simulateurs de paiement,
  contexte panier.
- `prisma/schema.prisma` — schéma de base de données.
- `prisma/seed.js` — données de démonstration.

## Notes

- Les prix sont stockés et affichés en FCFA (XAF), sans décimales.
- Les avis sont soumis à modération admin avant publication.
- La zone de livraison est limitée à Ngaoundéré (configurable dans
  Paramètres admin).
