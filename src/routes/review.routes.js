const express = require("express");

const {
  createReview,
  getReviewsForWorker,
} = require("../controllers/review.controller");

const protect = require("../middleware/auth.middleware");

const router = express.Router();

// Create review
router.post("/", protect, createReview);

// Get reviews for a worker
router.get("/worker/:workerId", getReviewsForWorker);

module.exports = router;