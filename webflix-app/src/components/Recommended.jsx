import React, { useState, useEffect } from "react";
import axios from "../axios/axios";
import requests from "../axios/requests";
import styled from "styled-components";
import Rating from "./Rating";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container } from "react-bootstrap";

const Recommended = ({ mediaType, mediaId }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loadedImages, setLoadedImages] = useState([]);
  const navigate = useNavigate();
  const base_url = "https://image.tmdb.org/t/p/original/";

  useEffect(() => {
    async function fetchRecommendations() {
      const fetchUrl = requests.fetchRecommendations(mediaType, mediaId);
      const response = await axios.get(fetchUrl);
      // Filter out items with a rating below 6 and that have no poster
      const filteredResults = response.data.results.filter(
        (item) => item.vote_average >= 6 && item.poster_path
      );
      setRecommendations(filteredResults);
    }

    fetchRecommendations();
  }, [mediaType, mediaId]);

  const handleItemClick = (item) => {
    const mediaTypeItem = item.first_air_date ? "tv" : "movie";
    navigate(`/media/${mediaTypeItem}/${item.id}`);
    window.location.reload();
  };

  const handleImageLoad = (id) => {
    setLoadedImages((prev) => [...prev, id]);
  };

  return (
    <StyledContainer>
      <h2 className="title">You May Also Like</h2>
      <div className="row_posters">
        {recommendations.map((item) => (
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
                  className="row_poster row_posterLarge"
                  src={`${base_url}${item.poster_path}`}
                  alt={item.title || item.name}
                  onLoad={() => handleImageLoad(item.id)}
                />
              </OverlayTrigger>
              {loadedImages.includes(item.id) && ( // Display the rating only if the image is fully loaded
                <div className="rating-container">
                  <Rating value={item.vote_average} />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </StyledContainer>
  );
};

const StyledContainer = styled(Container)`
  margin-top: 3rem;
  .title {
    color: white;
    margin-bottom: 17px;
    text-align: flex-start;
    position: relative;
    font-size: 2rem;
  }
  .title::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: -10px;
    margin-bottom: auto.5rem;
    width: 17.5rem;
    height: 5px;
    background-color: #e82128;
  }
  .row_posters {
    display: flex;
    overflow-y: hidden;
    overflow-x: scroll;
    padding: 5px 20px 7px;
    margin-left: -20px;
    &::-webkit-scrollbar {
      display: none;
    }
  }
  .row_poster_container {
    position: relative;
    margin-right: 12px;
    cursor: pointer;
    transition: transform 333ms;
    &:hover {
      transform: scale(1.05);
    }
  }
  .image-container {
    position: relative;
  }
  .row_poster {
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
    color: white;
  }
`;

export default Recommended;
