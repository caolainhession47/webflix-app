const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    id: Number,
    question: String,
    options: [String],
    correctAnswer: String,
  }, { collection: 'Movieqs' });
  
  const MovieQuestions = mongoose.model('MovieQuestions', movieSchema);
  
  module.exports = MovieQuestions;