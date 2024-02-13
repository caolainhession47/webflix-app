const mongoose = require("mongoose");

const mediaSchema = new mongoose.Schema({
  mediaId: {
    type: Number,
    required: true, 
  },
  mediaType: {
    type: String,
    enum: ['movie', 'tv'], 
    required: true, 
  },
  title: {
    type: String,
    required: true, 
  },
  posterPath: {
    type: String, 
  },
  releaseDate: {
    type: String, 
  },
  rating: {
    type: Number, 
  },
});

const triviaResultsSchema = new mongoose.Schema({
  correct: { type: Number, default: 0 },
  incorrect: { type: Number, default: 0 },
});

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  favorites: [mediaSchema],
  watchlist: [mediaSchema],
  triviaResults: triviaResultsSchema, // Embed the trivia results schema here
});

module.exports = mongoose.model("User", userSchema);
