const User = require('../models/UserModel');

module.exports.createUser = async (req, res) => {
  const { email, username } = req.body;

  try {
    // Check if a user with the given email or username already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({ msg: "Email or username already exists." });
    }

    // Create a new user with the email and username provided
    const newUser = new User({ email: email.toLowerCase(), username });

    // Save the new user to the database
    await newUser.save();

    res.status(201).json({ msg: "New user created successfully.", user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error creating new user.", error: error.message });
  }
};

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

// Fetch user's movies rated 5 stars
module.exports.getHighlyRatedMovies = async (req, res) => {
  const { email } = req.params;
  try {
    const user = await User.findOne({ email });
    if (user) {
      // Filter the reviews array for movies with a rating of 5
      const highlyRatedMovies = user.reviews.filter(review => review.rating === 5);
      res.json(highlyRatedMovies.map(review => review.mediaId)); // Send only the media IDs of highly rated movies
    } else {
      res.status(404).json({ msg: "User not found." });
    }
  } catch (error) {
    res.status(500).json({ msg: "Error fetching highly rated movies.", error });
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
    const leaderboard = await User.find({}, "triviaResults username").sort({"triviaResults.correct": -1});
    if (leaderboard.length > 0) {
      res.json(leaderboard);
    } else {
      res.status(404).json({ msg: "No trivia results found." });
    }
  } catch (error) {
    res.status(500).json({ msg: "Error fetching leaderboard.", error });
  }
};

// Add a review
module.exports.addReview = async (req, res) => {
  const { email, mediaId, mediaType, title, posterPath, rating, reviewText } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "User not found." });
    }

    const review = {
      mediaId,
      mediaType,
      title,
      posterPath,
      rating,
      reviewText,
    };

    user.reviews.push(review);
    await user.save();

    res.status(201).json({ msg: "Review added successfully.", review });
  } catch (error) {
    console.error(error); 
    res.status(500).json({ msg: "Error adding review.", error: error.message });
  }
};


// Fetch all reviews for a specific media along with user's email and username
module.exports.getReviewsByMediaId = async (req, res) => {
  const { mediaId } = req.params;

  try {
    const reviews = await User.aggregate([
      { $unwind: "$reviews" },
      { $match: { "reviews.mediaId": mediaId } },
      { $project: {
          "email": 1,
          "username": 1,  // Include the username in the projection
          "review": "$reviews",
          "_id": 0
        }
      }
    ]);

    if (reviews.length > 0) {
      const formattedReviews = reviews.map(({ email, username, review }) => ({
        email,
        username,  // Include the username in each review object
        ...review  // Spread the review document fields
      }));
      res.json(formattedReviews);
    } else {
      res.status(404).json({ msg: "No reviews found for this media." });
    }
  } catch (error) {
    res.status(500).json({ msg: "Error fetching reviews.", error });
  }
};


// Remove review
module.exports.removeReview = async (req, res) => {
  const { email, mediaId } = req.body;

  try {
    // Find the user and pull the review from their reviews array that matches the mediaId
    const updatedUser = await User.findOneAndUpdate(
      { email },
      { $pull: { reviews: { mediaId } } },
      { new: true }
    );

    if (updatedUser) {
      res.json({ msg: "Review removed successfully.", reviews: updatedUser.reviews });
    } else {
      res.status(404).json({ msg: "User not found." });
    }
  } catch (error) {
    res.status(500).json({ msg: "Error removing review.", error });
  }
};

// Fetch all reviews made by a user
module.exports.getUserReviews = async (req, res) => {
  const { email } = req.params;

  try {
    const user = await User.findOne({ email }, "reviews");
    if (user && user.reviews.length > 0) {
      res.json(user.reviews);
    } else {
      res.status(404).json({ msg: "No reviews found for this user." });
    }
  } catch (error) {
    res.status(500).json({ msg: "Error fetching user reviews.", error });
  }
};

// Update a review
module.exports.updateReview = async (req, res) => {
  const { email, mediaId, rating, reviewText } = req.body;

  try {
    let user = await User.findOne({ email });

    let reviewIndex = user.reviews.findIndex(review => review.mediaId === mediaId);

    if (reviewIndex !== -1) {
      user.reviews[reviewIndex].rating = rating;
      user.reviews[reviewIndex].reviewText = reviewText;
      await user.save();
      res.json({ msg: "Review updated successfully", review: user.reviews[reviewIndex] });
    } else {
      res.status(404).json({ msg: "Review not found" });
    }
  } catch (error) {
    res.status(500).json({ msg: "Error updating review", error });
  }
};