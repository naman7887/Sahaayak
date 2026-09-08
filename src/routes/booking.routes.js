const express = require("express");

const router = express.Router();

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

const {
  previewMatch,
  createMatchedBooking,
} = require("../controllers/bookingMatch.controller");

const protect = require("../middleware/auth.middleware");

// ==========================================
// AUTHENTICATION
// ==========================================

// All booking routes require authentication
router.use(protect);


// ==========================================
// CUSTOMER - WORKER MATCHING
// ==========================================

// Preview the best available worker
// POST /api/bookings/preview-match
router.post(
  "/preview-match",
  previewMatch
);

// Create booking with the matched worker
// POST /api/bookings/matched
router.post(
  "/matched",
  createMatchedBooking
);


// ==========================================
// CUSTOMER
// ==========================================

// Create a normal booking
// POST /api/bookings
router.post(
  "/",
  createBooking
);

// Get customer's bookings
// GET /api/bookings/my
router.get(
  "/my",
  getMyBookings
);

// Cancel customer's booking
// PATCH /api/bookings/:id/cancel
router.patch(
  "/:id/cancel",
  cancelBooking
);


// ==========================================
// WORKER
// ==========================================

// Get worker's assigned bookings
// GET /api/bookings/worker
router.get(
  "/worker",
  getWorkerBookings
);

// Accept booking
// PATCH /api/bookings/:id/accept
router.patch(
  "/:id/accept",
  acceptBooking
);

// Reject booking
// PATCH /api/bookings/:id/reject
router.patch(
  "/:id/reject",
  rejectBooking
);


// ==========================================
// CUSTOMER / WORKER / ADMIN
// ==========================================

// Get booking by ID
// GET /api/bookings/:id
router.get(
  "/:id",
  getBookingById
);

// Update booking status
// PATCH /api/bookings/:id/status
router.patch(
  "/:id/status",
  updateBookingStatus
);


// ==========================================
// EXPORT
// ==========================================

module.exports = router;