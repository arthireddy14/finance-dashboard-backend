const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const userRoutes = require("./routes/userRoutes");
const recordRoutes = require("./routes/recordRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");

const app = express();

// --------------------
// Middleware
// --------------------

app.use(
    cors({
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        credentials: true
    })
);

app.use(express.json());

// --------------------
// Health Check
// --------------------

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Finance Dashboard API is running"
    });
});

app.get("/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Server is healthy"
    });
});

// --------------------
// Routes
// --------------------

app.use("/api/users", userRoutes);
app.use("/api/records", recordRoutes);
app.use("/api/analytics", analyticsRoutes);

// --------------------
// 404 Handler
// --------------------

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});

// --------------------
// Start Server
// --------------------

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, "0.0.0.0", () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error.message);
        process.exit(1);
    }
};

startServer();