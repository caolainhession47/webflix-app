import React, { useEffect, useState } from "react";
import styled from "styled-components";
import BackgroundImage from "../components/BackgroundImage";
import Header from "../components/Header";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "../utils/firebase-config";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Login() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
      if (user) {
        navigate("/");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const [error, setError] = useState("");

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = async () => {
    const { email, password } = credentials;
    try {
      await signInWithEmailAndPassword(firebaseAuth, email, password);
      toast.success("User logged in successfully!");
      navigate("/");
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
    }
  };

  return (
    <StyledContainer>
      <BackgroundImage />
      <div className="content">
        <Header />
        <div className="form-container">
          <div className="form">
            <h3 className="title">Login</h3>
            <div className="input-group">
              <input
                type="text"
                name="email"
                placeholder="Email"
                onChange={handleInputChange}
                value={credentials.email}
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                onChange={handleInputChange}
                value={credentials.password}
              />
              <button onClick={handleSubmit}>Login to your account</button>
            </div>
            {error && <p style={{ color: "yellow" }}>{error}</p>}
          </div>
        </div>
      </div>
    </StyledContainer>
  );
}

const StyledContainer = styled.div`
  position: relative;
  .title {
    font-size: 2.4rem;
  }
  .content {
    position: absolute;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100vw;
    background-color: rgba(0, 0, 0, 0.5);
    display: grid;
    grid-template-rows: 15vh 85vh;
    .form-container {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 85vh;
      .form {
        padding: 2rem;
        background-color: #000000b0;
        width: 25vw;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 2rem;
        color: white;
        .input-group {
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
          input {
            padding: 0.5rem 1rem;
            width: 20.5vw;
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
            width: 20.5vw;
            transition: background-color 0.3s; /* Add transition */
          }
          button:hover {
            background-color: #c50712; /* Darker shade of red on hover */
          }
        }
      }
    }
  }
`;
