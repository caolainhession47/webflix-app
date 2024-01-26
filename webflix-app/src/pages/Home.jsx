import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Banner from "../components/Banner";
import requests from "../axios/requests";
import Row from "../components/Row";

export default function Netflix() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div>
      <Navbar isScrolled={isScrolled} />
      <Banner />
      {/* <Row
        title="POPULAR MOVIES"
        fetchUrl={requests.fetchPopularMovies}
        isLargeRow
      />
      <Row title="TOP RATED MOVIES" fetchUrl={requests.fetchTopRated} />
      <Row title="POPULAR SERIES" fetchUrl={requests.fetchPopularTV} />
      <Row title="TOP RATED SERIES" fetchUrl={requests.fetchTopRatedTV} /> */}
    </div>
  );
}
