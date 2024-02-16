const express = require('express');
const router = express.Router();
const { testPostController, tagReader, garmentRegistration } = require('../controllers/post');
var multer = require('multer');
var upload = multer({ 
    dest: 'uploads/' 
});

router.post('/testpost', testPostController);

router.post('/tagreader', upload.any('files'), tagReader);

router.post('/garmentregistration',upload.any('files'), garmentRegistration);

module.exports = router;