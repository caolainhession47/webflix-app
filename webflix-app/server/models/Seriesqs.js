const mongoose = require('mongoose');

const seriesSchema = new mongoose.Schema({
    id: Number,
    question: String,
    options: [String],
    correctAnswer: String,
  }, { collection: 'Seriesqs' });
  
  const SeriesQuestions = mongoose.model('SeriesQuestions', seriesSchema);
  
  module.exports = SeriesQuestions;