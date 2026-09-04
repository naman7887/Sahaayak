const express = require("express");

const {
  createWorkerProfile,
  getMyWorkerProfile,
  updateWorkerProfile,
  updateAvailability
} = require("../controllers/worker.controller");

const protect = require("../middleware/auth.middleware");
const authorizeRoles = require("../middleware/role.middleware");

const router = express.Router();


// Worker profile
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


// Availability
router.patch(
  "/availability",
  protect,
  authorizeRoles("worker"),
  updateAvailability
);


module.exports = router;