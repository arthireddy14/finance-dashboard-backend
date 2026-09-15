const express = require("express");

const {
    getRecords,
    createRecord,
    updateRecord,
    deleteRecord,
    getSummary
} = require("../controllers/recordController");

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");

const router = express.Router();

// All record routes require authentication
router.use(authMiddleware);

// Viewer + Analyst + Admin
router.get("/", getRecords);
router.get("/summary", getSummary);

// Admin only
router.post(
    "/",
    authorizeRoles("admin"),
    createRecord
);

router.put(
    "/:id",
    authorizeRoles("admin"),
    updateRecord
);

router.delete(
    "/:id",
    authorizeRoles("admin"),
    deleteRecord
);

module.exports = router;