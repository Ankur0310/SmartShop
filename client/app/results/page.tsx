"use client";

import { usePreferencesStore } from "@/store/preferencesStore";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

// A simple loading component for better UX
const LoadingSpinner = () => (
  <div className="flex flex-col justify-center items-center p-8 space-y-4">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700"></div>
    <p className="text-lg text-gray-600">Our AI is searching the web for the best products...</p>
    <p className="text-sm text-gray-500">This might take a moment.</p>
  </div>
);

export default function ResultsPage() {
  const router = useRouter();

  // Get the full state and the fetch action from the store
  const {
    preferences,
    results,
    isLoading,
    error,
    fetchRecommendations
  } = usePreferencesStore();

  // When the component mounts, trigger the API call
  useEffect(() => {
    // Ensure we have a product to search for, otherwise redirect
    if (!preferences.product) {
      router.push('/start');
      return;
    }
    fetchRecommendations();
  }, []); // The empty dependency array ensures this runs only once on mount

  // 1. Handle the loading state
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // 2. Handle the error state
  if (error) {
    return (
      <div className="text-center p-6 bg-red-50 border border-red-200 rounded-lg">
        <h2 className="text-xl font-bold text-red-700">Oops! Something went wrong.</h2>
        <p className="mt-2 text-red-600">{error}</p>
        <button
          onClick={() => router.push('/explore')}
          className="mt-4 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  // 3. Handle the success state (display results)
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Top Recommendations for "{preferences.product}"</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {results.map((p) => (
          <div
            key={p.id}
            className="p-5 border rounded-lg shadow-md hover:shadow-xl transition-shadow flex flex-col justify-between bg-white"
          >
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase">From: {p.source}</p>
              <h2 className="text-xl font-bold mt-1">{p.name}</h2>
              <p className="text-lg font-semibold text-gray-800 my-2">{p.price}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {p.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="bg-blue-100 text-blue-800 px-3 py-1 text-xs font-medium rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <a
              href={p.buyLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 block w-full text-center bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700"
            >
              View & Buy
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}