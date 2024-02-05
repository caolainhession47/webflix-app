import React, { useState, useEffect, useCallback } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Button, ButtonGroup, TextField } from "@mui/material";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SearchMediaGrid from "../components/SearchMediaGrid";
import axios from "../axios/axios";
import requests from "../axios/requests";

const theme = createTheme({
  palette: {
    primary: {
      main: "#000000",
    },
    secondary: {
      main: "#e82128",
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "grey",
            },
            "&:hover fieldset": {
              borderColor: "#bf0000",
            },
          },
        },
      },
    },
  },
});

export default function Search() {
  const [selectedMediaType, setSelectedMediaType] = useState("movie");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isScrolled, setIsScrolled] = useState(false);

  const performSearch = useCallback(async () => {
    if (searchQuery.trim()) {
      let url;
      if (selectedMediaType === "people") {
        url = requests.fetchSearchPeople(searchQuery);
      } else {
        url = requests.fetchSearch(selectedMediaType, searchQuery);
      }

      try {
        const response = await axios.get(url);
        setSearchResults(response.data.results);
      } catch (error) {
        console.error("Error performing search:", error);
      }
    }
  }, [searchQuery, selectedMediaType]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // prevent search on initial render or empty query
    if (searchQuery.trim()) {
      performSearch();
    }
  }, [searchQuery, performSearch]);

  const handleMediaTypeSelect = (mediaType) => {
    setSelectedMediaType(mediaType);
    setSearchResults([]);
    setSearchQuery(""); // Clear the search query when changing media type
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <>
      <Navbar isScrolled={isScrolled} />
      <ThemeProvider theme={theme}>
        <div
          style={{
            marginTop: "70px",
            padding: "20px",
            backgroundColor: "black",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <ButtonGroup
            variant="contained"
            aria-label="media type selection"
            style={{ marginBottom: "20px" }}
          >
            <Button
              onClick={() => handleMediaTypeSelect("movie")}
              color={selectedMediaType === "movie" ? "secondary" : "primary"}
            >
              Movies
            </Button>
            <Button
              onClick={() => handleMediaTypeSelect("tv")}
              color={selectedMediaType === "tv" ? "secondary" : "primary"}
            >
              Series
            </Button>
            <Button
              onClick={() => handleMediaTypeSelect("people")}
              color={selectedMediaType === "people" ? "secondary" : "primary"}
            >
              People
            </Button>
          </ButtonGroup>
          <TextField
            color="error"
            placeholder="Search Webflix"
            sx={{ width: "100%" }}
            autoFocus
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{ style: { color: "white" } }}
          />
          {searchResults.length > 0 && (
            <SearchMediaGrid searchResults={searchResults} />
          )}
        </div>
      </ThemeProvider>
      <Footer />
    </>
  );
}
