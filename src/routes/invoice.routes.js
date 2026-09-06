const express = require("express");
const router = express.Router();

const {
  createInvoice,
  getMyInvoices,
  getInvoiceById,
  getAllInvoices,
  updateInvoicePaymentStatus,
} = require("../controllers/invoice.controller");

const protect = require("../middleware/auth.middleware");
const authorizeRoles = require("../middleware/role.middleware");

// All invoice routes require authentication
router.use(protect);

// Customer
router.post("/", createInvoice);
router.get("/my", getMyInvoices);

// Admin
router.get(
  "/",
  authorizeRoles("admin"),
  getAllInvoices
);

router.patch(
  "/:id/payment-status",
  authorizeRoles("admin"),
  updateInvoicePaymentStatus
);

// Customer / Worker / Admin
router.get("/:id", getInvoiceById);

module.exports = router;