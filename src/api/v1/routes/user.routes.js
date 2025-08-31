const express = require('express');
const { getMyProfile, updateMyProfile } = require('../controllers/user.controller');
const { protect } = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(protect); // Protect all routes below

router.route('/me').get(getMyProfile).put(updateMyProfile);

module.exports = router;