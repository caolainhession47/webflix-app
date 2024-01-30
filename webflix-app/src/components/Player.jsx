import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../axios/axios";
import requests from "../axios/requests";
import FullPageLoader from "./FullPageLoader";

function Player() {
  const { mediaType, mediaId } = useParams();
  const [trailerUrl, setTrailerUrl] = useState("");
  const iframeRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    let isCancelled = false;

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
        const trailerKey = response.data.results.find(
          (video) => video.type === "Trailer"
        )?.key;

        if (trailerKey) {
          setTrailerUrl(
            `https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=0`
          );
        } else {
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
