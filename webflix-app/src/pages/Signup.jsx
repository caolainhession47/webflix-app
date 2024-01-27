import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import BackgroundImage from "../components/BackgroundImage";
import Header from "../components/Header";
import { firebaseAuth } from "../utils/firebase-config";

function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const { email, password } = formValues;
      await createUserWithEmailAndPassword(firebaseAuth, email, password);
      navigate("/"); // Navigate to home on successful signup
    } catch (error) {
      setError(error.message);
    }
  };

  onAuthStateChanged(firebaseAuth, (currentUser) => {
    if (currentUser) navigate("/");
  });

  const handleChange = (e) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Container>
      <BackgroundImage />
      <div className="content">
        <Header login />
        <div className="body flex column a-center j-center">
          <div className="text flex column">
            <h1>Join the Ultimate Movie Experience!</h1>
            <h4>Explore a vast library of movies, TV shows, and much more.</h4>
            <h5>
              To unlock all features enter your email and start your cinematic
              journey!
            </h5>
          </div>
          <div className="form">
            <input
              type="email"
              placeholder="Email address"
              onChange={handleChange}
              name="email"
              value={formValues.email}
              required
            />
            {showPassword && (
              <input
                type="password"
                placeholder="Password"
                onChange={handleChange}
                name="password"
                value={formValues.password}
                required
              />
            )}
            {!showPassword && (
              <button type="button" onClick={() => setShowPassword(true)}>
                Get Started
              </button>
            )}
            {showPassword && (
              <button
                type="submit"
                id="SignUp"
                className="hover-effect"
                onClick={handleSignIn}
              >
                Sign Up
              </button>
            )}
          </div>
          {error && <p style={{ color: "yellow" }}>{error}</p>}
        </div>
      </div>
    </Container>
  );
}

const Container = styled.div`
  position: relative;

  .content {
    position: absolute;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.5);
    height: 100vh;
    width: 100vw;
    display: grid;
    grid-template-rows: 15vh 85vh;

    .body {
      gap: 1rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      .text {
        gap: 1rem;
        text-align: center;
        font-size: 2rem;
        color: white;

        h1 {
          font-size: 3rem;
        }

        h5,
        h6 {
          color: inherit;
        }
      }

      .form {
        display: grid;
        grid-template-columns: ${({ showPassword }) =>
          showPassword ? "1fr 1fr" : "1fr 1fr"};
        width: 60%;

        input {
          color: black;
          border: none;
          padding: 1.5rem;
          font-size: 1.2rem;
          border: 1px solid black;

          &:focus {
            outline: none;
          }
        }

        button {
          padding: 0.5rem 1rem;
          background-color: #e50914;
          border: none;
          cursor: pointer;
          color: white;
          font-weight: bolder;
          font-size: 1.05rem;
        }
      }

      button {
        padding: 0.5rem 1rem;
        background-color: #e50914;
        border: none;
        cursor: pointer;
        color: white;
        border-radius: 0.2rem;
        font-weight: bolder;
        font-size: 1.05rem;
      }

      #SignUp {
        position: relative;
        left: 23rem;
        width: 11rem;
        height: 3rem;
        background-color: #e50914;
        margin: 0.5rem;
        transition: background-color 0.3s;
      }

      #SignUp:hover {
        background-color: #c50712;
      }

      p {
        color: white;
      }
    }
  }
`;

export default Signup;
