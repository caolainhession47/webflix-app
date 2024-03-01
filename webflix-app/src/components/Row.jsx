import React, { useState, useEffect } from "react";
import axios from "../axios/axios";
import styled from "styled-components";
import Rating from "./Rating";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function Row({ title, fetchUrl, isLargeRow }) {
  const [items, setItems] = useState([]);
  const [loadedImages, setLoadedImages] = useState([]);
  const navigate = useNavigate();
  const base_url = "https://image.tmdb.org/t/p/original/";

  useEffect(() => {
    async function fetchData() {
      const request = await axios.get(fetchUrl);
      setItems(request.data.results);
      return request;
    }
    fetchData();
  }, [fetchUrl]);

  const handleItemClick = (item) => {
    const mediaType = item.first_air_date ? "tv" : "movie";
    navigate(`/media/${mediaType}/${item.id}`);
  };

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
