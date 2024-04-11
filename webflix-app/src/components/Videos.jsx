import React, { useState, useEffect } from "react";
import Carousel from "react-material-ui-carousel";
import { Paper } from "@mui/material";
import axios from "../axios/axios";
import requests from "../axios/requests";
import styled from "styled-components";
import Container from "react-bootstrap/Container";

const Videos = ({ mediaId, mediaType }) => {
  const [videos, setVideos] = useState([]); // State to hold the list of videos

  useEffect(() => {
    // Function to fetch videos from the API
    const fetchVideos = async () => {
      try {
        // Determines the appropriate URL based on media type
        const fetchUrl =
          mediaType === "movie"
            ? requests.fetchMovieVideos(mediaId)
            : requests.fetchTvShowVideos(mediaId);
        const response = await axios.get(fetchUrl);
        setVideos(response.data.results);
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };

    fetchVideos();
  }, [mediaId, mediaType]);

  // If there are no videos, the component renders nothing
  if (videos.length === 0) return null;

  return (
    <StyledContainer>
      <h2 className="videos-title">Videos</h2>
      <Carousel
        autoPlay={false}
        animation="slide"
        navButtonsAlwaysVisible={true}
        navButtonsProps={{
          style: {
            backgroundColor: "#bd0f0ff1",
            color: "#fff",
          },
          className: "carousel-nav-buttons",
        }}
        navButtonsWrapperProps={{
          style: {
            bottom: "0",
            top: "unset",
          },
        }}
      >
        {videos.map((video) => (
          <Paper key={video.id} elevation={0} className="video-container">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${video.key}`}
              title={video.name}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </Paper>
        ))}
      </Carousel>
    </StyledContainer>
  );
};

const StyledContainer = styled(Container)`
  margin-top: 0px;
  .videos-title {
    color: white;
    margin-bottom: 12px;
    text-align: flex-start;
    position: relative;
    font-size: 2rem;
  }

  .videos-title::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: -5px;
    margin-bottom: auto.5rem;
    width: 7rem;
    height: 5px;
    background-color: #e82128;
  }

  .video-container {
    position: relative;
    overflow: hidden;
    height: 600px;
    padding: 0px;
    overflow: hidden;
    padding-top: 56.3%;
    iframe {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
`;

export default Videos;
