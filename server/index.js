// index.js

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config(); // Make sure dotenv is configured at the very top

// --- Import Routes ---
const recommendRoutes = require('./routes/recommend');
const youtubeRoutes = require("./routes/youtube");

const app = express();
const PORT = process.env.PORT || 5000;

// --- Middlewares ---
app.use(express.json()); // To parse JSON request bodies
app.use(cors());         // To allow cross-origin requests from your Next.js frontend

// --- Database Connection ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// --- API Routes ---
app.get("/api/ping", (_, res) => res.json({ message: "pong" }));

// Use the recommendation routes for any request to /api/recommend
app.use('/api/recommend', recommendRoutes);
app.use("/api/youtube", youtubeRoutes);

// --- Start Server ---
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));