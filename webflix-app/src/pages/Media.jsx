import React, { useState, useEffect } from "react";
import MediaBanner from "../components/MediaBanner";
import Navbar from "../components/Navbar";
import Videos from "../components/Videos";
import { useParams } from "react-router-dom";

export default function Media() {
  const { mediaType, mediaId } = useParams();
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
      <MediaBanner />
      <Videos mediaType={mediaType} mediaId={mediaId} />
    </div>
  );
}
