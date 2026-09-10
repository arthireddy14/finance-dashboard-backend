<<<<<<< HEAD
const express = require("express");

const {
    register,
    login
} = require("../controllers/userController");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

module.exports = router;
=======
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
>>>>>>> 38b555646dd126d50ae08556bdb6422047456ae9
