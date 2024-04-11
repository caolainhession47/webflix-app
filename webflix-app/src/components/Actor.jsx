import React, { useState, useEffect } from "react";
import axios from "../axios/axios";
import requests from "../axios/requests";
import styled from "styled-components";
import Rating from "./Rating";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { useNavigate } from "react-router-dom";
import XIcon from "@mui/icons-material/X";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";

const Actor = ({ personId }) => {
  // State hooks for storing actor details, known-for movies, social links, and loaded images
  const [personDetails, setPersonDetails] = useState({});
  const [knownForMovies, setKnownForMovies] = useState([]);
  const [socials, setSocials] = useState({});
  const [loadedImages, setLoadedImages] = useState([]);
  const navigate = useNavigate();
  const base_url = "https://image.tmdb.org/t/p/original/";

  // Function to truncate long strings
  function truncate(string, n) {
    return string?.length > n ? string.substr(0, n) + "..." : string;
  }

  // Effect hook to fetch actor details, known-for movies, and social links
  useEffect(() => {
    const fetchDetails = async () => {
      const detailsResponse = await axios.get(
        requests.fetchPersonDetails(personId)
      );
      setPersonDetails(detailsResponse.data);

      const knownForResponse = await axios.get(
        requests.fetchPersonKnownFor(personId)
      );
      setKnownForMovies(knownForResponse.data.cast);

      const socialsResponse = await axios.get(
        requests.fetchPersonSocials(personId)
      );
      setSocials(socialsResponse.data);
    };

    fetchDetails();
  }, [personId]);

  // Handles navigation to movie/TV show detail page
  const handleItemClick = (item) => {
    const mediaType = item.first_air_date ? "tv" : "movie";
    navigate(`/media/${mediaType}/${item.id}`);
  };

  // Handles opening social media links
  const handleSocialClick = (url) => {
    if (url) window.open(url, "_blank");
  };

  // Updates state when an image is loaded
  const handleImageLoad = (id) => {
    setLoadedImages((prevLoadedImages) => [...prevLoadedImages, id]);
  };

  return (
    <StyledContainer>
      <div className="person-info">
        <img
          className="person-image"
          src={`${base_url}${personDetails.profile_path}`}
          alt={personDetails.name}
        />
        <div className="person-details">
          <div className="name-social">
            <div className="name">{personDetails.name}</div>
            <div className="social-icons">
              {socials.facebook_id && (
                <FacebookIcon
                  fontSize="large"
                  onClick={() =>
                    handleSocialClick(
                      `https://facebook.com/${socials.facebook_id}`
                    )
                  }
                />
              )}
              {socials.instagram_id && (
                <InstagramIcon
                  fontSize="large"
                  onClick={() =>
                    handleSocialClick(
                      `https://instagram.com/${socials.instagram_id}`
                    )
                  }
                />
              )}
              {socials.twitter_id && (
                <XIcon
                  fontSize="large"
                  onClick={() =>
                    handleSocialClick(`https://X.com/${socials.twitter_id}`)
                  }
                />
              )}
            </div>
          </div>
          <p></p>
          <p>
            <strong style={{ fontSize: "18px" }}>Date of Birth:</strong>{" "}
            {personDetails.birthday}
          </p>
          <p>
            <strong style={{ fontSize: "18px" }}>Biography:</strong>{" "}
            {truncate(personDetails.biography, 2299)}
          </p>
        </div>
      </div>
      <h2 className="known-for-title">Known For</h2>
      <div className="row_posters">
        {knownForMovies.map(
          (item) =>
            item.poster_path && (
              <div
                className="row_poster_container"
                key={item.id}
                onClick={() => handleItemClick(item)}
              >
                <OverlayTrigger
                  placement="bottom"
                  overlay={
                    <Tooltip id={`tooltip-${item.id}`}>
                      {item.title || item.name}
                    </Tooltip>
                  }
                >
                  <img
                    className="row_poster"
                    src={`${base_url}${item.poster_path}`}
                    alt={item.title || item.name}
                    onLoad={() => handleImageLoad(item.id)}
                  />
                </OverlayTrigger>
                {loadedImages.includes(item.id) && (
                  <div className="rating-container">
                    <Rating value={item.vote_average} />
                  </div>
                )}
              </div>
            )
        )}
      </div>
    </StyledContainer>
  );
};

const StyledContainer = styled.div`
  color: white;
  margin: 0 49px;

  .name {
    font-size: 3.5rem;
    font-weight: 700;
    display: inline-block;
  }

  .name-social {
    display: flex;
    align-items: center;
    width: 100%;
  }

  .social-icons {
    display: flex;
    gap: 15px;
    cursor: pointer;
    margin-left: 1rem;
  }

  .person-info {
    display: flex;
    margin-bottom: 20px;
    align-items: flex-end;
  }

  .person-image {
    width: 359px;
    height: 545px;
    border-radius: 10px;
    margin-top: 6rem;
    margin-bottom: 1rem;
  }

  .person-details {
    margin-left: 20px;
  }

  .known-for-title {
    font-size: 2rem;
    color: white;
    margin-bottom: 12px;
    padding-top: 0.5rem;
    margin-left: 0rem;
    text-align: left;
    position: relative;
  }

  .known-for-title::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: -5px;
    margin-bottom: auto.5rem;
    width: 10.5rem;
    height: 5px;
    background-color: #e82128;
  }

  .row_posters {
    display: flex;
    overflow-y: hidden;
    overflow-x: scroll;
    padding: 5px 20px 10px 20px;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  .row_poster_container {
    position: relative;
    margin-right: 12px;
    cursor: pointer;

    &:hover .row_poster {
      transform: scale(1.08);
      transition: transform 300ms;
    }
  }

  .row_poster {
    max-height: 375px;
    object-fit: contain;
    border-radius: 4px;
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

export default Actor;
