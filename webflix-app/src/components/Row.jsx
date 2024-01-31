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

  return (
    <StyledContainer>
      <h2>{title}</h2>
      <div className="row_posters">
        {items.map(
          (item) =>
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
                      <Tooltip
                        id={`tooltip-${item.id}`}
                        style={{
                          fontSize: "16px",
                          padding: "12px",
                          fontWeight: 500,
                        }}
                      >
                        {item.title || item.name}
                      </Tooltip>
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
                    />
                  </OverlayTrigger>
                  <div className="rating-container">
                    <Rating value={item.vote_average} />
                  </div>
                </div>
              </div>
            )
        )}
      </div>
    </StyledContainer>
  );
}

const StyledContainer = styled.div`
  color: white;
  margin-left: 20px;
  .row_posters {
    display: flex;
    overflow-y: hidden;
    overflow-x: scroll;
    padding: 20px;
    &::-webkit-scrollbar {
      display: none;
    }
  }
  .row_poster_container {
    position: relative;
    margin-right: 10px;
  }
  .image-container {
    position: relative;
  }
  .row_poster {
    max-height: 100px;
    object-fit: contain;
    transition: transform 333ms;
    cursor: pointer;
    &:hover {
      transform: scale(1.08);
    }
  }
  .row_posterLarge {
    max-height: 250px;
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
