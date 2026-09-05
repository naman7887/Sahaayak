const express = require("express");

const {
  createPayment,
  getMyPayments,
  getPaymentById,
  updatePaymentStatus,
} = require("../controllers/payment.controller");

const protect = require("../middleware/auth.middleware");
const authorizeRoles = require("../middleware/role.middleware");

const router = express.Router();

// All payment APIs require authentication
router.use(protect);

// Customer payment APIs
router.post("/", createPayment);
router.get("/my", getMyPayments);
router.get("/:id", getPaymentById);

// Only admin can update payment status
router.patch(
  "/:id/status",
  authorizeRoles("admin"),
  updatePaymentStatus
);

module.exports = router;