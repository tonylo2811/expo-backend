const express = require('express');
const router = express.Router();
const { testGetController, getImage, getImageID, getGarment } = require('../controllers/get');

router.get('/testget', testGetController);

router.get('/testgetimage/:userid', getImage);

router.get('/getimageid/:userid', getImageID);

router.get('/getgarment/:id', getGarment);

module.exports = router;