const express = require("express");
const UserController = require("../controllers/UserController");

const router = express.Router();

router.post('/favorites/add', UserController.addToFavorites);
router.post('/watchlist/add', UserController.addToWatchlist);
router.get('/favorites/:email', UserController.getFavorites);
router.put('/favorites/remove', UserController.removeFromFavorites);
router.get('/watchlist/:email', UserController.getWatchlist);
router.put('/watchlist/remove', UserController.removeFromWatchlist);

module.exports = router;
