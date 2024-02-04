import React, { useState } from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import { Container } from "react-bootstrap";

const movieGenres = [
  { name: "Top Rated", id: "top_rated" },
  { name: "Popular", id: "popular" },
  { name: "Trending", id: "trending" },
  { name: "In Cinemas Now", id: "now_playing" },
  { name: "Action", id: 28 },
  { name: "Adventure", id: 12 },
  { name: "Animation", id: 16 },
  { name: "Comedy", id: 35 },
  { name: "Crime", id: 80 },
  { name: "Documentary", id: 99 },
  { name: "Drama", id: 18 },
  { name: "Family", id: 10751 },
  { name: "Fantasy", id: 14 },
  { name: "History", id: 36 },
  { name: "Horror", id: 27 },
  { name: "Music", id: 10402 },
  { name: "Mystery", id: 9648 },
  { name: "Romance", id: 10749 },
  { name: "Science Fiction", id: 878 },
  { name: "TV Movie", id: 10770 },
  { name: "Thriller", id: 53 },
  { name: "War", id: 10752 },
  { name: "Western", id: 37 },
];

const seriesGenres = [
  { name: "Top Rated", id: "top_rated" },
  { name: "Popular", id: "popular" },
  { name: "Trending", id: "trending" },
  { name: "Action & Adventure", id: 10759 },
  { name: "Animation", id: 16 },
  { name: "Comedy", id: 35 },
  { name: "Crime", id: 80 },
  { name: "Documentary", id: 99 },
  { name: "Drama", id: 18 },
  { name: "Family", id: 10751 },
  { name: "Kids", id: 10762 },
  { name: "Mystery", id: 9648 },
  { name: "Reality", id: 10764 },
  { name: "Sci-Fi & Fantasy", id: 10765 },
  { name: "Soap", id: 10766 },
  { name: "Talk", id: 10767 },
  { name: "War & Politics", id: 10768 },
];

const GenresMenu = ({ onSelectGenre, pageType }) => {
  const [selectedGenreName, setSelectedGenreName] = useState("Top Rated");
  const genres = pageType === "series" ? seriesGenres : movieGenres;
  const title = pageType === "series" ? "Series" : "Movies";

  return (
    <Container
      fluid
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginLeft: "3rem",
        paddingRight: "6rem",
        marginTop: "-1rem",
      }}
    >
      <h2
        style={{
          color: "white",
          marginBottom: "17px",
          textAlign: "flex-start",
          position: "relative",
          fontSize: "2rem",
        }}
      >
        {title}
        <span
          style={{
            content: "",
            position: "absolute",
            left: 0,
            bottom: "-12px",
            marginBottom: "0.5rem",
            width: "7rem",
            height: "5px",
            backgroundColor: "#e82128",
          }}
        ></span>
      </h2>
      <PopupState variant="popover" popupId="genres-menu">
        {(popupState) => (
          <>
            <Button
              variant="contained"
              {...bindTrigger(popupState)}
              sx={{
                backgroundColor: "#E82128",
                "&:hover": { backgroundColor: "#C00000" },
              }}
            >
              {selectedGenreName}
            </Button>
            <Menu {...bindMenu(popupState)}>
              {genres.map((genre) => (
                <MenuItem
                  key={genre.id}
                  onClick={() => {
                    onSelectGenre(genre.id);
                    setSelectedGenreName(genre.name);
                    popupState.close();
                  }}
                  sx={{
                    color: "#8a0606",
                    "&:hover": {
                      backgroundColor: "#ff000042",
                      color: "#d12f2f",
                    },
                  }}
                >
                  {genre.name}
                </MenuItem>
              ))}
            </Menu>
          </>
        )}
      </PopupState>
    </Container>
  );
};

export default GenresMenu;
