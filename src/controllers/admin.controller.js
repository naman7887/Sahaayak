const User = require("../models/User");
const Worker = require("../models/Worker");
const Service = require("../models/Service");
const Booking = require("../models/Booking");
const Payment = require("../models/Payment");
const Welfare = require("../models/Welfare");
const Scheme = require("../models/Scheme");

// Get admin dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalWorkers,
      totalServices,
      totalBookings,
      totalPayments,
      totalWelfareSchemes,
      totalSchemes,
      pendingWorkers,
      pendingBookings,
    ] = await Promise.all([
      User.countDocuments(),
      Worker.countDocuments(),
      Service.countDocuments(),
      Booking.countDocuments(),
      Payment.countDocuments(),
      Welfare.countDocuments(),
      Scheme.countDocuments(),
      Worker.countDocuments({
        verificationStatus: "pending",
      }),
      Booking.countDocuments({
        status: "pending",
      }),
    ]);

    res.status(200).json({
      success: true,
      statistics: {
        totalUsers,
        totalWorkers,
        totalServices,
        totalBookings,
        totalPayments,
        totalWelfareSchemes,
        totalSchemes,
        pendingWorkers,
        pendingBookings,
      },
    });
  } catch (error) {
    console.error("Get dashboard statistics error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard statistics",
      error: error.message,
    });
  }
};

module.exports = {
  getDashboardStats,
};