import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Rating from "./Rating";
import { Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import requests from "../axios/requests";
import axios from "../axios/axios";

const MediaGrid = ({ selectedOption, mediaType, recommendationIDs }) => {
  const [mediaList, setMediaList] = useState([]);
  const [page, setPage] = useState(1);
  const base_url = "https://image.tmdb.org/t/p/original/";
  const navigate = useNavigate();

  useEffect(() => {
    if (recommendationIDs && recommendationIDs.length > 0) {
      const fetchRecommendedMedia = async () => {
        console.log("Fetching recommended media..."); // Debug: Check if this function runs
        const mediaDetailsPromises = recommendationIDs.map(async (id) => {
          const url = requests.fetchMediaDetails(mediaType, id);
          console.log(`Fetching details for ${mediaType} with ID: ${id}`); // Debug: Check the URL being called
          try {
            const response = await axios.get(url);
            console.log("Data for ID:", id, response.data); // Debug: Inspect the data for each ID
            return response.data;
          } catch (error) {
            console.error(
              `Error fetching details for ${mediaType} with ID: ${id}:`,
              error
            ); // Debug: Check for errors in each call
            return null; // Return null or some error indicator for this specific call
          }
        });

        try {
          const mediaDetails = await Promise.all(mediaDetailsPromises);
          console.log("All media details fetched:", mediaDetails); // Debug: Check the array of all fetched media details
          setMediaList(mediaDetails.filter((detail) => detail !== null)); // Filter out any nulls from failed requests
        } catch (error) {
          console.error("Error fetching recommended media:", error); // Debug: Check for errors in Promise.all
        }
      };

      fetchRecommendedMedia();
    }
  }, [recommendationIDs, mediaType]);

  useEffect(() => {
    setMediaList([]);
    setPage(1);
  }, [selectedOption, mediaType]);

  useEffect(() => {
    const fetchMedia = async () => {
      let endpoint = "";

      if (mediaType === "movie") {
        switch (selectedOption) {
          case "trending":
            endpoint = `${requests.fetchTrendingMovies}&page=${page}`;
            break;
          case "popular":
            endpoint = `${requests.fetchPopularMovies}&page=${page}`;
            break;
          case "top_rated":
            endpoint = `${requests.fetchTopRated}&page=${page}`;
            break;
          case "now_playing":
            endpoint = `${requests.fetchNowPlaying}&page=${page}`;
            break;
          default:
            endpoint = `${requests.fetchMoviesByGenre(
              selectedOption
            )}&page=${page}`;
        }
      } else if (mediaType === "tv") {
        switch (selectedOption) {
          case "trending":
            endpoint = `${requests.fetchTrendingTVShows}&page=${page}`;
            break;
          case "popular":
            endpoint = `${requests.fetchPopularTV}&page=${page}`;
            break;
          case "top_rated":
            endpoint = `${requests.fetchTopRatedTV}&page=${page}`;
            break;
          default:
            endpoint = `${requests.fetchTVShowsByGenre(
              selectedOption
            )}&page=${page}`;
        }
      }

      const response = await axios.get(
        `https://api.themoviedb.org/3${endpoint}`
      );
      const newMedia = response.data.results;

      setMediaList((prevMediaList) => {
        const updatedMediaList = [...prevMediaList, ...newMedia];
        const uniqueMediaList = Array.from(
          new Set(updatedMediaList.map((item) => item.id))
        ).map((id) => updatedMediaList.find((item) => item.id === id));
        return uniqueMediaList;
      });
    };

    fetchMedia();
  }, [selectedOption, mediaType, page]);

  const loadMoreItems = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const handleItemClick = (media) => {
    const mediaDetailType = media.first_air_date ? "tv" : "movie";
    navigate(`/media/${mediaDetailType}/${media.id}`);
  };

  return (
    <StyledContainer>
      <div className="media-grid">
        {mediaList.map((media, index) => (
          <div
            key={`${media.id}-${index}`}
            onClick={() => handleItemClick(media)}
            className="media-item"
          >
            <img
              src={`${base_url}${media.poster_path}`}
              alt={media.title || media.name}
              className="media-poster"
            />
            <div className="media-info">
              <div className="title">{media.title || media.name}</div>
              <div className="year">
                {media.release_date?.substring(0, 4) ||
                  media.first_air_date?.substring(0, 4)}
              </div>
            </div>
            <div className="rating-container">
              <Rating value={media.vote_average} />
            </div>
          </div>
        ))}
      </div>
      {!recommendationIDs && (
        <Button
          variant="danger"
          onClick={loadMoreItems}
          style={{
            marginTop: "20px",
            display: "block",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          Load More
        </Button>
      )}
    </StyledContainer>
  );
};

const StyledContainer = styled(Container)`
  color: white;
  .media-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 15px;
  }

  .media-item {
    cursor: pointer;
    position: relative;
    display: flex;
    justify-content: center;
    overflow: hidden;

    &:hover .media-info {
      opacity: 1;
      visibility: visible;
    }
  }

  .media-poster {
    width: 100%;
    height: auto;
    border-radius: 4px;
    transition: transform 0.2s;
    &:hover {
      transform: scale(1.05);
    }
  }

  .rating-container {
    position: absolute;
    bottom: 5px;
    left: 5px;
    background-color: rgba(0, 0, 0, 0.35);
    border-radius: 50%;
    align-items: center;
    justify-content: center;
    width: 50px;
    height: 50px;
  }

  .media-info {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 1);
    color: white;
    padding: 10px;
    text-align: center;
    transition: opacity 0.3s ease-in-out;
    opacity: 0;
    visibility: hidden;
    z-index: 56;
  }

  .title {
    font-size: 1rem;
    font-weight: bold;
  }

  .year {
    text-align: center;
    font-size: 0.9rem;
  }
`;

export default MediaGrid;
