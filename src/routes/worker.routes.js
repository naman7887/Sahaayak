const express = require("express");

const {
  getWorkerProfile,
  updateWorkerProfile,
  updateWorkerAvailability,
  getAvailableWorkers,
} = require("../controllers/worker.controller");

const protect = require("../middleware/auth.middleware");
const authorizeRoles = require("../middleware/role.middleware");

const router = express.Router();

// ==========================================
// WORKER PROFILE
// ==========================================

// Get own worker profile
router.get(
  "/profile",
  protect,
  authorizeRoles("worker"),
  getWorkerProfile
);

// Update own worker profile
router.put(
  "/profile",
  protect,
  authorizeRoles("worker"),
  updateWorkerProfile
);

// ==========================================
// WORKER AVAILABILITY
// ==========================================

// Update worker availability
router.patch(
  "/availability",
  protect,
  authorizeRoles("worker"),
  updateWorkerAvailability
);

// ==========================================
// AVAILABLE WORKERS
// ==========================================

// Get all available workers
router.get(
  "/available",
  protect,
  getAvailableWorkers
);

module.exports = router;