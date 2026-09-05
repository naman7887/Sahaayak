const express = require("express");

const {
  register,
  login,
  getMe,
} = require("../controllers/auth.controller");

const protect = require("../middleware/auth.middleware");

const router = express.Router();

// Public authentication APIs
router.post("/register", register);
router.post("/login", login);

// Authenticated user API
router.get("/me", protect, getMe);

module.exports = router;