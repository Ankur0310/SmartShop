"use client";
import { usePreferencesStore } from "@/store/preferencesStore";
import { notFound } from "next/navigation";

export default function ProductDetail({ params }: { params: { id: string } }) {
  const { results } = usePreferencesStore();
  const product = results.find((p) => p.id === params.id);

  if (!product) return notFound();

  return (
    <div className="space-y-6 p-4">
      <h1 className="text-2xl font-bold">{product.name}</h1>
      <p className="text-gray-700 text-lg">{product.price}</p>
      <div className="flex flex-wrap gap-2">
        {product.tags.map((tag, i) => (
          <span
            key={i}
            className="bg-green-100 text-green-800 px-3 py-1 text-sm rounded"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Summary / Description */}
      <p className="text-gray-600 mt-4">{product.summary}</p>

      {/* Placeholder for price graph */}
      <div className="w-full h-64 bg-gray-100 flex items-center justify-center rounded mt-6">
        <span className="text-gray-500">[Price Trend Graph Here]</span>
      </div>

      <div className="mt-4 space-x-4">
        <a
          href={product.buyLink}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Buy Now
        </a>
      </div>
    </div>
  );
}
