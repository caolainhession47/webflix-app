import React, { useState } from "react";
import styled from "styled-components";
import BackgroundImage from "../components/BackgroundImage";
import Logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import serverAxios from "../axios/serverAxios";

export default function Challenges() {
  const navigate = useNavigate();
  const [selectedChallenge, setSelectedChallenge] = useState("");
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  const handleLogoClick = () => {
    navigate("/");
  };

  const handleSelect = (eventKey) => {
    setSelectedChallenge(eventKey);
    navigate(`/trivia/${eventKey.toLowerCase()}`);
  };

  const handleLeaderboardClick = async () => {
    if (!showLeaderboard) {
      // If the leaderboard is not currently shown, fetch the data and show the leaderboard
      try {
        const response = await serverAxios.get("/api/users/trivia/leaderboard");
        const formattedData = response.data.map((user) => {
          const ratio =
            user.triviaResults.incorrect > 0
              ? (
                  user.triviaResults.correct / user.triviaResults.incorrect
                ).toFixed(2)
              : "Perfect";
          return {
            ...user,
            points: user.triviaResults.correct,
            ratio,
          };
        });
        setLeaderboardData(formattedData);
      } catch (err) {
        console.error("Failed to fetch leaderboard data", err);
      }
    }
    // Toggle the visibility of the leaderboard
    setShowLeaderboard(!showLeaderboard);
  };

  return (
    <StyledContainer>
      <BackgroundImage />
      <div className="content">
        <img
          src={Logo}
          alt="Webflix Logo"
          className="logo"
          onClick={handleLogoClick}
        />
        <LeaderboardIcon
          className="leaderboard-icon"
          onClick={handleLeaderboardClick}
        />
        <div className="challenges">
          <h1>Ready for today's series of challenges?</h1>
          <h4>Select a challenge type and put your knowledge to the test:</h4>
          <Dropdown onSelect={handleSelect}>
            <Dropdown.Toggle variant="danger" id="dropdown-challenges">
              {selectedChallenge
                ? `${selectedChallenge} Trivia`
                : "Select Challenge"}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item eventKey="Movie">Movie Trivia</Dropdown.Item>
              <Dropdown.Item eventKey="Series">Series Trivia</Dropdown.Item>
              <Dropdown.Item eventKey="Actor">Actor Trivia</Dropdown.Item>
              <Dropdown.Item eventKey="Director">Director Trivia</Dropdown.Item>
              <Dropdown.Item eventKey="Oscars">Oscars Trivia</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          {showLeaderboard && (
            <LeaderboardContainer>
              <h2 className="lbtitle">Leaderboard</h2>
              {leaderboardData.map((user, index) => (
                <div key={index} className="leaderboard-entry">
                  <p>{`${index + 1}. ${user.email} - Points: ${
                    user.points
                  } | Ratio: ${user.ratio}`}</p>
                </div>
              ))}
            </LeaderboardContainer>
          )}
        </div>
      </div>
    </StyledContainer>
  );
}

const StyledContainer = styled.div`
  position: relative;
  .logo {
    position: absolute;
    top: 2rem;
    left: 4rem;
    height: 5rem;
    cursor: pointer;
    z-index: 10;
  }
  .lbtitle {
    margin-bottom: 1rem;
  }
  .leaderboard-icon {
    position: absolute;
    top: 2.1rem;
    right: 4rem;
    cursor: pointer;
    color: #ffffff;
    background-color: #e82128;
    font-size: 3rem;
    z-index: 10;
    padding: 15px;
    border-radius: 30%;
    display: flex;
    justify-content: center;
    width: 80px;
    height: 80px;
  }

  .content {
    position: absolute;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100vw;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .challenges {
    padding: 2rem;
    background-color: #000000b0;
    width: 40vw;
    border-radius: 10px;
    color: white;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2rem;
  }
`;

const LeaderboardContainer = styled.div`
  position: absolute;
  top: 8rem;
  right: 2rem;
  width: 27.7vw;
  height: 60vh;
  background-color: #ffffff;
  color: #000000;
  border-radius: 10px;
  padding: 20px 10px;
  overflow-y: auto;
  z-index: 20;
`;
