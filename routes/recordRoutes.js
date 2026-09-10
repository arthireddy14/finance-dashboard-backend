<<<<<<< HEAD
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
=======
const express = require('express');
const router = express.Router();

const recordController = require('../controllers/recordController');
const authMiddleware = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/authorizeRoles');

// create record
router.post('/', authMiddleware, authorizeRoles('admin'),recordController.createRecord);
router.get('/', authMiddleware, recordController.getRecords);
router.put('/:id', authMiddleware, authorizeRoles('admin'),recordController.updateRecord);
router.delete('/:id', authMiddleware, authorizeRoles('admin'),recordController.deleteRecord);
router.get('/summary', authMiddleware, recordController.getSummary);
>>>>>>> 38b555646dd126d50ae08556bdb6422047456ae9

module.exports = router;