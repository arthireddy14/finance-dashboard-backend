<<<<<<< HEAD
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
=======
const express = require('express');
require('dotenv').config();

const app = express();
app.use(express.json());

// Routes
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

const recordRoutes = require('./routes/recordRoutes');
app.use('/api/records', recordRoutes);

// DB Connection
const connectDB = require('./config/db');

// Start server ONLY after DB connects
connectDB().then(() => {
  app.listen(5000, () => {
    console.log("Server started on http://localhost:5000");
  });
});
>>>>>>> 38b555646dd126d50ae08556bdb6422047456ae9
