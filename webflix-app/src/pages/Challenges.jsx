import React, { useState } from "react";
import styled from "styled-components";
import BackgroundImage from "../components/BackgroundImage";
import Logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import serverAxios from "../axios/serverAxios";
import { Bar, Pie } from "react-chartjs-2";
import "chart.js/auto";

export default function Challenges() {
  const navigate = useNavigate();
  const [selectedChallenge, setSelectedChallenge] = useState("");
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  const maxPoints = leaderboardData.length > 0 ? leaderboardData[0].points : 0;

  const LeaderboardEntry = ({ user, maxPoints }) => {
    // Bar chart data for this user
    const barData = {
      labels: [user.email],
      datasets: [
        {
          label: "Points",
          data: [user.points],
          backgroundColor: "rgba(33, 150, 243, 0.5)",
          borderColor: "rgba(33, 150, 243, 1)",
          borderWidth: 1,
          borderRadius: 20,
          borderSkipped: false,
        },
      ],
    };

    // Pie chart data for this user
    const pieData = {
      labels: ["Correct", "Incorrect"],
      datasets: [
        {
          data: [user.triviaResults.correct, user.triviaResults.incorrect],
          backgroundColor: ["#4caf50", "#f44336"],
          hoverOffset: 4,
        },
      ],
    };

    const barOptions = {
      indexAxis: "y",
      elements: {
        bar: {
          borderWidth: 2,
        },
      },
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          grid: {
            display: false,
          },
          ticks: {
            display: true,
          },
          max: maxPoints, // Set max value to the max points
        },
        y: {
          afterFit: function (scale) {
            scale.width = 200;
          },
          grid: {
            display: false,
          },
          ticks: {
            display: true,
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
      },
    };

    const totalAnswers =
      user.triviaResults.correct + user.triviaResults.incorrect;
    // Calculate the ratio of correct answers to total answers
    const ratio =
      totalAnswers > 0
        ? (user.triviaResults.correct / totalAnswers).toFixed(2)
        : "Perfect";

    const pieOptions = {
      layout: {
        padding: {
          left: 0,
          right: 210,
          top: 0,
          bottom: 0,
        },
      },
      plugins: {
        legend: {
          display: false,
        },
      },
      responsive: true,
      maintainAspectRatio: false, // false allows custom dimensions
    };

    return (
      <div
        className="leaderboard-entry"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "10px",
        }}
      >
        <div style={{ width: "75vw" }}>
          <Bar data={barData} options={barOptions} />
        </div>
        <div style={{ width: "30%", height: "130px" }}>
          <Pie data={pieData} options={pieOptions} />
        </div>
        <div
          style={{
            position: "absolute",
            right: "9.7rem",
          }}
        >
          <h6>{`Ratio: ${ratio}`}</h6>
        </div>
      </div>
    );
  };

  const handleLogoClick = () => {
    navigate("/");
  };

  const handleSelect = (eventKey) => {
    setSelectedChallenge(eventKey);
    navigate(`/trivia/${eventKey.toLowerCase()}`);
  };

  const handleLeaderboardClick = async () => {
    if (!showLeaderboard) {
      try {
        const response = await serverAxios.get("/api/users/trivia/leaderboard");
        const formattedData = response.data.map((user) => ({
          ...user,
          points: user.triviaResults.correct,
        }));
        setLeaderboardData(formattedData);
      } catch (err) {
        console.error("Failed to fetch leaderboard data", err);
      }
    }
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
              <StyledDropdownItem eventKey="Movie">
                Movie Trivia
              </StyledDropdownItem>
              <StyledDropdownItem eventKey="Series">
                Series Trivia
              </StyledDropdownItem>
              <StyledDropdownItem eventKey="Actor">
                Actor Trivia
              </StyledDropdownItem>
              <StyledDropdownItem eventKey="Director">
                Director Trivia
              </StyledDropdownItem>
              <StyledDropdownItem eventKey="Oscars">
                Oscars Trivia
              </StyledDropdownItem>
            </Dropdown.Menu>
          </Dropdown>

          {showLeaderboard && (
            <LeaderboardContainer>
              <h1 className="lbtitle">Leaderboard</h1>
              {leaderboardData.map((user, index) => (
                <LeaderboardEntry
                  key={index}
                  user={user}
                  maxPoints={maxPoints}
                />
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
    background-color: #d93237;
    font-size: 3rem;
    z-index: 100;
    padding: 15px;
    border-radius: 30%;
    display: flex;
    justify-content: center;
    width: 80px;
    height: 80px;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: #b81a20;
    }
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
  // top: 1rem;
  // right: 2rem;
  width: 100vw;
  height: 100vh;
  background-color: #ffffff;
  color: #000000;
  //border-radius: 10px;
  padding: 20px 10px;
  overflow-y: auto;
  z-index: 20;
`;

const StyledDropdownItem = styled(Dropdown.Item)`
  color: #8a0606 !important;
  background-color: transparent !important;
  padding: 0.4rem 1rem !important;
  font-weight: bold !important;

  &:hover,
  &:focus {
    background-color: #ff000042 !important;
    color: #d12f2f !important;
  }
`;
