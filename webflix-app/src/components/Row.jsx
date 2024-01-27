import React, { useState, useEffect } from "react";
import axios from "../axios/axios";
import styled from "styled-components";

export default function Row({ title, fetchUrl, isLargeRow }) {
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
        {movies.map(
          (movie) =>
            ((isLargeRow && movie.poster_path) ||
              (!isLargeRow && movie.backdrop_path)) && (
              <img
                className={`row_poster ${isLargeRow && "row_posterLarge"}`}
                key={movie.id}
                src={`${base_url}${
                  isLargeRow ? movie.poster_path : movie.backdrop_path
                }`}
                alt={movie.name}
              />
            )
        )}
      </div>
    </StyledContainer>
  );
}

const StyledContainer = styled.div`
  color: white;
  margin-left: 20px;
  position: relative;
  z-index: 5;
  .row_posters {
    display: flex;
    overflow-y: hidden;
    overflow-x: scroll;
    padding: 20px;
    &::-webkit-scrollbar {
      display: none;
    }
  }
  .row_poster {
    max-height: 100px;
    object-fit: contain;
    margin-right: 10px;
    transition: transform 450ms;
    &:hover {
      transform: scale(1.08);
    }
  }
  .row_posterLarge {
    max-height: 250px;
  }
`;
