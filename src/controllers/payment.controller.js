const Payment = require("../models/Payment");
const Booking = require("../models/Booking");

// Create a payment record
const createPayment = async (req, res) => {
  try {
    const { booking, paymentMethod } = req.body;

    if (!booking || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message: "Booking and payment method are required",
      });
    }

    const allowedMethods = ["cash", "upi", "card", "online"];

    if (!allowedMethods.includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment method",
      });
    }

    const bookingData = await Booking.findById(booking);

    if (!bookingData) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Only the customer who owns the booking can create its payment
    if (bookingData.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to create payment for this booking",
      });
    }

    // Payment should not be created for cancelled bookings
    if (bookingData.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Payment cannot be created for a cancelled booking",
      });
    }

    // Prevent duplicate payment records
    const existingPayment = await Payment.findOne({ booking });

    if (existingPayment) {
      return res.status(400).json({
        success: false,
        message: "Payment already exists for this booking",
        payment: existingPayment,
      });
    }

    const payment = await Payment.create({
      booking,
      customer: req.user._id,
      amount: bookingData.price,
      paymentMethod,
      paymentStatus: "pending",
    });

    const populatedPayment = await Payment.findById(payment._id)
      .populate("customer", "name email phone")
      .populate("booking");

    res.status(201).json({
      success: true,
      message: "Payment record created successfully",
      payment: populatedPayment,
    });
  } catch (error) {
    console.error("Create payment error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create payment",
      error: error.message,
    });
  }
};

// Get customer's payments
const getMyPayments = async (req, res) => {
  try {
    const payments = await Payment.find({
      customer: req.user._id,
    })
      .populate("booking")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: payments.length,
      payments,
    });
  } catch (error) {
    console.error("Get my payments error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch payments",
      error: error.message,
    });
  }
};

// Get payment by ID
const getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate("customer", "name email phone")
      .populate("booking");

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    if (payment.customer._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view this payment",
      });
    }

    res.status(200).json({
      success: true,
      payment,
    });
  } catch (error) {
    console.error("Get payment error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch payment",
      error: error.message,
    });
  }
};

// Update payment status
const updatePaymentStatus = async (req, res) => {
  try {
    const { paymentStatus, transactionId } = req.body;

    const allowedStatuses = ["pending", "paid", "failed", "refunded"];

    if (!allowedStatuses.includes(paymentStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment status",
      });
    }

    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    if (payment.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this payment",
      });
    }

    payment.paymentStatus = paymentStatus;

    if (transactionId) {
      payment.transactionId = transactionId;
    }

    if (paymentStatus === "paid") {
      payment.paidAt = new Date();
    }

    await payment.save();

    const updatedPayment = await Payment.findById(payment._id)
      .populate("customer", "name email phone")
      .populate("booking");

    res.status(200).json({
      success: true,
      message: "Payment status updated successfully",
      payment: updatedPayment,
    });
  } catch (error) {
    console.error("Update payment status error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update payment status",
      error: error.message,
    });
  }
};

module.exports = {
  createPayment,
  getMyPayments,
  getPaymentById,
  updatePaymentStatus,
};