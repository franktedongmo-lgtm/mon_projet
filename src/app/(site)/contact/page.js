import { prisma } from "@/lib/prisma";
import ContactForm from "@/components/ContactForm";
import LocationSection from "@/components/LocationSection";

export const metadata = { title: "Nous trouver — ARoyal Pastry" };

export default async function ContactPage() {
  const settings = await prisma.settings.upsert({
    where: { id: "settings" },
    update: {},
    create: { id: "settings" },
  });

  return (
    <div className="mx-auto max-w-[1600px] px-6 py-12 sm:px-12">
      <h1 className="section-title">Nous trouver</h1>

      <div className="mt-8 space-y-10">
        <LocationSection settings={settings} />
        <div className="max-w-xl">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
