const express = require("express");
const router = express.Router();

const protect = require("../middleware/auth.middleware");
const authorizeRoles = require("../middleware/role.middleware");

const {
  getTrainingPrograms,
  getTrainingProgram,
  createTraining,
  updateTraining,
  deleteTraining,
} = require("../controllers/training.controller");

// ======================================
// PUBLIC / WORKER ROUTES
// ======================================

// Get all active training programs
router.get(
  "/",
  protect,
  getTrainingPrograms
);

// Get training program by ID
router.get(
  "/:id",
  protect,
  getTrainingProgram
);

// ======================================
// ADMIN ROUTES
// ======================================

// Create training program
router.post(
  "/",
  protect,
  authorizeRoles("admin"),
  createTraining
);

// Update training program
router.put(
  "/:id",
  protect,
  authorizeRoles("admin"),
  updateTraining
);

// Remove training program
router.delete(
  "/:id",
  protect,
  authorizeRoles("admin"),
  deleteTraining
);

module.exports = router;