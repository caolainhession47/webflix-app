import React from "react";
import styled from "styled-components";
import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import serverAxios from "../axios/serverAxios";
import HighlightOffTwoToneIcon from "@mui/icons-material/HighlightOffTwoTone";
import Rating from "./Rating";
import { firebaseAuth } from "../utils/firebase-config";

const ListGrid = ({ mediaList, fetchList, removalEndpoint }) => {
  // Add removalEndpoint prop
  const navigate = useNavigate();
  const base_url = "https://image.tmdb.org/t/p/original/";

  const handleItemClick = (media) => {
    navigate(`/media/${media.mediaType}/${media.mediaId}`);
  };

  const handleRemoveClick = async (mediaId, event) => {
    event.stopPropagation(); // Prevent click from navigating

    const user = firebaseAuth.currentUser;
    if (user && user.email) {
      try {
        await serverAxios.put(removalEndpoint, {
          // Use dynamic removalEndpoint
          email: user.email,
          mediaId: mediaId,
        });
        console.log("Media removed successfully");
        fetchList(); // Call fetchList to refresh the list
      } catch (error) {
        console.error("Error removing media:", error);
      }
    } else {
      console.error("User is not authenticated");
    }
  };

  return (
    <StyledContainer>
      <div className="media-grid">
        {mediaList.map((media, index) => (
          <div key={`${media.mediaId}-${index}`} className="media-item">
            <img
              src={`${base_url}${media.posterPath}`}
              alt={media.title}
              className="media-poster"
              onClick={() => handleItemClick(media)}
            />
            <HighlightOffTwoToneIcon
              className="remove-icon"
              onClick={(event) => handleRemoveClick(media.mediaId, event)}
            />
            <div className="media-info">
              <div className="title">{media.title}</div>
              <div className="year">
                {(media.releaseDate && media.releaseDate.substring(0, 4)) ||
                  "Unknown"}
              </div>
            </div>
            <div className="rating-container">
              {typeof media.rating === "number" && (
                <Rating value={media.rating} />
              )}
            </div>
          </div>
        ))}
      </div>
    </StyledContainer>
  );
};

const StyledContainer = styled(Container)`
  color: white;
  min-height: 100vh;
  padding-top: 7.5rem;
  .media-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 15px;
  }

  .media-item {
    cursor: pointer;
    position: relative;
    display: flex;
    justify-content: center;
    overflow: hidden;

    &:hover .media-info {
      opacity: 1;
      visibility: visible;
    }

    &:hover .remove-icon {
      opacity: 1;
    }
  }

  .remove-icon {
    cursor: pointer;
    position: absolute;
    font-size: 3rem;
    top: 8px;
    right: 8px;
    color: #d60808;
    opacity: 0; // Hide the icon by default
    transition: opacity 0.3s ease-in-out;
    z-index: 2;
  }

  .media-poster {
    width: 100%;
    height: auto;
    border-radius: 4px;
    transition: transform 0.2s;
    &:hover {
      transform: scale(1.05);
    }
  }

  .rating-container {
    position: absolute;
    bottom: 5px;
    left: 5px;
    background-color: rgba(0, 0, 0, 0.35);
    border-radius: 50%;
    align-items: center;
    justify-content: center;
    width: 50px;
    height: 50px;
  }

  .media-info {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 1);
    color: white;
    padding: 10px;
    text-align: center;
    transition: opacity 0.3s ease-in-out;
    opacity: 0;
    visibility: hidden;
    z-index: 56;
  }

  .title {
    font-size: 1rem;
    font-weight: bold;
  }

  .year {
    text-align: center;
    font-size: 0.9rem;
  }
`;

export default ListGrid;
