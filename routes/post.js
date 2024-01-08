const express = require('express');
const router = express.Router();
const { testPostController } = require('../controllers/post');
var multer = require('multer');
var upload = multer({ 
    dest: 'uploads/' 
});

router.post('/testpost', testPostController);

module.exports = router;