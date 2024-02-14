import React, { useState, useEffect } from "react";
import MediaBanner from "../components/MediaBanner";
import Navbar from "../components/Navbar";
import Videos from "../components/Videos";
import { useParams } from "react-router-dom";
import Images from "../components/Images";
import ReviewsComp from "../components/ReviewsComp";
import Recommended from "../components/Recommended";
import Footer from "../components/Footer";
import axios from "../axios/axios";
import requests from "../axios/requests";

export default function Media() {
  const { mediaType, mediaId } = useParams();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mediaDetails, setMediaDetails] = useState({}); // State to store media details

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    // Function to fetch media details
    const fetchMediaDetails = async () => {
      const requestUrl =
        mediaType === "movie"
          ? requests.fetchMovieDetails(mediaId)
          : requests.fetchTvShowDetails(mediaId);
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3${requestUrl}`
        );
        setMediaDetails({
          mediaType: mediaType,
          mediaTitle: response.data.title || response.data.name, // 'title' for movies, 'name' for TV shows
          posterPath: `https://image.tmdb.org/t/p/w500${response.data.poster_path}`,
        });
      } catch (error) {
        console.error("Error fetching media details:", error);
      }
    };

    fetchMediaDetails();
  }, [mediaType, mediaId]);

  return (
    <div>
      <Navbar isScrolled={isScrolled} />
      <MediaBanner />
      <Videos mediaType={mediaType} mediaId={mediaId} />
      <Images mediaType={mediaType} mediaId={mediaId} />
      <ReviewsComp
        mediaId={mediaId}
        mediaType={mediaDetails.mediaType}
        mediaTitle={mediaDetails.mediaTitle}
        posterPath={mediaDetails.posterPath}
      />
      <Recommended mediaType={mediaType} mediaId={mediaId} />
      <Footer />
    </div>
  );
}
