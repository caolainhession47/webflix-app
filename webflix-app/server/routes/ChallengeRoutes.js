const express = require('express');
const { getRandomQuestions } = require('../controllers/ChallengeController');
const router = express.Router();

router.get('/randomQuestions/:type', getRandomQuestions);

module.exports = router;
