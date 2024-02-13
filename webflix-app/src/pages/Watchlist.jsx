import React, { useState, useEffect, useCallback } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ListGrid from "../components/ListGrid";
import serverAxios from "../axios/serverAxios";
import { firebaseAuth } from "../utils/firebase-config";

const Watchlist = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [watchlist, setWatchlist] = useState([]);
  const [isScrolled, setIsScrolled] = useState(false);

  const fetchWatchlist = useCallback(async () => {
    if (currentUser && currentUser.email) {
      try {
        const response = await serverAxios.get(
          `/api/users/watchlist/${currentUser.email}`
        );
        setWatchlist(response.data);
      } catch (error) {
        console.error("Error fetching watchlist:", error);
      }
    }
  }, [currentUser]);

  useEffect(() => {
    fetchWatchlist();
  }, [fetchWatchlist]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const unsubscribe = firebaseAuth.onAuthStateChanged(setCurrentUser);
    return unsubscribe;
  }, []);

  return (
    <div>
      <Navbar isScrolled={isScrolled} />
      <ListGrid
        mediaList={watchlist}
        fetchList={fetchWatchlist}
        removalEndpoint="/api/users/watchlist/remove"
      />

      <Footer />
    </div>
  );
};

export default Watchlist;
