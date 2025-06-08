const express = require("express");
const router = express.Router();
const { fetchSummaries } = require("../services/youtubeService");

router.post("/summary", async (req, res) => {
  const { query } = req.body;
  try {
    const data = await fetchSummaries(query);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

module.exports = router;
