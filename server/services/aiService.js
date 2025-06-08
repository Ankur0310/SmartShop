// server/services/aiService.js
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require("@google/generative-ai");
require('dotenv').config();

console.log('AI Service initializing. API Key Status:', process.env.GOOGLE_API_KEY ? 'Loaded' : 'NOT LOADED');
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

async function fetchProductRecommendations({ preferences, filters }) {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    safetySettings: [
      { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
      { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
      { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
      { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE }
    ],
    generationConfig: {
      temperature: 0.1,
      // Increase maxOutputTokens significantly. 800 was too low for 10 products with detailed info.
      // 2048 is a common maximum for many models. Let's try something higher if needed.
      maxOutputTokens: 2048 // Increased from 800
    }
  });

  const minAllowedBudget = preferences.minBudget;
  const maxAllowedBudgetWithMargin = preferences.maxBudget * 1.10;

  const prompt = `
You are an expert product recommender specializing in budget-conscious and specific user needs.
Your primary directive is to recommend products that **STRICTLY ADHERE** to the provided budget range,
allowing for a **maximum of 10% above the maxBudget** for exceptional cases.
Any product that clearly exceeds this upper limit must be excluded.

Recommend top ${filters.topN} products based on the following criteria:

- User Role: ${preferences.role}
- Budget Range: ₹${preferences.minBudget.toLocaleString('en-IN')} - ₹${preferences.maxBudget.toLocaleString('en-IN')}
  (Strictly, the price of recommended products must be between ₹${minAllowedBudget.toLocaleString('en-IN')} and ₹${maxAllowedBudgetWithMargin.toLocaleString('en-IN')})
- Key Attribute: ${preferences.taste}
- Product Category: ${preferences.product}
- Sort By: ${filters.sortBy}

**IMPORTANT:** For each product, only recommend products whose prices are VERIFIABLY within the calculated budget range.
If a product's common market price (even a range) falls outside ₹${minAllowedBudget.toLocaleString('en-IN')} to ₹${maxAllowedBudgetWithMargin.toLocaleString('en-IN')}, DO NOT include it.
**Ensure the entire JSON array is complete and valid, with all strings properly terminated.**

For each product, respond with a JSON array where each object contains:
[
  {
    "id": "kebab-case-id",
    "name": "Full Product Name",
    "price": "₹XX,XXX - ₹XX,XXX", // Must reflect market price and fit the budget
    "tags": ["tag1", "tag2"],
    "buyLink": "https://www.amazon.in/...", // or Flipkart, or fallback to Google search
    "source": "AI General Knowledge",
    "expertReviewers": [],
    "ecommerceReviewSummary": "Summary of common pros and cons from user reviews."
  }
]

**Example of a valid, budget-compliant product recommendation:**
[
  {
    "id": "lava-blaze-2",
    "name": "Lava Blaze 2",
    "price": "₹8,999 - ₹9,999",
    "tags": ["Durable", "Student-friendly", "Clean UI", "Good Battery"],
    "buyLink": "https://www.amazon.in/Lava-Blaze-Glass-Green-128GB/dp/B0BPXP83B7",
    "source": "AI General Knowledge",
    "expertReviewers": [],
    "ecommerceReviewSummary": "Users appreciate its robust build and clean Android experience for the price, making it a solid choice for students."
  }
]

Return ONLY the JSON array. Do not include markdown (except for the JSON block) or any explanation outside the JSON.
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log("Raw AI response text:", text);
    const cleanedText = text.replace(/```json/g, "").replace(/```/g, "").trim();

    let recommendations = [];
    try {
      recommendations = JSON.parse(cleanedText);

      // Post-processing to enforce budget and ensure data integrity
      recommendations = recommendations.filter(product => {
        // Ensure kebab-case ID
        if (!product.id && product.name) {
          product.id = product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
        }

        // Initialize tags if not present
        product.tags = product.tags || [];

        // Parse price (handling both single price and range)
        let productMinPrice = null;
        let productMaxPrice = null;
        const priceMatch = product.price?.match(/₹([\d,]+)(?:\s*-\s*₹([\d,]+))?/);

        if (priceMatch) {
          productMinPrice = parseInt(priceMatch[1].replace(/,/g, ''));
          if (priceMatch[2]) {
            productMaxPrice = parseInt(priceMatch[2].replace(/,/g, ''));
          } else {
            productMaxPrice = productMinPrice; // If only one price, max is also that price
          }
        }
        
        // --- Rigorous Budget Compliance Check ---
        let isWithinBudget = false;
        if (productMinPrice !== null && productMaxPrice !== null) {
            if (productMaxPrice <= maxAllowedBudgetWithMargin && productMinPrice >= minAllowedBudget) {
                isWithinBudget = true;
            } else {
                product.tags.push("out-of-budget");
            }
        } else {
            product.tags.push("price-parse-error");
        }

        // Fallback buy link if not provided or invalid
        if (!product.buyLink || !product.buyLink.startsWith('http')) {
          const encoded = encodeURIComponent(product.name || preferences.product);
          product.buyLink = `https://www.google.com/search?q=${encoded}+buy`;
        }

        if (!product.source) product.source = "AI General Knowledge";
        if (!product.expertReviewers) product.expertReviewers = [];
        if (!product.ecommerceReviewSummary) {
          product.ecommerceReviewSummary = `General sentiment for ${product.name} appears positive.`;
        }
        
        return isWithinBudget;
      }).slice(0, filters.topN); // Ensure we only return up to topN after filtering

    } catch (err) {
      console.error("JSON parsing or post-processing error:", err.message);
      // Fallback for critical parsing errors
      recommendations = [{
        id: "ai-error",
        name: "AI Recommendation Error",
        price: "N/A",
        tags: ["error", "parse-failure"],
        buyLink: `https://www.google.com/search?q=${encodeURIComponent(preferences.product)}+buy`,
        source: "AI Error",
        expertReviewers: [],
        ecommerceReviewSummary: "AI couldn't generate complete or structured product recommendations. Try again or adjust parameters."
      }];
    }

    return recommendations;

  } catch (error) {
    console.error("AI call failed:", error);
    throw new Error(`AI recommendation failed: ${error.message}`);
  }
}

module.exports = { fetchProductRecommendations };