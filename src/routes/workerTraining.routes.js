const express = require("express");
const router = express.Router();

const protect = require("../middleware/auth.middleware");
const authorizeRoles = require("../middleware/role.middleware");

const {
  enrollInTraining,
  getMyTrainings,
  getMyTraining,
  updateMyTrainingStatus,
  cancelMyTraining,
  getWorkerTrainingsForAdmin,
} = require("../controllers/workerTraining.controller");

// ======================================
// WORKER TRAINING ROUTES
// ======================================

// Enroll in a training program
router.post(
  "/:trainingId/enroll",
  protect,
  authorizeRoles("worker"),
  enrollInTraining
);

// Get my enrolled trainings
router.get(
  "/my",
  protect,
  authorizeRoles("worker"),
  getMyTrainings
);

// Get one of my training enrollments
router.get(
  "/my/:id",
  protect,
  authorizeRoles("worker"),
  getMyTraining
);

// Update training status
router.put(
  "/my/:id/status",
  protect,
  authorizeRoles("worker"),
  updateMyTrainingStatus
);

// Cancel training enrollment
router.delete(
  "/my/:id",
  protect,
  authorizeRoles("worker"),
  cancelMyTraining
);

module.exports = router;