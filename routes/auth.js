const express = require('express');
const router = express.Router();
const { testAuthController, signUp, signIn} = require('../controllers/auth');

router.get('/testauth', testAuthController);

router.post('/signup', signUp);

router.post('/signin', signIn);

module.exports = router;