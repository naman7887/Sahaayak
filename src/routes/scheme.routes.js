const express = require("express");
const router = express.Router();

const protect = require("../middleware/auth.middleware");
const authorizeRoles = require("../middleware/role.middleware");

const {
  getSchemes,
  getSchemeById: getSchemeByIdService,
  createScheme,
  updateScheme,
  deleteScheme,
} = require("../controllers/scheme.controller");

const {
  getMyRecommendedSchemes,
} = require("../controllers/schemeEligibility.controller");

// ======================================
// PUBLIC SCHEME ROUTES
// ======================================

// Get all active schemes
router.get("/", getSchemes);

// ======================================
// WORKER SCHEME RECOMMENDATIONS
// ======================================

// Get schemes recommended for the logged-in worker
// IMPORTANT: This must come before /:id
router.get(
  "/recommended",
  protect,
  authorizeRoles("worker"),
  getMyRecommendedSchemes
);

// Get scheme by ID
router.get("/:id", getSchemeByIdService);

// ======================================
// ADMIN SCHEME ROUTES
// ======================================

// Create scheme
router.post(
  "/",
  protect,
  authorizeRoles("admin"),
  createScheme
);

// Update scheme
router.put(
  "/:id",
  protect,
  authorizeRoles("admin"),
  updateScheme
);

// Delete scheme
router.delete(
  "/:id",
  protect,
  authorizeRoles("admin"),
  deleteScheme
);

module.exports = router;