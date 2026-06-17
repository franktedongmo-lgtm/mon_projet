export default function Footer() {
  return (
    <footer className="mt-20 border-t border-gold-100 bg-cocoa text-gold-100 dark:border-gold-800">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-8 md:grid-cols-4">
        <div>
          <h3 className="font-serif text-xl text-gold-200">ARoyal Pastry</h3>
          <p className="mt-3 text-sm text-gold-100/80">
            Pâtisserie & restauration artisanale à Ngaoundéré, Cameroun.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-gold-300">Liens</h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li><a href="/catalogue" className="hover:text-gold-400">Catalogue</a></li>
            <li><a href="/avis" className="hover:text-gold-400">Avis clients</a></li>
            <li><a href="/contact" className="hover:text-gold-400">Nous trouver</a></li>
            <li><a href="/suivi" className="hover:text-gold-400">Suivi de commande</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-gold-300">Contact</h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li>214 Ngaoundéré Bini, Ngaoundéré, Cameroun</li>
            <li>+237 6XX XXX XXX</li>
            <li>franktedongmo@gmail.com</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-gold-300">Suivez-nous</h4>
          <div className="mt-3 flex gap-3">
            <a
              href="https://www.facebook.com/ARoyalPastry"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gold-300 hover:bg-gold-500/20"
              aria-label="Facebook"
            >
              f
            </a>
            <a
              href="https://www.instagram.com/aroyalpastry"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gold-300 hover:bg-gold-500/20"
              aria-label="Instagram"
            >
              ig
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-gold-800 px-4 py-4 text-center text-xs text-gold-100/60">
        © {new Date().getFullYear()} ARoyal Pastry — Tous droits réservés.
      </div>
    </footer>
  );
}
