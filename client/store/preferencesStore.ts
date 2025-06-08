// client/store/preferencesStore.ts
import { create } from "zustand";
import slugify from "slugify";

// --- Define the structure for the API response ---
interface Product {
  id: string;
  name: string;
  price: string;
  tags: string[];
  buyLink: string;
  source: string;
  summary: string; // Add if your API returns it
}

// --- Preferences and Filters ---
interface Preferences {
  role: string;
  budget: { min: number; max: number };
  taste: string;
  product: string;
}

interface Filters {
  sortBy: string;
  topN: number;
}

interface PreferencesStore {
  preferences: Preferences;
  filters: Filters;
  results: Product[];
  isLoading: boolean;
  error: string | null;

  setPreferences: (prefs: Preferences) => void;
  setFilters: (filters: Filters) => void;
  fetchRecommendations: () => Promise<void>;
}

export const usePreferencesStore = create<PreferencesStore>((set, get) => ({
  preferences: {
    role: "student",
    budget: { min: 1000, max: 50000 },
    taste: "techy",
    product: "",
  },
  filters: {
    sortBy: "rating",
    topN: 5,
  },
  results: [],
  isLoading: false,
  error: null,

  setPreferences: (prefs) => set({ preferences: prefs }),
  setFilters: (filters) => set({ filters }),

  fetchRecommendations: async () => {
    const { preferences, filters } = get();
    set({ isLoading: true, error: null, results: [] });

    try {
      const response = await fetch("http://localhost:5000/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ preferences, filters }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch recommendations");
      }

      const products: Omit<Product, "id">[] = await response.json();

      // Generate slug-based IDs
      const enriched = products.map((p) => ({
        ...p,
        id: slugify(p.name, { lower: true, strict: true }),
      }));

      set({ results: enriched, isLoading: false });

    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },
}));
