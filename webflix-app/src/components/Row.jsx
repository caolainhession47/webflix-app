import React, { useState, useEffect } from "react";
import axios from "../axios/axios";
import styled from "styled-components";
import Rating from "./Rating";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function Row({ title, fetchUrl, isLargeRow }) {
  const [items, setItems] = useState([]); // State to hold the list of media items fetched from the API
  const [loadedImages, setLoadedImages] = useState([]); // State to track which images have been loaded
  const navigate = useNavigate();
  const base_url = "https://image.tmdb.org/t/p/original/"; // Base URL for media images

  // Fetches media items from the API when the component mounts or when fetchUrl changes
  useEffect(() => {
    async function fetchData() {
      const request = await axios.get(fetchUrl);
      setItems(request.data.results); // Sets the fetched media items in state
      return request;
    }
    fetchData();
  }, [fetchUrl]);

  // Handles click on a media item, navigating to its detail page
  const handleItemClick = (item) => {
    const mediaType = item.first_air_date ? "tv" : "movie"; // Determines if the item is a movie or TV show based on the presence of 'first_air_date'
    navigate(`/media/${mediaType}/${item.id}`);
  };

  // Handles image load event, adding the media item's ID to the loadedImages state
  const handleImageLoad = (id) => {
    setLoadedImages((prevLoadedImages) => [...prevLoadedImages, id]);
  };

  return (
    <StyledContainer>
      <h2>{title}</h2>
      <div className="row_posters">
        {items.map((item) => {
          const hasImageLoaded = loadedImages.includes(item.id);
          return (
            ((isLargeRow && item.poster_path) ||
              (!isLargeRow && item.backdrop_path)) && (
              <div
                className="row_poster_container"
                key={item.id}
                onClick={() => handleItemClick(item)}
              >
                <div className="image-container">
                  <OverlayTrigger
                    placement="bottom"
                    overlay={
                      <StyledTooltip id={`tooltip-${item.id}`}>
                        {item.title || item.name}
                      </StyledTooltip>
                    }
                  >
                    <img
                      className={`row_poster ${
                        isLargeRow ? "row_posterLarge" : ""
                      }`}
                      src={`${base_url}${
                        isLargeRow ? item.poster_path : item.backdrop_path
                      }`}
                      alt={item.title || item.name}
                      onLoad={() => handleImageLoad(item.id)}
                    />
                  </OverlayTrigger>
                  {hasImageLoaded && (
                    <div className="rating-container">
                      <Rating value={item.vote_average} />
                    </div>
                  )}
                </div>
              </div>
            )
          );
        })}
      </div>
    </StyledContainer>
  );
}

const StyledTooltip = styled(Tooltip)`
  font-size: 16px;
  padding: 12px;
  font-weight: 500;
`;

const StyledContainer = styled.div`
  color: white;
  margin-left: 20px;
  .row_posters {
    display: flex;
    overflow-y: hidden;
    overflow-x: scroll;
    padding: 5px 20px 25px 20px;
    &::-webkit-scrollbar {
      display: none;
    }
  }
  .row_poster_container {
    position: relative;
    margin-right: 12px;
  }
  .image-container {
    position: relative;
  }
  .row_poster {
    max-height: 150px;
    object-fit: contain;
    transition: transform 300ms;
    cursor: pointer;
    &:hover {
      transform: scale(1.08);
    }
  }
  .row_posterLarge {
    max-height: 375px;
  }
  .rating-container {
    position: absolute;
    bottom: 5px;
    left: 5px;
    background-color: rgba(0, 0, 0, 0.35);
    border-radius: 50%;
    justify-content: center;
    align-items: center;
    width: 50px;
    height: 50px;
  }
`;

export default Row;
