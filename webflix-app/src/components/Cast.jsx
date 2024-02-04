import React, { useState, useEffect } from "react";
import Carousel from "react-material-ui-carousel";
import { Paper, Grid } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import axios from "../axios/axios";
import requests from "../axios/requests";
import styled from "styled-components";
import Container from "react-bootstrap/Container";
import { useNavigate } from "react-router-dom";

const CastCarousel = ({ mediaId, mediaType }) => {
  const [casts, setCasts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCast = async () => {
      try {
        const response = await axios.get(
          requests.fetchCast(mediaType, mediaId)
        );
        const filteredCasts = response.data.cast.filter(
          (cast) => cast.profile_path != null
        );
        setCasts(filteredCasts);
      } catch (error) {
        console.error("Error fetching cast:", error);
      }
    };

    fetchCast();
  }, [mediaId, mediaType]);

  const castGroups = [];
  for (let i = 0; i < casts.length; i += 5) {
    castGroups.push(casts.slice(i, i + 5));
  }

  const handleCastClick = (castId) => {
    navigate(`/person/${castId}`); // Navigate to the person page with the cast member's ID
  };

  return (
    <StyledCarousel>
      <h2 className="cast-title">Cast</h2>
      <Carousel
        NextIcon={<ArrowForwardIosIcon />}
        PrevIcon={<ArrowBackIosIcon />}
        navButtonsAlwaysVisible={true}
        navButtonsProps={{
          style: {
            backgroundColor: "transparent",
            color: "red",
          },
        }}
        fullHeightHover={false}
      >
        {castGroups.map((group, index) => (
          <Paper key={index} elevation={3} className="carousel-paper">
            <Grid container spacing={2}>
              {group.map((cast, index) => (
                <Grid item xs={2} key={index}>
                  <div
                    className="image-container"
                    onClick={() => handleCastClick(cast.id)}
                  >
                    <img
                      src={`https://image.tmdb.org/t/p/w500${cast.profile_path}`}
                      alt={cast.name}
                      className="cast-image"
                    />
                    <p className="cast-name">{cast.name}</p>
                  </div>
                </Grid>
              ))}
            </Grid>
          </Paper>
        ))}
      </Carousel>
    </StyledCarousel>
  );
};

const StyledCarousel = styled(Container)`
  position: relative;
  width: 52rem;
  left: -20px;
  .cast-title {
    font-size: 2rem;
    color: white;
    margin-bottom: 12px;
    padding-top: 0.5rem;
    margin-left: 2rem;
    text-align: left;
    position: relative;
  }

  .cast-title::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: -5px;
    margin-bottom: auto.5rem;
    width: 5rem;
    height: 5px;
    background-color: #e82128;
  }
  .carousel-paper {
    background-color: transparent;
    box-shadow: none;
  }

  .image-container {
    text-align: center;
    padding-left: 55px;
  }

  .cast-image {
    width: 8.6rem;
    height: 12rem;
    object-fit: cover;
    border-radius: 6px;
    padding: 0 0.2rem;
    transition: transform 0.3s ease-in-out;
    cursor: pointer;

    &:hover {
      transform: scale(1.03);
    }
  }

  .cast-name {
    margin-top: 8px;
    font-size: 0.8em;
    color: white;
    padding-left: 45px;
    margin-bottom: -25px;
  }
`;

export default CastCarousel;
