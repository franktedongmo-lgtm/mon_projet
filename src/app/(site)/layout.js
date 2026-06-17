import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import VisitTracker from "@/components/VisitTracker";

export default function SiteLayout({ children }) {
  return (
    <>
      <VisitTracker />
      <Header />
      <main>{children}</main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
