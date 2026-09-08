const express = require("express");

const {
  createWorkerProfile,
  getAllWorkers,
  getMyWorkerProfile,
  updateWorkerProfile,
  updateAvailability
} = require("../controllers/worker.controller");

const protect = require("../middleware/auth.middleware");
const authorizeRoles = require("../middleware/role.middleware");

const router = express.Router();


// ======================================
// ADMIN - GET ALL WORKERS
// ======================================

router.get(
  "/",
  protect,
  authorizeRoles("admin"),
  getAllWorkers
);


// ======================================
// WORKER PROFILE
// ======================================

router.post(
  "/profile",
  protect,
  authorizeRoles("worker"),
  createWorkerProfile
);

router.get(
  "/profile",
  protect,
  authorizeRoles("worker"),
  getMyWorkerProfile
);

router.put(
  "/profile",
  protect,
  authorizeRoles("worker"),
  updateWorkerProfile
);


// ======================================
// WORKER AVAILABILITY
// ======================================

router.patch(
  "/availability",
  protect,
  authorizeRoles("worker"),
  updateAvailability
);


module.exports = router;