const express = require("express");

const {
  getSchemes,
  getSchemeById,
  createScheme,
  updateScheme,
  deleteScheme,
} = require("../controllers/scheme.controller");

const protect = require("../middleware/auth.middleware");

const router = express.Router();

// Public routes
router.get("/", getSchemes);
router.get("/:id", getSchemeById);

// Authenticated routes
router.post("/", protect, createScheme);
router.put("/:id", protect, updateScheme);
router.delete("/:id", protect, deleteScheme);

module.exports = router;