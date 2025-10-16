import { api } from "@/utils/api";
import Link from "next/link";
import { DeleteButton } from "./delete-button";
import { AddToCartButton } from "./AddToCartButton";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ id: string }> };

export default async function ProductDetail({ params }: Props) {
  const { id } = await params;
  let product;
  try {
    product = await api.getProduct(Number(id));
  } catch {
    return notFound();
  }
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold" style={{color:"var(--accent)"}}>{product.name}</h1>
        <div className="flex gap-2">
          <Link href={`/products/${product.id}/edit`} className="btn-outline">Edit</Link>
          <DeleteButton id={product.id} />
          <Link href={`/`} className="btn-outline">Back</Link>
        </div>
      </div>
      {product.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={product.imageUrl} alt={product.name} className="w-full max-w-2xl rounded-lg border-2" />
      ) : null}
      <p className="text-gray-700 text-base">{product.description}</p>
      <p className="font-extrabold text-3xl" style={{color:"var(--accent)"}}>${product.price.toFixed(2)}</p>
      <AddToCartButton id={product.id} />
    </div>
  );
}



