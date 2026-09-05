const express = require("express");

const {
  getInsurancePlans,
  getInsurancePlanById,
  createInsurancePlan,
  updateInsurancePlan,
  deleteInsurancePlan,
} = require("../controllers/insurance.controller");

const protect = require("../middleware/auth.middleware");
const authorizeRoles = require("../middleware/role.middleware");

const router = express.Router();

// Public routes
router.get("/", getInsurancePlans);
router.get("/:id", getInsurancePlanById);

// Admin-only management routes
router.post(
  "/",
  protect,
  authorizeRoles("admin"),
  createInsurancePlan
);

router.put(
  "/:id",
  protect,
  authorizeRoles("admin"),
  updateInsurancePlan
);

router.delete(
  "/:id",
  protect,
  authorizeRoles("admin"),
  deleteInsurancePlan
);

module.exports = router;