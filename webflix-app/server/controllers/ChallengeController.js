const ActorQuestions = require('../models/Actorqs');
const DirectorQuestions = require('../models/Directorqs');
const OscarsQuestions = require('../models/Oscarsqs');
const SeriesQuestions = require('../models/Seriesqs');
const MovieQuestions = require('../models/Movieqs');


// function to fetch random questions
const fetchRandomQuestions = async (Model) => {
  try {
    const questions = await Model.aggregate([
      { $sample: { size: 10 } }
    ]);
    return questions;
  } catch (error) {
    console.error(`Error fetching random questions from ${Model.modelName}:`, error);
    throw error; 
  }
};

// Function to handle the route
const getRandomQuestions = async (req, res) => {
  const { type } = req.params;
  let Model;

  switch (type) {
    case 'actor':
      Model = ActorQuestions;
      break;
    case 'director':
      Model = DirectorQuestions;
      break;
    case 'oscars':
      Model = OscarsQuestions;
      break;
    case 'series':
      Model = SeriesQuestions;
      break;
    case 'movie':
      Model = MovieQuestions;
      break;
    default:
      return res.status(400).json({ message: 'Invalid challenge type specified' });
  }

  try {
    const questions = await fetchRandomQuestions(Model);
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch random questions', error });
  }
};

module.exports = {
  getRandomQuestions,
};
