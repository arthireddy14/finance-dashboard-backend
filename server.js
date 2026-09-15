const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const userRoutes = require("./routes/userRoutes");
const recordRoutes = require("./routes/recordRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");

const app = express();


// Middleware
app.use(cors());
app.use(express.json());


// Health check
app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "Finance Dashboard Backend is running"
    });
});


// Routes
app.use("/api/users", userRoutes);
app.use("/api/records", recordRoutes);
app.use("/api/analytics", analyticsRoutes);


// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});


// Start server after DB connection
const PORT = process.env.PORT || 5000;

connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("Database connection failed:", err);
        process.exit(1);
    });