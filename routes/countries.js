// routes/countries.js
const express = require('express');
const router = express.Router();
const { getAllCountriesWithCodes } = require('../controllers/disorderDataController');

router.get('/countries', getAllCountriesWithCodes);

module.exports = router;
