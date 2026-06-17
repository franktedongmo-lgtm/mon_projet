"use client";
import { useEffect, useState } from "react";
import ProductForm from "@/components/ProductForm";

export default function EditProductPage({ params }) {
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetch(`/api/products/${params.id}`).then((r) => r.json()).then(setProduct);
  }, [params.id]);

  if (!product) return <p>Chargement...</p>;

  return (
    <div>
      <h1 className="font-serif text-3xl text-cocoa">Modifier {product.name}</h1>
      <div className="mt-6">
        <ProductForm initial={product} productId={params.id} />
      </div>
    </div>
  );
}
