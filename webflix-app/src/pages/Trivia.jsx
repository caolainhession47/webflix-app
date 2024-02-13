import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import serverAxios from "../axios/serverAxios";
import Button from "@mui/material/Button";
import { firebaseAuth } from "../utils/firebase-config";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

// Images
import OscarsTriviaBg from "../assets/oscars-trivia-bg.jpg";
import MoviesTriviaBg from "../assets/movies-trivia-bg.jpg";
import SeriesTriviaBg from "../assets/series-trivia-bg.jpg";
import ActorsTriviaBg from "../assets/actors-trivia-bg.jpg";
import DirectorsTriviaBg from "../assets/directors-trivia-bg.jpg";

const backgrounds = {
  oscars: OscarsTriviaBg,
  movie: MoviesTriviaBg,
  series: SeriesTriviaBg,
  actor: ActorsTriviaBg,
  director: DirectorsTriviaBg,
};

export default function Trivia() {
  const { challengeType } = useParams();
  const [questions, setQuestions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [results, setResults] = useState({ correct: 0, incorrect: 0 });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await serverAxios.get(
          `/api/challenges/randomQuestions/${challengeType}`
        );
        setQuestions(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch questions");
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [challengeType]);

  const bgImage = backgrounds[challengeType] || MoviesTriviaBg;

  const handleOptionSelect = (questionIndex, option) => {
    setSelectedOptions({ ...selectedOptions, [questionIndex]: option });
  };

  const handleSubmit = async () => {
    let correct = 0;
    let incorrect = 0;
    questions.forEach((question, index) => {
      if (selectedOptions[index] === question.correctAnswer) {
        correct++;
      } else {
        incorrect++;
      }
    });

    setResults({ correct, incorrect });
    setSubmitted(true);

    const user = firebaseAuth.currentUser;
    if (user && user.email) {
      try {
        await serverAxios.put("/api/users/triviaResults/update", {
          email: user.email,
          correctAnswers: correct,
          incorrectAnswers: incorrect,
        });
        console.log("Trivia results updated successfully.");
      } catch (error) {
        console.error("Error updating trivia results:", error);
      }
    } else {
      console.error("User is not authenticated.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <StyledTrivia $bgImage={bgImage}>
      <div className="trivia-container">
        {questions.map((question, index) => (
          <div key={index} className="question">
            <h3>
              {index + 1}. {question.question}
            </h3>
            {question.options.map((option, idx) => (
              <Button
                key={idx}
                variant="contained"
                className={`option ${
                  selectedOptions[index] === option ? "selected" : ""
                }`}
                onClick={() => handleOptionSelect(index, option)}
                disabled={submitted}
              >
                {option}
              </Button>
            ))}
          </div>
        ))}
        {!submitted && (
          <Button
            variant="contained"
            color="success"
            onClick={handleSubmit}
            style={{
              color: "#ffffff",
              fontSize: "2.5rem",
              padding: "10px",
              width: "20rem",
            }}
          >
            Submit
          </Button>
        )}
      </div>
      {submitted && (
        <ResultsContainer>
          <div className="results">
            <h2>Results</h2>
            <p>Correct Answers: {results.correct}</p>
            <p>Incorrect Answers: {results.incorrect}</p>
          </div>
          <Button
            startIcon={<ArrowBackIcon style={{ color: "#e82128" }} />}
            onClick={() => navigate("/challenges")}
            style={{
              color: "#e82128",
              marginBottom: "20px",
              fontSize: "1.2rem",
            }}
          >
            Back to Challenges
          </Button>
        </ResultsContainer>
      )}
    </StyledTrivia>
  );
}

const StyledTrivia = styled.div`
  height: 100vh;
  background-image: url(${(props) => props.$bgImage});
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  overflow-y: auto;

  .trivia-container {
    width: 100%;
    max-height: 100vh;
    background-color: rgba(0, 0, 0, 0.2);
    padding: 4rem;
    padding-left: 6rem;
    color: white;
    overflow-y: auto;

    .question {
      margin-bottom: 30px;
    }

    .option {
      margin: 5px;
      background-color: #e82128;
      color: white;
      border: none;
      border-radius: 5px;
      padding: 10px 20px;
      cursor: pointer;

      &:hover {
        background-color: #c71c22;
      }
    }

    .option.selected {
      background-color: #4caf50 !important;
    }

    .results {
      margin-top: 20px;
      color: white;
    }
  }
`;

const ResultsContainer = styled.div`
  position: fixed;
  top: 35%;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  max-width: 500px;
  background-color: white;
  color: black;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  z-index: 100;
  border: 2px solid black;

  .results {
    margin-bottom: 20px;

    h2 {
      font-size: 2rem;
      padding-bottom: 0.5rem;
    }

    p {
      font-size: 1.5rem;
    }
  }
`;
