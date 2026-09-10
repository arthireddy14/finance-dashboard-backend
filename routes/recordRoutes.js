const express = require("express");

const {
    getRecords,
    createRecord,
    updateRecord,
    deleteRecord,
    getSummary
} = require("../controllers/recordController");

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

// All record routes require authentication
router.use(authMiddleware);

// --------------------
// Read Operations
// Viewer + Analyst + Admin
// --------------------

router.get("/", getRecords);

router.get("/summary", getSummary);

// --------------------
// Create Operation
// Analyst + Admin
// --------------------

router.post(
    "/",
    authorizeRoles("analyst", "admin"),
    createRecord
);

// --------------------
// Update Operation
// Analyst + Admin
// --------------------

router.put(
    "/:id",
    authorizeRoles("analyst", "admin"),
    updateRecord
);

// --------------------
// Delete Operation
// Admin only
// --------------------

router.delete(
    "/:id",
    authorizeRoles("admin"),
    deleteRecord
);

module.exports = router;