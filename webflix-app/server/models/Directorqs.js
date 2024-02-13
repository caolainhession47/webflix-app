const mongoose = require('mongoose');

const directorSchema = new mongoose.Schema({
    id: Number,
    question: String,
    options: [String],
    correctAnswer: String,
  }, { collection: 'Directorqs' });
  
  const DirectorQuestions = mongoose.model('DirectorQuestions', directorSchema);
  
  module.exports = DirectorQuestions;