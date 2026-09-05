const express = require("express");

const {
  getMyProfile,
  updateMyProfile,
} = require("../controllers/user.controller");

const protect = require("../middleware/auth.middleware");

const router = express.Router();

// All user profile routes require authentication
router.use(protect);

// Get current user's profile
router.get("/profile", getMyProfile);

// Update current user's profile
router.patch("/profile", updateMyProfile);

module.exports = router;