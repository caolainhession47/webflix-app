import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import logoL from "../assets/logoL.png";
import logoR from "../assets/logoR.png";

const Footer = () => {
  return (
    <StyledFooter>
      <div className="logo-container-l">
        <img src={logoL} alt="Logo Left" className="logo-left" />
      </div>
      <div className="footer-content">
        <Link to="/movies">Movies</Link>
        <Link to="/series">TV Shows</Link>
        <Link to="/search">Search</Link>
      </div>
      <div className="logo-container-r">
        <img src={logoR} alt="Logo Right" className="logo-right" />
      </div>
    </StyledFooter>
  );
};

const StyledFooter = styled.footer`
  background-color: black;
  color: white;
  padding: 3rem 3rem 1rem 3rem;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .logo-container-l {
    img {
      height: 80px;
    }
  }
  .logo-container-r {
    img {
      height: 65px;
    }
  }

  .footer-content {
    display: flex;
    gap: 3rem;
    padding-left: 50rem;

    a {
      color: white;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }
  }
`;

export default Footer;
