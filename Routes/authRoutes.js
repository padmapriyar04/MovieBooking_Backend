const express = require('express');

const {register,login,refreshAccessToken} = require('../Controllers/AuthControllers');

const router = express.Router();

router.post('/register',register);
router.post('/login',login);
router.post('/refresh-token', refreshAccessToken);

module.exports = router;