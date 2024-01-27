import React, { useState, useEffect } from "react";
import axios from "../axios/axios";
import styled from "styled-components";
import Rating from "./Rating";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import "bootstrap/dist/css/bootstrap.min.css";

function Row({ title, fetchUrl, isLargeRow }) {
  const [movies, setMovies] = useState([]);
  const base_url = "https://image.tmdb.org/t/p/original/";

  useEffect(() => {
    async function fetchData() {
      const request = await axios.get(fetchUrl);
      setMovies(request.data.results);
      return request;
    }

    fetchData();
  }, [fetchUrl]);

  return (
    <StyledContainer>
      <h2>{title}</h2>
      <div className="row_posters">
        {movies.map((movie) =>
          (isLargeRow && movie.poster_path) ||
          (!isLargeRow && movie.backdrop_path) ? (
            <div className="row_poster_container" key={movie.id}>
              <div className="image-container">
                <OverlayTrigger
                  placement="bottom"
                  overlay={
                    <Tooltip
                      style={{
                        fontSize: "16px",
                        padding: "12px",
                        fontWeight: 500,
                      }}
                    >
                      {movie.name || movie.title}
                    </Tooltip>
                  }
                >
                  <img
                    className={`row_poster ${isLargeRow && "row_posterLarge"}`}
                    src={`${base_url}${
                      isLargeRow ? movie.poster_path : movie.backdrop_path
                    }`}
                    alt={movie.name || movie.title}
                  />
                </OverlayTrigger>
                <div className="r">
                  <Rating
                    value={movie.vote_average}
                    style={{
                      position: "absolute",
                      bottom: "5px",
                      left: "5px",
                    }}
                  />
                </div>
              </div>
            </div>
          ) : null
        )}
      </div>
    </StyledContainer>
  );
}

const StyledContainer = styled.div`
  color: white;
  margin-left: 20px;
  .row_posters {
    display: flex;
    overflow-y: hidden;
    overflow-x: scroll;
    padding: 20px;
    &::-webkit-scrollbar {
      display: none;
    }
  }
  .row_poster_container {
    position: relative;
    margin-right: 10px;
  }
  .image-container {
    position: relative;
  }
  .row_poster {
    max-height: 100px;
    object-fit: contain;
    transition: transform 450ms;
    &:hover {
      transform: scale(1.08);
    }
  }
  .row_posterLarge {
    max-height: 250px;
  }
  .r {
    position: absolute;
    bottom: 5px;
    left: 5px;
  }
`;

export default Row;
