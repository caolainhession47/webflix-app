import React, { useState, useEffect, useCallback } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ListGrid from "../components/ListGrid";
import serverAxios from "../axios/serverAxios";
import { firebaseAuth } from "../utils/firebase-config";
import styled from "styled-components";

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
    <StyledContainer>
      <Navbar isScrolled={isScrolled} />
      <h2 className="bigtitle">Watchlist</h2>
      <ListGrid
        mediaList={watchlist}
        fetchList={fetchWatchlist}
        removalEndpoint="/api/users/watchlist/remove"
      />
      <Footer />
    </StyledContainer>
  );
};

const StyledContainer = styled.div`
  color: white;
  .bigtitle {
    margin-bottom: 12px;
    text-align: flex-start;
    position: relative;
    font-size: 2rem;
    padding-top: 7.5rem;
    padding-left: 7.5rem;
  }

  .bigtitle::after {
    content: "";
    position: absolute;
    left: 7.5rem;
    bottom: -5px;
    margin-bottom: auto.5rem;
    width: 9.3rem;
    height: 5px;
    background-color: #e82128;
  }
`;

export default Watchlist;
