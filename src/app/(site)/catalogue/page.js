import { Suspense } from "react";
import CatalogueClient from "./CatalogueClient";

export const metadata = { title: "Catalogue — ARoyal Pastry" };

export default function CataloguePage() {
  return (
    <Suspense>
      <CatalogueClient />
    </Suspense>
  );
}
