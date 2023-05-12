// Initialize express router
const express = require('express');
const {
    sendOtp,
    verifyBvn
} = require('../Controller/user');

// const User = require('../Model/User');
const router = express.Router();

// user routes
router
    .route('/send-otp')
    .post(sendOtp)
router
    .route('/')
    .post(verifyBvn)
module.exports = router;