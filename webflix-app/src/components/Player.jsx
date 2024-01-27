import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import axios from "../axios/axios";
import requests from "../axios/requests";
import FullPageLoader from "./FullPageLoader";

function Player() {
  const { movieId } = useParams();
  const [trailerUrl, setTrailerUrl] = useState("");
  const iframeRef = useRef(null);

  useEffect(() => {
    async function fetchTrailer() {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3${requests.fetchMovieVideos(movieId)}`
        );
        const trailerKey = response.data.results.find(
          (video) => video.type === "Trailer"
        )?.key;
        if (trailerKey) {
          setTrailerUrl(
            `https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=0`
          );
        }
      } catch (error) {
        console.error("Error fetching trailer", error);
      }
    }

    if (movieId) {
      fetchTrailer();
    }
  }, [movieId]);

  useEffect(() => {
    if (iframeRef.current && trailerUrl) {
      const height = (iframeRef.current.offsetWidth * 9) / 16 + "px";
      iframeRef.current.setAttribute("height", height);
    }
  }, [trailerUrl]);

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
          title="Movie Trailer"
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
