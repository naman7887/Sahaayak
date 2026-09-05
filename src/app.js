const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/auth.routes");
const workerRoutes = require("./routes/worker.routes");
const serviceRoutes = require("./routes/service.routes");
const bookingRoutes = require("./routes/booking.routes");
const paymentRoutes = require("./routes/payment.routes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/workers", workerRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Sahaayak backend is running"
  });
});

module.exports = app;