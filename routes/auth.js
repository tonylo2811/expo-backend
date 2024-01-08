const express = require('express');
const router = express.Router();
const { testAuthController } = require('../controllers/auth');

router.get('/testauth', testAuthController);

module.exports = router;