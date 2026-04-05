const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/authorizeRoles');

// normal routes
router.post('/register', userController.register);
router.post('/login', userController.login);

// protected route
router.get('/protected', authMiddleware, (req, res) => {
  res.json({ message: "Protected route accessed" });
});

// admin only
router.get('/admin', 
  authMiddleware, 
  authorizeRoles('admin'), 
  (req, res) => {
    res.json({ message: "Admin only access" });
});

module.exports = router;
