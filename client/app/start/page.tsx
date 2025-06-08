"use client";
import { useRouter } from "next/navigation";
import { usePreferencesStore } from "@/store/preferencesStore";
import { useState } from "react";

export default function StartPage() {
  const router = useRouter();
  const setPreferences = usePreferencesStore((s) => s.setPreferences);

  const [form, setForm] = useState({
    role: "student",
    budget: { min: 1000, max: 50000 },
    taste: "techy",
    product: "",
  });

  const handleSubmit = () => {
    if (!form.product.trim()) {
      alert("Please enter the product you want to buy.");
      return;
    }

    setPreferences(form);
    router.push("/explore");
  };

  return (
    <div className="space-y-6 p-4">
      <h1 className="text-2xl font-semibold">Tell us about yourself</h1>
      <div className="grid gap-4">
        <label>
          Role:
          <select
            className="w-full mt-1 p-2 border rounded"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            <option value="student">Student</option>
            <option value="professional">Professional</option>
            <option value="mature">Mature</option>
          </select>
        </label>

        <label>
          Budget Range (₹):
          <div className="flex gap-2 items-center mt-1">
            <input
              type="number"
              className="w-1/2 p-2 border rounded"
              placeholder="Min"
              value={form.budget.min}
              onChange={(e) =>
                setForm({ ...form, budget: { ...form.budget, min: +e.target.value } })
              }
            />
            <input
              type="number"
              className="w-1/2 p-2 border rounded"
              placeholder="Max"
              value={form.budget.max}
              onChange={(e) =>
                setForm({ ...form, budget: { ...form.budget, max: +e.target.value } })
              }
            />
          </div>
        </label>

        <label>
          Taste:
          <select
            className="w-full mt-1 p-2 border rounded"
            value={form.taste}
            onChange={(e) => setForm({ ...form, taste: e.target.value })}
          >
            <option value="trendy">Trendy</option>
            <option value="techy">Techy</option>
            <option value="durable">Durable</option>
          </select>
        </label>

        <label>
          Product you're looking for:
          <input
            type="text"
            className="w-full mt-1 p-2 border rounded"
            placeholder="e.g., laptop, kurta, air fryer..."
            value={form.product}
            onChange={(e) => setForm({ ...form, product: e.target.value })}
          />
        </label>
      </div>

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        onClick={handleSubmit}
      >
        Continue
      </button>
    </div>
  );
}
