import React from "react";
import styled from "styled-components";
import Rating from "./Rating";
import { useNavigate } from "react-router-dom";

const SearchMediaGrid = ({ searchResults }) => {
  const base_url = "https://image.tmdb.org/t/p/original/";
  const navigate = useNavigate();

  const handleItemClick = (media) => {
    if (media.known_for_department) {
      // If it has known_for_department, it's a person
      navigate(`/person/${media.id}`);
    } else {
      // Otherwise, determine if it's a movie or a TV show
      const mediaDetailType = media.first_air_date ? "tv" : "movie";
      navigate(`/media/${mediaDetailType}/${media.id}`);
    }
  };

  return (
    <StyledContainer>
      <div className="media-grid">
        {searchResults.map((media, index) => {
          const imagePath = media.profile_path || media.poster_path;
          const isPerson = !!media.known_for_department;

          // Only render items with valid image paths
          if (imagePath) {
            return (
              <div
                key={`${media.id}-${index}`}
                onClick={() => handleItemClick(media)}
                className="media-item"
              >
                <img
                  src={`${base_url}${imagePath}`}
                  alt={media.name || media.title || media.original_name}
                  className="media-poster"
                />
                <div className={`media-info ${isPerson ? "always-show" : ""}`}>
                  <div className="title">
                    {media.title || media.name || media.original_name}
                  </div>
                  {!isPerson && (
                    <div className="year">
                      {media.release_date?.substring(0, 4) ||
                        media.first_air_date?.substring(0, 4)}
                    </div>
                  )}
                </div>
                {typeof media.vote_average === "number" && !isPerson && (
                  <div className="rating-container">
                    <Rating value={media.vote_average} />
                  </div>
                )}
              </div>
            );
          }
          return null; // Skip rendering if there's no valid image path
        })}
      </div>
    </StyledContainer>
  );
};

const StyledContainer = styled.div`
  color: white;
  margin-top: 1rem;
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

  .media-info.always-show,
  .media-item:hover .media-info {
    opacity: 1;
    visibility: visible;
  }

  .title {
    font-size: 1rem;
    font-weight: bold;
  }

  .year {
    font-size: 0.9rem;
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
`;

export default SearchMediaGrid;
