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
      <Row
        title="Popular Movies"
        fetchUrl={requests.fetchPopularMovies}
        isLargeRow
      />
      <Row title="Top Rated Movies" fetchUrl={requests.fetchTopRated} />
      <Row title="Popular Series" fetchUrl={requests.fetchPopularTV} />
      <Row title="Top Rated Series" fetchUrl={requests.fetchTopRatedTV} />
    </div>
  );
}
