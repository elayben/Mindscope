// routes/disorderData.js
const express = require('express');
const router = express.Router();
const disorderController = require('../controllers/disorderDataController');

router.get('/top-disorders/:countryCode', disorderController.getTopDisorders);
router.get('/daly-growth/:countryCode/:disorderId', disorderController.getDalyGrowth);
router.get('/depression-comparison/:countryCode', disorderController.getDepressionGenderComparison);
router.get('/daly-year/:year/:disorderId', disorderController.getDalyByYear);
router.get('/top-countries/:disorderId', disorderController.getTopCountriesByDisorder);
router.get('/continent-prevalence', disorderController.getDisorderPrevalenceByContinent);
router.get('/trend-line/:countryCode', disorderController.getTrendLine);
router.get('/gender-gap', disorderController.getTop5GenderGapInDepression);
router.get('/min-daly-difference/:year', disorderController.getMinDalyDifferenceAnxiety);
router.get('/top-daly-improvement', disorderController.getTopCountriesDalyImprovement);
router.get('/correlation/:disorder1/:disorder2', disorderController.getDisorderCorrelation);

module.exports = router;
