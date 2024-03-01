import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import Container from "react-bootstrap/Container";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";
import { firebaseAuth } from "../utils/firebase-config";
import serverAxios from "../axios/serverAxios";
import Rating from "@mui/material/Rating";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { toast } from "react-toastify";

function ReviewsComp({ mediaId, mediaType, mediaTitle, posterPath }) {
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(2); // Start with 2 stars
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = firebaseAuth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const fetchReviews = useCallback(async () => {
    try {
      const response = await serverAxios.get(
        `/api/users/reviews/media/${mediaId}`
      );
      setReviews(response.data || []);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setReviews([]);
    }
  }, [mediaId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews, mediaId]);

  const handleReviewSubmit = async () => {
    if (!user || !reviewText.trim() || rating <= 0) return;

    const reviewData = {
      email: user.email,
      mediaId,
      mediaType,
      title: mediaTitle,
      posterPath,
      rating,
      reviewText,
    };

    try {
      // Check if the user has already reviewed this media
      const existingReview = reviews.find(
        (review) => review.email === user.email
      );
      let response;
      if (existingReview) {
        // Update existing review
        response = await serverAxios.put(
          "/api/users/reviews/update",
          reviewData
        );
      } else {
        // Add new review
        response = await serverAxios.post("/api/users/reviews/add", reviewData);
      }

      if (response && response.status >= 200 && response.status < 300) {
        fetchReviews(); // Refresh reviews
        toast.success("Review submitted successfully");
        setReviewText("");
        setRating(2); // Reset rating
      } else {
        throw new Error("Failed to submit review");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  return (
    <StyledContainer>
      <h2 className="title">Reviews ({reviews.length})</h2>
      {reviews.map((review, index) => (
        <div key={index} className="review-entry">
          <AccountCircleIcon className="account-icon" />
          <div className="review-details">
            <span className="review-username">{review.username}</span>
            <span className="review-date">
              {new Date(review.createdAt).toLocaleDateString()}
            </span>
            <Rating name="read-only" value={review.rating} readOnly />
            <p>{review.reviewText}</p>
          </div>
        </div>
      ))}
      {user && (
        <>
          <textarea
            className="review-input"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Write your review"
          />
          <Rating
            className="user-rating"
            name="user-rating"
            value={rating}
            onChange={(e, newValue) => setRating(newValue)}
          />
          <Button
            className="submit-button"
            onClick={handleReviewSubmit}
            variant="contained"
            endIcon={<SendIcon />}
          >
            Post
          </Button>
        </>
      )}
    </StyledContainer>
  );
}

const StyledContainer = styled(Container)`
  margin-top: 3rem;
  .title {
    color: white;
    margin-bottom: 25px;
    text-align: flex-start;
    position: relative;
    font-size: 2rem;
  }

  .title::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: -9px;
    margin-bottom: auto.5rem;
    width: 11rem;
    height: 5px;
    background-color: #e82128;
  }
  .user-rating {
    margin-top: 0.5rem;
  }
  .account-icon {
    font-size: 4rem;
    color: #e82128;
    margin-right: 5px;
    margin-top: 10px;
  }

  .review-entry {
    display: flex;
    align-items: flex-start;
    color: white;
    margin-bottom: 1rem;
  }

  .review-details {
    margin-left: 10px;
    display: flex;
    flex-direction: column;
  }

  .review-username {
    font-weight: bold;
  }

  .review-date {
    font-size: 0.85rem;
    color: #bbb;
    margin: 5px 0;
  }

  .review-input {
    width: 100%;
    padding-left: 5px;
    margin-top: -3px;
    background-color: black;
    color: white;
    &:hover {
      border-color: #c00000;
    }
    &:focus {
      outline: none;
      border-color: #e82128;
    }
  }
  .submit-button {
    background-color: #e82128;
    border: none;
    margin-top: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    &:hover {
      background-color: #c00000;
    }
  }
`;

export default ReviewsComp;
