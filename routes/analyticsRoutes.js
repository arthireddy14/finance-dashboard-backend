const express = require("express");

const {
    getMonthlyAnalytics,
    getCategoryAnalytics
} = require("../controllers/analyticsController");

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

// Analytics are available to authenticated Analysts and Admins.
router.use(authMiddleware);
router.use(authorizeRoles("analyst", "admin"));

router.get("/monthly", getMonthlyAnalytics);
router.get("/category", getCategoryAnalytics);

module.exports = router;
