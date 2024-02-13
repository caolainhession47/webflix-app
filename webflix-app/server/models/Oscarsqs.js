const mongoose = require('mongoose');

const oscarsSchema = new mongoose.Schema({
    id: Number,
    question: String,
    options: [String],
    correctAnswer: String,
  }, { collection: 'Oscarsqs' });
  
  const OscarsQuestions = mongoose.model('OscarsQuestions', oscarsSchema);
  
  module.exports = OscarsQuestions;
  