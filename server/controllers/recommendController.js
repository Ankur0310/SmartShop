// server/controllers/recommendController.js
const { fetchProductRecommendations } = require('../services/aiService'); // Adjust path as needed

const getRecommendations = async (req, res) => {
  try {
    // Correctly extract the top-level 'preferences' and 'filters' objects
    // as sent by your frontend's JSON.stringify({ preferences, filters })
    const { preferences, filters } = req.body;

    // --- Input Validation for essential nested properties ---
    if (!preferences || !filters || !preferences.budget || typeof preferences.budget.min === 'undefined' || typeof preferences.budget.max === 'undefined' || !filters.topN) {
      console.error("Validation Error: Missing or invalid core preference/filter data in request body.");
      return res.status(400).json({ error: "Missing or invalid core preference/filter data (e.g., preferences, filters, or budget details)." });
    }

    // Now, create the 'preferences' and 'filters' objects in the format
    // that `aiService.js` is expecting (where minBudget and maxBudget are flat).
    const transformedPreferences = {
      role: preferences.role,
      minBudget: parseFloat(preferences.budget.min), // Extract from nested budget and convert to number
      maxBudget: parseFloat(preferences.budget.max), // Extract from nested budget and convert to number
      taste: preferences.taste,
      product: preferences.product
    };

    const transformedFilters = {
      sortBy: filters.sortBy,
      topN: parseInt(filters.topN, 10)
    };

    // --- Additional Validation after transformation ---
    if (isNaN(transformedPreferences.minBudget) || isNaN(transformedPreferences.maxBudget) || isNaN(transformedFilters.topN) || !transformedPreferences.role || !transformedPreferences.product) {
        console.error("Validation Error: Transformed parameters are missing or invalid numeric values.");
        return res.status(400).json({ error: "Transformed preferences or filters contain missing/invalid data." });
    }

    // Debugging: Log the transformed objects before passing to aiService
    console.log("Transformed Preferences:", transformedPreferences);
    console.log("Transformed Filters:", transformedFilters);

    const recommendations = await fetchProductRecommendations({ preferences: transformedPreferences, filters: transformedFilters });
    res.json(recommendations);
  } catch (error) {
    console.error("Error in getRecommendations controller:", error);
    res.status(500).json({ error: "Failed to fetch recommendations. Please check server logs." });
  }
};

module.exports = { getRecommendations };