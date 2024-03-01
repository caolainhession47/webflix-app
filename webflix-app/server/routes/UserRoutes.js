const express = require("express");
const UserController = require("../controllers/UserController");

const router = express.Router();

router.post('/createUserProfile', UserController.createUser);
router.post('/favorites/add', UserController.addToFavorites);
router.post('/watchlist/add', UserController.addToWatchlist);
router.get('/favorites/:email', UserController.getFavorites);
router.put('/favorites/remove', UserController.removeFromFavorites);
router.get('/watchlist/:email', UserController.getWatchlist);
router.put('/watchlist/remove', UserController.removeFromWatchlist);
router.put('/triviaResults/update', UserController.updateTriviaResults);
router.get('/triviaResults/:email', UserController.getTriviaResults);
router.get('/trivia/leaderboard', UserController.getLeaderboard);
router.get('/reviews/media/:mediaId', UserController.getReviewsByMediaId);
router.get('/reviews/user/:email', UserController.getUserReviews);
router.post('/reviews/add', UserController.addReview);
router.put('/reviews/remove', UserController.removeReview);
router.put('/reviews/update', UserController.updateReview);
router.get('/reviews/highly-rated/:email', UserController.getHighlyRatedMovies);

module.exports = router;
