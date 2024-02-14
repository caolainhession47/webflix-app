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

const reviewSchema = new mongoose.Schema({
  mediaId: {
    type: String,
    required: true,
  },
  mediaType: {
    type: String,
    required: true,
    enum: ['movie', 'tv'],
  },
  title: {
    type: String,
    required: true,
  },
  posterPath: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  reviewText: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
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
  triviaResults: triviaResultsSchema, 
  reviews: [reviewSchema],
});

module.exports = mongoose.model("User", userSchema);
