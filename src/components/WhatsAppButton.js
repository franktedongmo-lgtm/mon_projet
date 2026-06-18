export default function WhatsAppButton() {
  const phone = "237600000000";
  const message = encodeURIComponent("Bonjour ARoyal Pastry, je voudrais passer une commande.");
  return (
    <a
      href={`https://wa.me/${phone}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg transition hover:scale-105"
      aria-label="Commander sur WhatsApp"
    >
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7">
        <path d="M17.6 6.32A8.86 8.86 0 0 0 12.05 4a8.96 8.96 0 0 0-7.77 13.4L3 21l3.7-1.25a8.93 8.93 0 0 0 5.35 1.71h.01a8.92 8.92 0 0 0 8.91-8.92 8.86 8.86 0 0 0-3.37-6.22Zm-5.55 13.7h-.01a7.4 7.4 0 0 1-3.78-1.04l-.27-.16-2.81.95.94-2.74-.18-.28a7.42 7.42 0 0 1-1.14-3.96 7.45 7.45 0 0 1 12.71-5.27 7.36 7.36 0 0 1 2.18 5.25 7.45 7.45 0 0 1-7.44 7.25Zm4.08-5.58c-.22-.11-1.31-.65-1.51-.72-.2-.08-.35-.11-.5.11-.15.22-.57.72-.7.87-.13.15-.26.16-.48.05a6.1 6.1 0 0 1-1.79-1.1 6.7 6.7 0 0 1-1.24-1.54c-.13-.22-.01-.34.11-.45.11-.11.25-.28.37-.42.12-.14.16-.24.24-.4.08-.15.04-.28-.02-.4-.06-.11-.55-1.33-.76-1.82-.2-.48-.41-.42-.56-.42-.14-.01-.31-.01-.47-.01-.16 0-.42.06-.64.28-.22.22-.85.83-.85 2.02 0 1.19.87 2.34.99 2.5.12.16 1.65 2.52 4 3.43 1.99.77 2.39.62 2.83.58.44-.04 1.31-.53 1.49-1.05.18-.51.18-.95.13-1.05-.06-.1-.22-.16-.44-.27Z" />
      </svg>
    </a>
  );
}
