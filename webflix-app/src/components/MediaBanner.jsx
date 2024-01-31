import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Container from "react-bootstrap/Container";
import axios from "../axios/axios";
import requests from "../axios/requests";
import Rating from "./Rating";
import { useParams, useNavigate } from "react-router-dom";
import FullPageLoader from "./FullPageLoader";
import AddToQueueTwoToneIcon from "@mui/icons-material/AddToQueueTwoTone";
import FavoriteTwoToneIcon from "@mui/icons-material/FavoriteTwoTone";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import Cast from "./Cast";

function MediaBanner() {
  const { mediaType, mediaId } = useParams();
  const [media, setMedia] = useState(null);
  const [genres, setGenres] = useState([]);
  const navigate = useNavigate();
  const [releaseYear, setReleaseYear] = useState("");

  useEffect(() => {
    async function fetchMedia() {
      try {
        const requestUrl =
          mediaType === "movie"
            ? requests.fetchMovieDetails(mediaId)
            : requests.fetchTvShowDetails(mediaId);

        const response = await axios.get(
          `https://api.themoviedb.org/3${requestUrl}`
        );
        setMedia(response.data);
        // Determine the field for release date based on media type
        let dateField =
          mediaType === "movie" ? "release_date" : "first_air_date";

        // Fallback if one of them doesn't exist
        let releaseDate =
          response.data[dateField] ||
          response.data["release_date"] ||
          response.data["first_air_date"];

        // Extract the year from the date
        const year = releaseDate ? releaseDate.split("-")[0] : undefined;
        setReleaseYear(year);
        if (response.data.genres) {
          setGenres(response.data.genres.map((genre) => genre.name));
        }
      } catch (error) {
        console.error("Error fetching media details:", error);
      }
    }

    fetchMedia();
  }, [mediaType, mediaId]);

  const handlePlayTrailer = () => {
    navigate(`/player/${mediaType}/${mediaId}`);
  };

  if (!media) {
    return <FullPageLoader />;
  }

  const backdropUrl = `https://image.tmdb.org/t/p/original/${media.backdrop_path}`;
  const posterUrl = `https://image.tmdb.org/t/p/w500/${media.poster_path}`;

  return (
    <StyledContainer fluid>
      <div
        className="media-banner"
        style={{
          backgroundSize: "cover",
          backgroundImage: `url('${backdropUrl}')`,
          backgroundPosition: "center center",
        }}
      >
        <div className="poster-container">
          <img src={posterUrl} alt={media.title || media.name} />
        </div>
        <div className="banner-contents">
          <h1 className="banner-title">{media.title || media.name}</h1>
          {releaseYear && <span className="release-year">({releaseYear})</span>}
          <div className="rating-genres-container">
            <div className="rating-container">
              <Rating value={media.vote_average} />
            </div>
            <div className="genre-tags">
              {genres.map((genre, index) => (
                <span key={index} className="genre-tag">
                  {genre}
                </span>
              ))}
            </div>
          </div>
          <p className="banner-description">{media.overview}</p>
          <div className="action-buttons">
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
                marginLeft: "1.5rem",
              }}
              startIcon={<PlayArrowIcon />}
              onClick={handlePlayTrailer}
            >
              Play Trailer
            </Button>
            <Tooltip title="Add to Watchlist">
              <div className="watchlist">
                <AddToQueueTwoToneIcon />
              </div>
            </Tooltip>
            <Tooltip title="Add to Favourites">
              <div className="favourites">
                <FavoriteTwoToneIcon />
              </div>
            </Tooltip>
          </div>
          <Cast mediaId={mediaId} mediaType={mediaType} />
        </div>
        <div className="fadebottom"></div>
      </div>
    </StyledContainer>
  );
}
const StyledContainer = styled(Container)`
  width: 100%;
  padding: 0;

  .action-buttons {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 5px;
    flex-direction: row-reverse;
  }
  .favourites,
  .watchlist {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin: 0 7px;
    cursor: pointer;
    color: #e82128da;

    svg {
      font-size: 2.2rem;
    }

    &:hover {
      svg {
        fill: #ff0000;
      }
    }
  }
  .media-banner {
    height: 950px;
    color: white;
    position: relative;
    display: flex;
    align-items: center;
    object-fit: contain;
    overflow: hidden;

    .poster-container {
      flex-shrink: 0;
      position: relative;
      padding-left: 13rem;
      margin-top: 13rem;
      z-index: 2;
      img {
        height: 600px;
        border-radius: 10px;
      }
    }

    .banner-contents {
      margin-left: 25px;
      padding-top: 300px;
      position: relative;
      z-index: 2;

      .rating-container {
        background-color: rgba(0, 0, 0, 0.35);
        border-radius: 50%;
        justify-content: center;
        align-items: center;
        width: 50px;
        height: 50px;
      }

      .banner-title {
        font-size: 3rem;
        font-weight: 800;
        padding-bottom: 0.3rem;
        display: inline-block;
      }

      .release-year {
        position: relative;
        font-size: 1.5rem;
        display: inline-block;
        bottom: 5px;
        margin-left: 1rem;
        padding-bottom: 0.3rem;
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

      .banner-description {
        width: 45rem;
        line-height: 1.3;
        padding-top: 0.4rem;
        padding-bottom: 0rem;
        font-size: 0.9rem;
        max-width: 700px;
        text-overflow: ellipsis;
      }
    }

    .fadebottom {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 50rem;
      background-image: linear-gradient(
        180deg,
        transparent,
        rgba(0, 0, 0, 0) 0%,
        rgba(0, 0, 0, 1) 100%,
        #111 100%
      );
      z-index: 1;
    }
  }
`;

export default MediaBanner;
