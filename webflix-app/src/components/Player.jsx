import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../axios/axios";
import requests from "../axios/requests";
import FullPageLoader from "./FullPageLoader";

function Player() {
  const { mediaType, mediaId } = useParams(); // Extracting media type and ID from URL parameters
  const [trailerUrl, setTrailerUrl] = useState(""); // State to store the fetched trailer URL
  const iframeRef = useRef(null); // Ref for the iframe element to dynamically set its height
  const navigate = useNavigate();

  // Fetches the trailer URL for the specified media
  useEffect(() => {
    let isCancelled = false; // Flag to prevent state update on an unmounted component

    async function fetchTrailer() {
      try {
        // Construct the correct URL based on mediaType
        const urlEndpoint =
          mediaType === "movie"
            ? requests.fetchMovieVideos(mediaId)
            : requests.fetchTvShowVideos(mediaId);

        const response = await axios.get(
          `https://api.themoviedb.org/3${urlEndpoint}`
        );
        console.log(response.data);
        // Finding the first "Trailer" type video in the response
        const trailerKey = response.data.results.find(
          (video) => video.type === "Trailer"
        )?.key;

        if (trailerKey) {
          // If a trailer is found, constructs the YouTube embed URL and sets it in state
          setTrailerUrl(
            `https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=0`
          );
        } else {
          // If no trailer is found, navigates back to the media detail page
          if (!isCancelled) {
            alert("No trailer found for this show!");
            navigate(`/media/${mediaType}/${mediaId}`);
          }
        }
      } catch (error) {
        console.error("Error fetching trailer", error);
        alert("Error fetching trailer", error);
        navigate(`/media/${mediaType}/${mediaId}`);
      }
    }

    if (mediaId) {
      fetchTrailer();
    }
    //setting flag so alert will not be displayed twice
    return () => {
      isCancelled = true;
    };
  }, [mediaType, mediaId, navigate]);

  // Adjusts the iframe height based on its width to maintain a 16:9 aspect ratio
  useEffect(() => {
    if (iframeRef.current && trailerUrl) {
      const height = (iframeRef.current.offsetWidth * 9) / 16 + "px";
      iframeRef.current.setAttribute("height", height);
    }
  }, [trailerUrl]);

  // Displays a loader if the trailer URL hasn't been set yet
  if (!trailerUrl) {
    return <FullPageLoader />;
  }

  return (
    <Container>
      <div className="player">
        <iframe
          src={trailerUrl}
          ref={iframeRef}
          width="100%"
          title={`${mediaType} Trailer`}
          frameBorder="0"
          allow="autoplay; encrypted-media"
          allowFullScreen
        ></iframe>
      </div>
    </Container>
  );
}

const Container = styled.div`
  .player {
    position: relative;
    padding-top: 56.25%; /* 16:9 Aspect Ratio */
    height: 0;
    overflow: hidden;
    iframe,
    object,
    embed {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  }
`;

export default Player;
