const express = require("express");

const {
  getSchemes,
  getSchemeById,
  createScheme,
  updateScheme,
  deleteScheme,
} = require("../controllers/scheme.controller");

const protect = require("../middleware/auth.middleware");
const authorizeRoles = require("../middleware/role.middleware");

const router = express.Router();

// Public routes
router.get("/", getSchemes);
router.get("/:id", getSchemeById);

// Admin-only management routes
router.post("/", protect, authorizeRoles("admin"), createScheme);
router.put("/:id", protect, authorizeRoles("admin"), updateScheme);
router.delete("/:id", protect, authorizeRoles("admin"), deleteScheme);

module.exports = router;