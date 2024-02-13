const mongoose = require('mongoose');

const actorSchema = new mongoose.Schema({
  id: Number,
  question: String,
  options: [String],
  correctAnswer: String,
}, { collection: 'Actorqs' });

const ActorQuestions = mongoose.model('ActorQuestions', actorSchema);

module.exports = ActorQuestions;