// components/ProductDetail.tsx (or wherever you store your client components)
"use client"; // KEEP THIS - it makes it a Client Component

import { usePreferencesStore } from "@/store/preferencesStore";
import { notFound } from "next/navigation";
import Link from "next/link"; // Required for the Link component

// Define the props for this Client Component
interface ProductDetailProps {
  params: { id: string };
}

export default function ProductDetail({ params }: ProductDetailProps) {
  // Access the `results` array from your Zustand store
  const { results } = usePreferencesStore();

  // Find the product matching the ID from the URL
  const product = results.find((p) => p.id === params.id);

  // If no product is found, display a 404 page
  if (!product) {
    return notFound();
  }

  return (
    <div className="space-y-6 p-4">
      {/* Optional: Add a back button for improved user experience */}
      <Link href="/explore" className="text-blue-600 hover:underline mb-4 block">
        &larr; Back to Explore
      </Link>

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

      {/* Display the product summary/description */}
      {/* Fallback to `summary` if `ecommerceReviewSummary` is not available, or a default message */}
      <p className="text-gray-600 mt-4">{ product.summary || "No detailed summary available for this product."}</p>

      {/* Placeholder for a price trend graph */}
      <div className="w-full h-64 bg-gray-100 flex items-center justify-center rounded mt-6">
        <span className="text-gray-500">[Price Trend Graph Here]</span>
      </div>

      {/* Buy Now button linking to the product's purchase page */}
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