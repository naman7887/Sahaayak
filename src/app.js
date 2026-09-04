const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/auth.routes");

const app = express();


// ==============================
// MIDDLEWARE
// ==============================

app.use(cors());

app.use(express.json());

app.use(cookieParser());


// ==============================
// ROUTES
// ==============================

app.use("/api/auth", authRoutes);


// ==============================
// HEALTH CHECK
// ==============================

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Sahaayak backend is running"
  });
});


module.exports = app;