const express = require("express");
const router = express.Router();

const protect = require("../middleware/auth.middleware");
const authorizeRoles = require("../middleware/role.middleware");

const {
  getMyCurrentSalary,
  getMySalaryHistory,
  getAllSalaries,
  recalculateWorkerSalary,
  markWorkerSalaryAsPaid,
} = require("../controllers/workerSalary.controller");

// ======================================
// WORKER SALARY ROUTES
// ======================================

// Current month's salary
router.get(
  "/my",
  protect,
  authorizeRoles("worker"),
  getMyCurrentSalary
);

// Salary history
router.get(
  "/my/history",
  protect,
  authorizeRoles("worker"),
  getMySalaryHistory
);

// ======================================
// ADMIN SALARY ROUTES
// ======================================

// Get all worker salaries
router.get(
  "/",
  protect,
  authorizeRoles("admin"),
  getAllSalaries
);

// Recalculate salary
router.put(
  "/:id/recalculate",
  protect,
  authorizeRoles("admin"),
  recalculateWorkerSalary
);

// Mark salary as paid
router.put(
  "/:id/pay",
  protect,
  authorizeRoles("admin"),
  markWorkerSalaryAsPaid
);

module.exports = router;