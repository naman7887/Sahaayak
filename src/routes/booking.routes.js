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

const router = express.Router();

// All booking APIs require authentication
router.use(protect);

// Customer APIs
router.post("/", createBooking);
router.get("/my", getMyBookings);
router.patch("/:id/cancel", cancelBooking);

// Worker APIs
router.get("/worker", getWorkerBookings);
router.patch("/:id/accept", acceptBooking);
router.patch("/:id/reject", rejectBooking);

// Common APIs
router.get("/:id", getBookingById);
router.patch("/:id/status", updateBookingStatus);

module.exports = router;