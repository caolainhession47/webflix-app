const User = require('../models/UserModel');

module.exports.addToFavorites = async (req, res) => {
  const { email, movie } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ email, favorites: [movie] });
    } else {
      const isFavorite = user.favorites.some(fav => fav.mediaId === movie.mediaId);
      if (!isFavorite) {
        user.favorites.push(movie);
      } else {
        return res.status(400).json({ msg: "Media already in favorites." });
      }
    }
    await user.save();
    return res.json({ msg: "Media added to favorites.", favorites: user.favorites });
  } catch (error) {
    return res.status(500).json({ msg: "Error adding media to favorites.", error });
  }
};

module.exports.addToWatchlist = async (req, res) => {
  const { email, movie } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ email, watchlist: [movie] });
    } else {
      const isWatchlist = user.watchlist.some(item => item.mediaId === movie.mediaId);
      if (!isWatchlist) {
        user.watchlist.push(movie);
      } else {
        return res.status(400).json({ msg: "Media already in watchlist." });
      }
    }
    await user.save();
    return res.json({ msg: "Media added to watchlist.", watchlist: user.watchlist });
  } catch (error) {
    return res.status(500).json({ msg: "Error adding media to watchlist.", error });
  }
};

// Fetch user's favoritess
module.exports.getFavorites = async (req, res) => {
  const { email } = req.params;
  try {
    const user = await User.findOne({ email });
    if (user) {
      res.json(user.favorites);
    } else {
      res.status(404).json({ msg: "User not found." });
    }
  } catch (error) {
    res.status(500).json({ msg: "Error fetching favorites.", error });
  }
};

// Remove a movie from favorites
module.exports.removeFromFavorites = async (req, res) => {
  const { email, mediaId } = req.body;
  try {
    const user = await User.findOneAndUpdate(
      { email },
      { $pull: { favorites: { mediaId } } },
      { new: true }
    );
    if (user) {
      res.json({ msg: "Media removed from favorites.", favorites: user.favorites });
    } else {
      res.status(404).json({ msg: "User not found." });
    }
  } catch (error) {
    res.status(500).json({ msg: "Error removing media from favorites.", error });
  }
};

// Fetch user's watchlist
module.exports.getWatchlist = async (req, res) => {
  const { email } = req.params;
  try {
    const user = await User.findOne({ email });
    if (user) {
      res.json(user.watchlist);
    } else {
      res.status(404).json({ msg: "User not found." });
    }
  } catch (error) {
    res.status(500).json({ msg: "Error fetching watchlist.", error });
  }
};

// Remove a movie from watchlist
module.exports.removeFromWatchlist = async (req, res) => {
  const { email, mediaId } = req.body;
  try {
    const user = await User.findOneAndUpdate(
      { email },
      { $pull: { watchlist: { mediaId } } },
      { new: true }
    );
    if (user) {
      res.json({ msg: "Media removed from watchlist.", watchlist: user.watchlist });
    } else {
      res.status(404).json({ msg: "User not found." });
    }
  } catch (error) {
    res.status(500).json({ msg: "Error removing media from watchlist.", error });
  }
};

module.exports.updateTriviaResults = async (req, res) => {
  const { email, correctAnswers, incorrectAnswers } = req.body;

  try {
    const user = await User.findOneAndUpdate(
      { email },
      {
        $inc: {
          'triviaResults.correct': correctAnswers,
          'triviaResults.incorrect': incorrectAnswers,
        },
      },
      { new: true, upsert: true } // upsert: true to create a new document if no document matches the query
    );

    if (user) {
      res.json({ msg: "Trivia results updated.", triviaResults: user.triviaResults });
    } else {
      res.status(404).json({ msg: "User not found." });
    }
  } catch (error) {
    res.status(500).json({ msg: "Error updating trivia results.", error });
  }
};
module.exports.getTriviaResults = async (req, res) => {
  const { email } = req.params;

  try {
    const user = await User.findOne({ email }, "triviaResults"); 
    if (user) {
      res.json(user.triviaResults);
    } else {
      res.status(404).json({ msg: "User not found." });
    }
  } catch (error) {
    res.status(500).json({ msg: "Error fetching trivia results.", error });
  }
};

module.exports.getLeaderboard = async (req, res) => {
  try {
    // Fetch all users' trivia results, sort them by correct answers in descending order
    const leaderboard = await User.find({}, "triviaResults email").sort({"triviaResults.correct": -1});
    if (leaderboard.length > 0) {
      res.json(leaderboard);
    } else {
      res.status(404).json({ msg: "No trivia results found." });
    }
  } catch (error) {
    res.status(500).json({ msg: "Error fetching leaderboard.", error });
  }
};

