const express = require("express");

const {
    getCategoryAnalytics,
    getMonthlyAnalytics
} = require("../controllers/analyticsController");

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");

const router = express.Router();

router.use(authMiddleware);

router.get(
    "/category",
    authorizeRoles("analyst", "admin"),
    getCategoryAnalytics
);

router.get(
    "/monthly",
    authorizeRoles("analyst", "admin"),
    getMonthlyAnalytics
);

module.exports = router;