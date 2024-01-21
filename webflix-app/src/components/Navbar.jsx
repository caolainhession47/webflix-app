import React, { useState } from "react";
import { FaPowerOff, FaBars } from "react-icons/fa";
import { Link } from "react-router-dom";
import styled from "styled-components";
import appLogo from "../assets/logo.png";
import { firebaseAuth } from "../utils/firebase-config";
import { signOut } from "firebase/auth";

export default function Navbar({ isScrolled }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const navigationLinks = [
    { name: "Home", link: "/" },
    { name: "Movies", link: "/movies" },
    { name: "TV Shows", link: "/tv" },
    { name: "Search", link: "/search" },
    { name: "Login", link: "/login" },
  ];

  const sideLinks = [
    { name: "Favourites", link: "/favourites" },
    { name: "Watchlist", link: "/watchlist" },
    { name: "Reviews", link: "/reviews" },
    { name: "Challenges", link: "/challenges" },
    { name: "Recommendations", link: "/recommendations" },
  ];

  return (
    <HeaderContainer>
      <nav className={`${isScrolled ? "scrolled" : ""}`}>
        <div className="left-section">
          <div className="logo-container">
            <img src={appLogo} alt="Logo" />
          </div>
          <ul className="navigation-links">
            {navigationLinks.map(({ name, link }) => (
              <li key={name}>
                <Link to={link}>{name}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="right-section">
          <button
            onClick={() => {
              signOut(firebaseAuth)
                .then(() => {
                  alert("Logged out successfully");
                })
                .catch((error) => {
                  // Handle errors here, such as a failed sign-out process
                  console.error("Sign out error", error);
                });
            }}
          >
            <FaPowerOff style={{ color: "#f34242" }} />
          </button>

          <button onClick={toggleSidebar}>
            <FaBars style={{ color: "white" }} />
          </button>
          {sidebarOpen && (
            <div className="sidebar">
              {sideLinks.map(({ name, link }) => (
                <Link key={name} to={link} onClick={toggleSidebar}>
                  {name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </nav>
    </HeaderContainer>
  );
}

const HeaderContainer = styled.div`
  .scrolled {
    background-color: black;
  }
  nav {
    position: fixed;
    top: 0;
    height: 6.5rem;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 4rem;
    transition: background-color 0.3s ease-in-out;
    z-index: 100;

    .left-section {
      display: flex;
      align-items: center;
      gap: 2rem;

      .logo-container {
        img {
          height: 4rem;
        }
      }

      .navigation-links {
        display: flex;
        list-style: none;
        gap: 2rem;
        align-items: center;

        li a {
          color: white;
          text-decoration: none;
        }
      }
    }

    .right-section {
      display: flex;
      align-items: center;
      position: relative;

      button {
        padding: 0.45rem;
        margin: 0 0.1rem;
        font-size: 1.2rem;
        background: none;
        border: none;
        cursor: pointer;
        &:first-child svg {
          color: #f34242;
        }
        &:last-child svg {
          color: white;
        }
        &:focus {
          outline: none;
        }
      }

      .sidebar {
        position: absolute;
        top: 100%;
        right: 10px;
        background: white;
        box-shadow: 0px 0 5px rgba(0, 0, 0, 0.5);
        z-index: 200;
        padding: 0.3rem;
        border-radius: 8px;

        a {
          display: block;
          padding: 0.5rem 1rem;
          color: #8a0606;
          text-decoration: none;
          border-bottom: 1px solid #f34242;
          font-weight: bold;
          border-radius: 4px;

          &:hover {
            background-color: #ffebeb;
            color: #d12f2f;
          }
        }
      }
    }
  }
`;
