import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Container from "react-bootstrap/Container";
import axios from "../axios/axios.js";
import requests from "../axios/requests.js";
import Rating from "./Rating";
import { Button } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import IconButton from "@mui/material/IconButton";
import InfoIcon from "@mui/icons-material/Info";
import FullPageLoader from "./FullPageLoader";
import { useNavigate } from "react-router-dom";

function Banner() {
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [genres, setGenres] = useState([]);

  function truncate(string, n) {
    return string?.length > n ? string.substr(0, n) + "..." : string;
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const genreRes = await axios.get(
          `https://api.themoviedb.org/3${requests.fetchGenres}`
        );
        const genreMap = new Map(
          genreRes.data.genres.map((genre) => [genre.id, genre.name])
        );

        const request = await axios.get(
          `https://api.themoviedb.org/3${requests.fetchTrending}`
        );
        const randomMovie =
          request.data.results[
            Math.floor(Math.random() * request.data.results.length)
          ];
        setMovie(randomMovie);

        const movieGenres = randomMovie.genre_ids
          .map((id) => genreMap.get(id))
          .filter(Boolean);
        setGenres(movieGenres);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

  if (!movie) {
    return <FullPageLoader />;
  }

  const handleInfoClick = () => {
    navigate(`/media/${movie.id}`);
  };

  const handlePlayTrailer = () => {
    navigate(`/player/${movie.id}`);
  };

  return (
    <StyledContainer fluid>
      <div
        className="banner"
        style={{
          backgroundSize: "cover",
          backgroundImage: `url('https://image.tmdb.org/t/p/original/${movie?.backdrop_path}')`,
          backgroundPosition: "center center",
        }}
      >
        {/* Banner contents */}
        <div className="bcontents">
          {/* Title */}
          <h1 className="btitle">
            {movie?.title || movie?.name || movie?.original_name}
          </h1>

          {/* Rating and Genres */}
          <div className="rating-genres-container">
            <Rating value={movie.vote_average} />
            <div className="genre-tags">
              {genres.map((genre, index) => (
                <div key={index} className="genre-tag">
                  {genre}
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <h1 className="bdescription">{truncate(movie?.overview, 270)}</h1>

          {/* Play Trailer Button */}
          <Button
            variant="contained"
            color="primary"
            size="small"
            sx={{
              backgroundColor: "#E82128",
              fontWeight: "bold",
              "&:hover": {
                backgroundColor: "#C00000",
              },
            }}
            startIcon={<PlayArrowIcon />}
            onClick={handlePlayTrailer}
          >
            Play Trailer
          </Button>

          {/* Info Button */}
          <IconButton
            color="primary"
            sx={{
              borderRadius: "50%",
              marginLeft: "10px",
              "&:hover": {
                backgroundColor: "darkred",
              },
            }}
            onClick={handleInfoClick}
          >
            <InfoIcon
              sx={{
                fontSize: "36px",
                color: "#E82128",
              }}
            />
          </IconButton>
        </div>
        <div className="fadebottom"></div>
      </div>
    </StyledContainer>
  );
}

const StyledContainer = styled(Container)`
  width: 100%;
  padding: 0;
  .banner {
    height: 600px;
    color: white;
    position: relative;
    object-fit: contain;
    overflow: hidden;
  }
  .rating-genres-container {
    display: flex;
    align-items: center;
    gap: 15px;
  }

  .genre-tags {
    display: inline-flex;
    flex-wrap: wrap;
    gap: 5px;
  }

  .genre-tag {
    background-color: #e82128;
    color: white;
    padding: 5px 10px;
    border-radius: 5px;
    font-size: 0.9rem;
  }
  .banner::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 30rem;
    background-image: linear-gradient(
      to right,
      rgba(0, 0, 0, 0.9),
      transparent
    );
  }
  .bcontents {
    margin-left: 60px;
    padding-top: 250px;
    position: relative;
    z-index: 1;
  }

  .btitle {
    font-size: 3rem;
    font-weight: 800;
    padding-bottom: 0.3rem;
  }
  .bdescription {
    width: 45rem;
    line-height: 1.3;
    padding-top: 0.4rem;
    padding-bottom: 0.5rem;
    font-size: 0.9rem;
    max-width: 360px;
  }
  .fadebottom {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 7rem;
    background-image: linear-gradient(
      180deg,
      transparent,
      rgba(0, 0, 0, 0) 0%,
      rgba(0, 0, 0, 1) 100%,
      #111 100%
    );
  }
`;

export default Banner;
