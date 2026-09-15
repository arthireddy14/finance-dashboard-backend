const express = require("express");

const {
    register,
    login
} = require("../controllers/userController");

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected route - any authenticated user
router.get("/protected", authMiddleware, (req, res) => {
    res.json({
        success: true,
        message: "Protected route accessed",
        user: req.user
    });
});

// Admin-only route
router.get(
    "/admin",
    authMiddleware,
    authorizeRoles("admin"),
    (req, res) => {
        res.json({
            success: true,
            message: "Admin-only access"
        });
    }
);

module.exports = router;