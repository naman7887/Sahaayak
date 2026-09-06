const Invoice = require("../models/Invoice");
const Booking = require("../models/Booking");
const Payment = require("../models/Payment");

// Generate a unique invoice number
const generateInvoiceNumber = async () => {
  const year = new Date().getFullYear();

  const lastInvoice = await Invoice.findOne({
    invoiceNumber: new RegExp(`^SAH-${year}-`),
  }).sort({ createdAt: -1 });

  let nextNumber = 1;

  if (lastInvoice) {
    const parts = lastInvoice.invoiceNumber.split("-");
    const lastNumber = parseInt(parts[2], 10);

    if (!Number.isNaN(lastNumber)) {
      nextNumber = lastNumber + 1;
    }
  }

  return `SAH-${year}-${String(nextNumber).padStart(5, "0")}`;
};

// CREATE INVOICE
// Customer can generate an invoice for their completed booking.
// Admin can also generate invoices.
const createInvoice = async (req, res) => {
  try {
    const { booking: bookingId } = req.body;

    if (!bookingId) {
      return res.status(400).json({
        success: false,
        message: "Booking ID is required",
      });
    }

    const booking = await Booking.findById(bookingId)
      .populate("service", "name category price")
      .populate("customer", "name email phone")
      .populate("worker", "name email phone");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    const isCustomer =
      booking.customer &&
      booking.customer._id.toString() === req.user._id.toString();

    const isAdmin = req.user.role === "admin";

    if (!isCustomer && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to create an invoice for this booking",
      });
    }

    if (booking.status !== "completed") {
      return res.status(400).json({
        success: false,
        message: "Invoice can only be generated for completed bookings",
      });
    }

    // Prevent duplicate invoice
    const existingInvoice = await Invoice.findOne({
      booking: booking._id,
    });

    if (existingInvoice) {
      return res.status(200).json({
        success: true,
        message: "Invoice already exists for this booking",
        data: existingInvoice,
      });
    }

    // Check payment status if a payment exists
    const payment = await Payment.findOne({
      booking: booking._id,
    });

    const invoice = await Invoice.create({
      invoiceNumber: await generateInvoiceNumber(),
      booking: booking._id,
      customer: booking.customer._id,
      worker: booking.worker ? booking.worker._id : null,
      service: booking.service._id,
      amount: booking.price || 0,
      paymentStatus: payment ? payment.paymentStatus : "pending",
      invoiceDate: new Date(),
      paidAt:
        payment && payment.paymentStatus === "paid"
          ? payment.paidAt
          : null,
    });

    const populatedInvoice = await Invoice.findById(invoice._id)
      .populate("customer", "name email phone")
      .populate("worker", "name email phone")
      .populate("service", "name category price")
      .populate("booking");

    return res.status(201).json({
      success: true,
      message: "Invoice generated successfully",
      data: populatedInvoice,
    });
  } catch (error) {
    console.error("Create invoice error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create invoice",
      error: error.message,
    });
  }
};

// GET MY INVOICES
const getMyInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find({
      customer: req.user._id,
    })
      .populate("worker", "name email phone")
      .populate("service", "name category price")
      .populate("booking")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: invoices.length,
      data: invoices,
    });
  } catch (error) {
    console.error("Get my invoices error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch invoices",
      error: error.message,
    });
  }
};

// GET INVOICE BY ID
const getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate("customer", "name email phone")
      .populate("worker", "name email phone")
      .populate("service", "name category price")
      .populate("booking");

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
    }

    const isCustomer =
      invoice.customer &&
      invoice.customer._id.toString() === req.user._id.toString();

    const isWorker =
      invoice.worker &&
      invoice.worker._id.toString() === req.user._id.toString();

    const isAdmin = req.user.role === "admin";

    if (!isCustomer && !isWorker && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view this invoice",
      });
    }

    return res.status(200).json({
      success: true,
      data: invoice,
    });
  } catch (error) {
    console.error("Get invoice error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch invoice",
      error: error.message,
    });
  }
};

// GET ALL INVOICES
// Admin only
const getAllInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find()
      .populate("customer", "name email phone")
      .populate("worker", "name email phone")
      .populate("service", "name category price")
      .populate("booking")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: invoices.length,
      data: invoices,
    });
  } catch (error) {
    console.error("Get all invoices error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch invoices",
      error: error.message,
    });
  }
};

// UPDATE INVOICE PAYMENT STATUS
// Admin only
const updateInvoicePaymentStatus = async (req, res) => {
  try {
    const { paymentStatus } = req.body;

    const allowedStatuses = [
      "pending",
      "paid",
      "failed",
      "refunded",
    ];

    if (!allowedStatuses.includes(paymentStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment status",
      });
    }

    const invoice = await Invoice.findById(req.params.id);

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
    }

    invoice.paymentStatus = paymentStatus;

    if (paymentStatus === "paid") {
      invoice.paidAt = new Date();
    } else {
      invoice.paidAt = null;
    }

    await invoice.save();

    const updatedInvoice = await Invoice.findById(invoice._id)
      .populate("customer", "name email phone")
      .populate("worker", "name email phone")
      .populate("service", "name category price")
      .populate("booking");

    return res.status(200).json({
      success: true,
      message: "Invoice payment status updated successfully",
      data: updatedInvoice,
    });
  } catch (error) {
    console.error("Update invoice payment status error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update invoice payment status",
      error: error.message,
    });
  }
};

module.exports = {
  createInvoice,
  getMyInvoices,
  getInvoiceById,
  getAllInvoices,
  updateInvoicePaymentStatus,
};