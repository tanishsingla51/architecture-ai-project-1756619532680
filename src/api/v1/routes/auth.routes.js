const express = require('express');
const { registerUser, loginUser } = require('../controllers/auth.controller');
const { registerValidator, loginValidator } = require('../validators/auth.validator');

const router = express.Router();

router.post('/register', registerValidator, registerUser);
router.post('/login', loginValidator, loginUser);

module.exports = router;