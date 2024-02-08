import React, { useState, useEffect, useCallback } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ListGrid from "../components/ListGrid";
import serverAxios from "../axios/serverAxios";
import { firebaseAuth } from "../utils/firebase-config";

const Favourites = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [isScrolled, setIsScrolled] = useState(false);

  const fetchFavorites = useCallback(async () => {
    if (currentUser && currentUser.email) {
      try {
        const response = await serverAxios.get(
          `/api/users/favorites/${currentUser.email}`
        );
        setFavorites(response.data);
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    }
  }, [currentUser]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const unsubscribe = firebaseAuth.onAuthStateChanged(setCurrentUser);
    return unsubscribe; // Cleanup the subscription
  }, []);

  return (
    <div>
      <Navbar isScrolled={isScrolled} />
      <ListGrid
        mediaList={favorites}
        fetchList={fetchFavorites}
        removalEndpoint="/api/users/favorites/remove"
      />

      <Footer />
    </div>
  );
};

export default Favourites;
