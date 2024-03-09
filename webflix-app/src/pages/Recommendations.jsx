import React, { useState, useEffect } from "react";
import {
  ButtonGroup,
  Button,
  TextField,
  Container,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import axios from "axios";
import styled from "styled-components";
import MediaGrid from "../components/MediaGrid";
import { firebaseAuth } from "../utils/firebase-config";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FullPageLoader from "../components/FullPageLoader";
import { toast } from "react-toastify";

const theme = createTheme({
  palette: {
    primary: {
      main: "#e82128",
    },
    secondary: {
      main: "#000000",
    },
    text: {
      primary: "#ffffff",
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          "& label.Mui-focused": {
            color: "#e82128",
          },
          "& label": {
            color: "grey",
            "&.MuiInputLabel-root:hover": {
              color: "#bf0000",
            },
          },
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "grey",
            },
            "&:hover fieldset": {
              borderColor: "#bf0000",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#e82128",
            },
            "& input::placeholder": {
              color: "grey",
              opacity: 1,
            },
            "& input": {
              color: "white",
            },
          },
        },
      },
    },
  },
});

const Recommendations = () => {
  const [activeButton, setActiveButton] = useState("forYou");
  const [recommendationIDs, setRecommendationIDs] = useState([]);
  const [emailInputs, setEmailInputs] = useState(Array(6).fill(""));
  const [currentUserEmail, setCurrentUserEmail] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  const [loadingForYou, setLoadingForYou] = useState(false);
  const [showEmailFields, setShowEmailFields] = useState(true);

  useEffect(() => {
    const unsubscribe = firebaseAuth.onAuthStateChanged((currentUser) => {
      setCurrentUserEmail(currentUser ? currentUser.email : null);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (currentUserEmail && activeButton === "forYou") {
      fetchForYouRecommendations(currentUserEmail);
    }
  }, [currentUserEmail, activeButton]);

  const fetchForYouRecommendations = async (email) => {
    setLoadingForYou(true);
    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/recommend/content-based",
        { email }
      );

      // Check if the response contains recommendations
      if (response.data.message) {
        // Handle the case where no recommendations are found
        toast.warn(response.data.message);
        setRecommendationIDs([]);
      } else {
        // Otherwise, process the recommendations as usual
        const fetchedIDs = response.data.map((item) => item.id);
        setRecommendationIDs(fetchedIDs);
      }
    } catch (error) {
      // Handle errors that aren't related to the absence of recommendations
      console.error("Error fetching for you recommendations:", error);
      toast.error("An error occurred while fetching recommendations.");
    } finally {
      setLoadingForYou(false); // End loading
    }
  };

  const hasRecommendations = recommendationIDs.length > 0;

  const handleGenerateWatchPartyRecommendations = async () => {
    const emails = emailInputs.filter((email) => email.trim() !== "");
    if (emails.length === 0) return;

    setShowEmailFields(false);
    setLoadingRecommendations(true);
    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/recommend/hybrid",
        { emails }
      );
      const fetchedIDs = response.data.map((item) => item.id);
      setRecommendationIDs(fetchedIDs);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        toast.warn(
          "Recommendations are generated based on users favourites and movies they rate highly, please interact with movies to get tailored recommendations"
        );
      } else {
        console.error("Error fetching watch party recommendations:", error);
      }
    } finally {
      setLoadingRecommendations(false);
    }
  };

  const handleEmailInputChange = (index, value) => {
    const updatedEmails = [...emailInputs];
    updatedEmails[index] = value;
    setEmailInputs(updatedEmails);
  };

  const handleButtonClick = (button) => {
    setActiveButton(button);
    if (button === "watchParty") {
      setShowEmailFields(true);
      if (recommendationIDs.length > 0) {
        setRecommendationIDs([]);
      }
    } else if (button === "forYou" && currentUserEmail) {
      fetchForYouRecommendations(currentUserEmail);
    }
  };

  if (loadingForYou || (activeButton === "forYou" && loadingRecommendations)) {
    return (
      <>
        <Navbar isScrolled={isScrolled} />
        <ButtonGroup />
        <FullPageLoader />
      </>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Navbar isScrolled={isScrolled} />
      {loadingRecommendations && <FullPageLoader />}
      <StyledContainer>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
            paddingBottom: "1rem",
          }}
        >
          <ButtonGroup
            variant="contained"
            aria-label="outlined primary button group"
          >
            <Button
              onClick={() => handleButtonClick("forYou")}
              color={activeButton === "forYou" ? "primary" : "secondary"}
            >
              For You
            </Button>
            <Button
              onClick={() => handleButtonClick("watchParty")}
              color={activeButton === "watchParty" ? "primary" : "secondary"}
            >
              Watch Party
            </Button>
          </ButtonGroup>
        </div>
        {activeButton === "forYou" && !loadingForYou && !hasRecommendations && (
          <MessageContainer>
            <h1>
              Recommendations are generated from movies that are in a users
              favourites list or movies that a user has rated highly, please
              interact with movies in order to get recommendations.
            </h1>
          </MessageContainer>
        )}
        {activeButton === "watchParty" && showEmailFields && (
          <WatchPartyContainer>
            {emailInputs.map((email, index) => (
              <TextField
                key={index}
                label={`Email ${index + 1}`}
                placeholder={`Email ${index + 1}`}
                variant="outlined"
                value={email}
                onChange={(e) => handleEmailInputChange(index, e.target.value)}
                fullWidth
                margin="normal"
                className="textField"
              />
            ))}
            <Button
              className="generate"
              variant="contained"
              color="primary"
              onClick={handleGenerateWatchPartyRecommendations}
              disabled={loadingRecommendations}
            >
              {loadingRecommendations ? "Loading..." : "Get Recommendations"}
            </Button>
          </WatchPartyContainer>
        )}
        {!loadingRecommendations && recommendationIDs.length > 0 && (
          <MediaGrid
            selectedOption="custom"
            mediaType="movie"
            recommendationIDs={recommendationIDs}
          />
        )}
      </StyledContainer>
      <Footer />
    </ThemeProvider>
  );
};

const StyledContainer = styled(Container)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 7rem;
  min-height: 100vh;
`;

const WatchPartyContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  .textField {
    margin-bottom: -4px;
  }

  .generate {
    width: fit-content;
    margin-top: 1.5rem;
  }
`;

const MessageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 54vh;
  text-align: center;
  background-color: #333;
  color: white;
  margin: 2rem;
  padding: 2rem;
  border-radius: 10px;
  bottom: 1rem;
  position: relative;
`;

export default Recommendations;
