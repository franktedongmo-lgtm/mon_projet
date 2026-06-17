import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata = {
  title: "ARoyal Pastry — Pâtisserie & Restauration à Ngaoundéré",
  description:
    "ARoyal Pastry, pâtisserie et restauration artisanale à Ngaoundéré, Cameroun. Gâteaux, viennoiseries, boissons et plats. Commandez en ligne, paiement Orange Money, MTN Mobile Money, carte bancaire et PayPal.",
  keywords: ["pâtisserie", "Ngaoundéré", "Cameroun", "gâteaux", "ARoyal Pastry", "restauration"],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
