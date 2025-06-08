"use client";
import { useRouter } from "next/navigation";
import { usePreferencesStore } from "@/store/preferencesStore";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function ExplorePage() {
  const router = useRouter();
  const {
    preferences,
    filters,
    results,
    isLoading,
    error,
    setFilters,
    fetchRecommendations,
  } = usePreferencesStore();

  const [visibleCount, setVisibleCount] = useState(filters.topN);

  const handleSearch = () => {
    fetchRecommendations();
  };

  useEffect(() => {
    if (results.length > 0) {
      setVisibleCount(filters.topN);
    }
  }, [results]);

  return (
    <div className="space-y-6 p-4">
      <h1 className="text-2xl font-bold">Explore Products</h1>

      <div className="bg-white rounded shadow p-4 space-y-2 border">
        <p><strong>Role:</strong> {preferences.role}</p>
        <p>
          <strong>Budget:</strong> ₹{preferences.budget.min} - ₹{preferences.budget.max}
        </p>
        <p><strong>Taste:</strong> {preferences.taste}</p>
        <p><strong>Product:</strong> {preferences.product}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <label>
          Sort By:
          <select
            className="w-full mt-1 p-2 border rounded"
            value={filters.sortBy}
            onChange={(e) =>
              setFilters({ ...filters, sortBy: e.target.value })
            }
          >
            <option value="rating">Rating</option>
            <option value="price">Price</option>
          </select>
        </label>

        <label>
          Number of Products:
          <select
            className="w-full mt-1 p-2 border rounded"
            value={filters.topN}
            onChange={(e) =>
              setFilters({ ...filters, topN: Number(e.target.value) })
            }
          >
            <option value={3}>Top 3</option>
            <option value={5}>Top 5</option>
            <option value={10}>Top 10</option>
          </select>
        </label>
      </div>

      <button
        onClick={handleSearch}
        className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
      >
        Let AI do some magic
      </button>

      {isLoading && (
        <div className="text-center p-4 text-gray-600">Searching the web...</div>
      )}

      {error && (
        <div className="text-red-500 text-sm mt-2">{error}</div>
      )}

      {!isLoading && results.length > 0 && (
        <>
          <h2 className="text-xl font-bold mt-6">Top Recommendations</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {results.slice(0, visibleCount).map((p) => (
              <div
                key={p.id}
                className="p-5 border rounded-lg shadow-md hover:shadow-xl transition-shadow bg-white"
              >
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">
                    From: {p.source}
                  </p>
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
                <Link href={`/product/${p.id}`}>
  <div className="mt-4 block w-full text-center bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700">
    View & Buy
  </div>
</Link>
              </div>
            ))}
          </div>
          {visibleCount < results.length && (
            <button
              className="mt-6 block mx-auto bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900"
              onClick={() => setVisibleCount((prev) => prev + filters.topN)}
            >
              More
            </button>
          )}
        </>
      )}
    </div>
  );
}
