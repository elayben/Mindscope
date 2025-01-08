// routes/countries.js
const express = require('express');
const router = express.Router();
const countriesController = require('../controllers/countriesController');

router.get('/', countriesController.getAllCountriesWithCodes);

module.exports = router;
