const express = require('express');
const router = express.Router();
const { testGetController } = require('../controllers/get');

router.get('/testget', testGetController);

module.exports = router;