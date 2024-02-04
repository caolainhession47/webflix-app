import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Banner from "../components/Banner";
import Footer from "../components/Footer";
import GenresMenu from "../components/GenresMenu";
import MediaGrid from "../components/MediaGrid";

const Movies = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedOption, setSelectedOption] = useState("top_rated");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div>
      <Navbar isScrolled={isScrolled} />
      <Banner mediaType="movie" />
      <GenresMenu onSelectGenre={setSelectedOption} />
      <MediaGrid selectedOption={selectedOption} mediaType="movie" />
      <Footer />
    </div>
  );
};

export default Movies;
