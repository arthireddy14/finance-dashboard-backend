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

module.exports = router;