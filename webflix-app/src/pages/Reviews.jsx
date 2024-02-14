import React, { useState, useEffect } from "react";
import styled from "styled-components";
import serverAxios from "../axios/serverAxios";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { firebaseAuth } from "../utils/firebase-config";
import { Button } from "@mui/material";
import { Container } from "react-bootstrap";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Rating from "@mui/material/Rating";

function UserReviews() {
  const [reviews, setReviews] = useState([]);
  const [user, setUser] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const unsubscribe = firebaseAuth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchUserReviews(currentUser.email);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchUserReviews = async (email) => {
    try {
      const response = await serverAxios.get(
        `/api/users/reviews/user/${email}`
      );
      setReviews(response.data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const handleDeleteReview = async (mediaId) => {
    if (user) {
      try {
        await serverAxios.put(`/api/users/reviews/remove`, {
          email: user.email,
          mediaId,
        });
        // Filter out the deleted review
        setReviews(reviews.filter((review) => review.mediaId !== mediaId));
      } catch (error) {
        console.error("Error deleting review:", error);
      }
    }
  };

  return (
    <>
      <Navbar isScrolled={isScrolled} />
      <StyledContainer>
        <h2 className="title">Your Reviews ({reviews.length})</h2>
        {reviews.map((review, index) => (
          <div key={index} className="review-entry">
            <div className="review-content">
              <img src={review.posterPath} alt={review.title} />
              <div>
                <h3 className="rtitle">{review.title}</h3>
                <p className="date">
                  {new Date(review.createdAt).toLocaleString()}
                </p>
                <Rating name="read-only" value={review.rating} readOnly />
                <p className="text">{review.reviewText}</p>
              </div>
            </div>
            <Button
              className="button"
              variant="contained"
              color="error"
              startIcon={<DeleteForeverIcon />}
              onClick={() => handleDeleteReview(review.mediaId)}
            >
              Remove
            </Button>
          </div>
        ))}
      </StyledContainer>
      <Footer />
    </>
  );
}

const StyledContainer = styled(Container)`
  padding-top: 7.5rem;
  color: white;
  min-height: 100vh;
  .title {
    margin-bottom: 12px;
    text-align: flex-start;
    position: relative;
    font-size: 2rem;
  }

  .title::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: -7px;
    margin-bottom: auto.5rem;
    width: 15.2rem;
    height: 5px;
    background-color: #e82128;
  }
  .rtitle {
    margin-top: 1rem;
  }
  .review-entry {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    background: black;
    padding: 10px;
    border-radius: 8px;
  }
  .date {
    font-size: 0.85rem;
    color: #bbb;
  }
  .review-content {
    display: flex;
    gap: 20px;
  }

  .review-content img {
    width: 165px;
    height: 243px;
    border-radius: 8px;
  }

  .review-content div {
    display: flex;
    flex-direction: column;
  }

  .text {
    padding-left: 4px;
    padding-top: 4px;
    max-width: 60vw;
  }
`;

export default UserReviews;
