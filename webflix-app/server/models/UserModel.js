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

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true, 
  },
  favorites: [mediaSchema], 
  watchlist: [mediaSchema], 
});

module.exports = mongoose.model("User", userSchema);
