const express = require("express");

const {
  createBooking,
  getMyBookings,
  getWorkerBookings,
  getBookingById,
  acceptBooking,
  rejectBooking,
  updateBookingStatus,
  cancelBooking,
} = require("../controllers/booking.controller");

const protect = require("../middleware/auth.middleware");
const authorizeRoles = require("../middleware/role.middleware");

const router = express.Router();

// All booking APIs require authentication
router.use(protect);

// Customer APIs
router.post(
  "/",
  authorizeRoles("customer"),
  createBooking
);

router.get(
  "/my",
  authorizeRoles("customer"),
  getMyBookings
);

router.patch(
  "/:id/cancel",
  authorizeRoles("customer"),
  cancelBooking
);

// Worker APIs
router.get(
  "/worker",
  authorizeRoles("worker"),
  getWorkerBookings
);

router.patch(
  "/:id/accept",
  authorizeRoles("worker"),
  acceptBooking
);

router.patch(
  "/:id/reject",
  authorizeRoles("worker"),
  rejectBooking
);

// Common authenticated API
router.get("/:id", getBookingById);
router.patch("/:id/status", updateBookingStatus);

module.exports = router;