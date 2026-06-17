import ProductForm from "@/components/ProductForm";

export default function NewProductPage() {
  return (
    <div>
      <h1 className="font-serif text-3xl text-cocoa">Nouveau produit</h1>
      <div className="mt-6">
        <ProductForm />
      </div>
    </div>
  );
}
