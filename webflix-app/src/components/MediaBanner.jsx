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
import { firebaseAuth } from "../utils/firebase-config";
import serverAxios from "../axios/serverAxios";
import { toast } from "react-toastify";

function MediaBanner() {
  const { mediaType, mediaId } = useParams(); // Extracting media type and ID from URL parameters
  const [media, setMedia] = useState(null); // State for storing media details
  const [genres, setGenres] = useState([]); // State for storing media genres
  const navigate = useNavigate();
  const [releaseYear, setReleaseYear] = useState(""); // State for storing media release year
  const [currentUser, setCurrentUser] = useState(null); // State for storing current user

  // Auth state listener to set current user
  useEffect(() => {
    const unsubscribe = firebaseAuth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });

    return unsubscribe; // Unsubscribe from the listener when the component unmounts
  }, []);

  // Effect hook to fetch media details
  useEffect(() => {
    async function fetchMedia() {
      try {
        // Constructing the request URL based on media type
        const requestUrl =
          mediaType === "movie"
            ? requests.fetchMovieDetails(mediaId)
            : requests.fetchTvShowDetails(mediaId);

        // Fetching media details from the API
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

  // Handler for adding media to the watchlist
  const handleAddToWatchlist = async () => {
    if (!currentUser || !currentUser.email) {
      toast.warning("Please log in to add to your watchlist");
      return;
    }

    // Constructing the item to add to the watchlist
    const itemToAdd = {
      mediaId: media.id,
      mediaType: mediaType,
      title: media.title || media.name,
      posterPath: media.poster_path,
      releaseDate: media.release_date || media.first_air_date,
      rating: media.vote_average,
    };

    try {
      const response = await serverAxios.post("/api/users/watchlist/add", {
        email: currentUser.email,
        movie: itemToAdd,
      });

      // Handling response and displaying appropriate toast notifications
      if (response.data.msg === "Movie already in watchlist.") {
        toast.info("Movie already in watchlist!");
      } else {
        console.log(response.data);
        toast.success("Added to watchlist successfully!");
      }
    } catch (error) {
      // Handling errors and displaying error messages through toast notifications
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data.msg);
      } else {
        console.error("Error adding to watchlist:", error);
        toast.error("Failed to add to watchlist.");
      }
    }
  };

  // Similar handler for adding media to the favorites
  const handleAddToFavorites = async () => {
    if (!currentUser || !currentUser.email) {
      toast.warning("Please log in to add to your favorites");
      return;
    }

    const itemToAdd = {
      mediaId: media.id,
      mediaType: mediaType, // 'movie' or 'tv' based on the mediaType state
      title: media.title || media.name,
      posterPath: media.poster_path,
      releaseDate: media.release_date || media.first_air_date,
      rating: media.vote_average,
    };

    try {
      const response = await serverAxios.post("/api/users/favorites/add", {
        email: currentUser.email,
        movie: itemToAdd,
      });

      if (response.data.msg === "Movie already in favorites.") {
        toast.info("Movie already in favorites!");
      } else {
        console.log(response.data);
        toast.success("Added to favorites successfully!");
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data.msg);
      } else {
        console.error("Error adding to favorites:", error);
        toast.error("Failed to add to favorites.");
      }
    }
  };

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
              <div className="watchlist" onClick={handleAddToWatchlist}>
                <AddToQueueTwoToneIcon />
              </div>
            </Tooltip>
            <Tooltip title="Add to Favourites">
              <div className="favourites" onClick={handleAddToFavorites}>
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
      @media (min-width: 2400px) {
        padding-left: 39.5rem;
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
