import React, { useState, useEffect } from "react";
import Carousel from "react-material-ui-carousel";
import { Paper } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import axios from "../axios/axios";
import requests from "../axios/requests";
import styled from "styled-components";
import Container from "react-bootstrap/Container";

const Images = ({ mediaId, mediaType }) => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const fetchUrl =
          mediaType === "movie"
            ? requests.fetchMovieBackdrops(mediaId)
            : requests.fetchTvShowBackdrops(mediaId);

        const response = await axios.get(
          `https://api.themoviedb.org/3${fetchUrl}`
        );
        setImages(response.data.backdrops);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchImages();
  }, [mediaId, mediaType]);

  if (images.length === 0) return null;

  return (
    <StyledContainer>
      <h2 className="images-title">Images</h2>
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
        {images.map((image, index) => (
          <Paper key={index} elevation={0} className="image-container">
            <img
              src={`https://image.tmdb.org/t/p/original${image.file_path}`}
              alt={`Backdrop ${index + 1}`}
              className="backdrop-image"
            />
          </Paper>
        ))}
      </Carousel>
    </StyledContainer>
  );
};

const StyledContainer = styled(Container)`
  margin-top: 3rem;
  .images-title {
    color: white;
    margin-bottom: 17px;
    text-align: flex-start;
    position: relative;
    font-size: 2rem;
  }

  .images-title::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: -10px;
    margin-bottom: auto.5rem;
    width: 7.5rem;
    height: 5px;
    background-color: #e82128;
  }

  .image-container {
    position: relative;
    overflow: hidden;
    height: 600px;
    img {
      width: 100%;
      height: auto;
      object-fit: cover;
      object-position: center;
    }
  }
`;

export default Images;
