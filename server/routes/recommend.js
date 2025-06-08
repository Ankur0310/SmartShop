// routes/recommend.js

const express = require('express');
const router = express.Router();
const recommendController = require('../controllers/recommendController');

// Define the POST route for getting recommendations
// POST /api/recommend
router.post('/', recommendController.getRecommendations);

module.exports = router;