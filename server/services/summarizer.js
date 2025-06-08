const { VertexAI } = require("@google-cloud/vertexai");

// Initialize Vertex with project and location
const vertexAI = new VertexAI({
  project: process.env.GCP_PROJECT_ID,
  location: "us-central1", // or "asia-south1" for Mumbai
});

// Get the generative model (Gemini 1.5 Flash)
const model = vertexAI.getGenerativeModel({
  model: "gemini-1.5-flash-preview-0514",
  generationConfig: {
    temperature: 0.5,
    maxOutputTokens: 2048,
  },
});

async function summarizeTranscripts(transcript) {
  const prompt = `
Extract all product names from the below transcript (smartphones, watches, etc). 
Return only product names, comma-separated.

Transcript:
${transcript}
`;

  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
  });

  const output = result.response.candidates?.[0]?.content?.parts?.[0]?.text || "";
  return output.split(",").map(p => p.trim()).filter(Boolean);
}

module.exports = summarizeTranscripts;
