export default function WhatsAppButton() {
  const phone = "237600000000";
  const message = encodeURIComponent("Bonjour ARoyal Pastry, je voudrais passer une commande.");
  return (
    <a
      href={`https://wa.me/${phone}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-2xl text-white shadow-lg transition hover:scale-105"
      aria-label="Commander sur WhatsApp"
    >
      💬
    </a>
  );
}
