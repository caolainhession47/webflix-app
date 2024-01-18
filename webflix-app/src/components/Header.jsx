import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import customLogo from "../assets/logo.png";

export default function Header(props) {
  const navigate = useNavigate();

  // Handler to navigate to the home screen
  const goToHome = () => {
    navigate("/");
  };

  // Handler to navigate to login or signup
  const goToAuth = () => {
    navigate(props.login ? "/login" : "/signup");
  };

  return (
    <StyledCustomHeader className="flex align-center justify-between">
      <div className="brand" onClick={goToHome} role="button" tabIndex={0}>
        <img src={customLogo} alt="Webflix Logo" />
      </div>
      <button onClick={goToAuth}>
        {props.login ? "Login" : "Sign Up"}
      </button>
    </StyledCustomHeader>
  );
  
}

const StyledCustomHeader = styled.header`
  padding: 0 4rem;
  margin-top: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .brand {
    cursor: pointer; 
    img {
      height: 5rem;
      margin-top: 1rem;
    }
  }

  button {
    padding: 0.75rem 2rem;
    margin-top: 1rem;
    margin-right: 1rem;
    background-color: #ff0000;
    border: none;
    cursor: pointer;
    color: white;
    border-radius: 0.2rem;
    font-weight: bold;
    font-size: 1.05rem;
    transition: background-color 0.3s ease-in-out;

    &:hover {
      background-color: #b30000ab;
    }
  }
`;
