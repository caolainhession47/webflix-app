//require('dotenv').config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require("./routes/UserRoutes");
const challengeRoutes = require('./routes/ChallengeRoutes');


const app = express();
app.use(cors());
app.use(express.json());

//const mongoDbUri = process.env.MONGODB_URI;
const mongoDbUri = "mongodb+srv://caolainhession:Padraig1@webflix.ymlg9zp.mongodb.net/";

mongoose.connect(mongoDbUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("DB Connection Successful"))
.catch((err) => console.error(err.message));



  app.use('/api/users', userRoutes);
  app.use('/api/challenges', challengeRoutes);


  // app.listen(5000, () => {
  //   console.log("server started on port 5000");
  // });

  module.exports = app;
