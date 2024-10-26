const locationController = require('../controllers/helper');


const express = require('express');


const router = express.Router();

router.get('/location', locationController.getLocationFromDB);

module.exports = router;