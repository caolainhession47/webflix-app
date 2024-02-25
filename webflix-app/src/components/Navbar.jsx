import React, { useState, useEffect } from "react";
import { FaPowerOff, FaBars } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import appLogo from "../assets/logo.png";
import { firebaseAuth } from "../utils/firebase-config";
import { signOut, onAuthStateChanged } from "firebase/auth";
import Container from "react-bootstrap/Container";
import AddToQueueIcon from "@mui/icons-material/AddToQueue";
import RateReviewIcon from "@mui/icons-material/RateReview";
import ExtensionIcon from "@mui/icons-material/Extension";
import MovieIcon from "@mui/icons-material/Movie";
import FavoriteIcon from "@mui/icons-material/Favorite";

export default function Navbar({ isScrolled }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
      setIsUserLoggedIn(!!user);
    });
    return () => unsubscribe();
  }, []);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleSignOut = () => {
    if (isUserLoggedIn) {
      signOut(firebaseAuth)
        .then(() => {
          alert("User is logged out!");
          navigate("/"); // Navigate to the home screen after successful sign out
        })
        .catch((error) => {
          console.error("Error signing out:", error);
        });
    } else {
      alert("No user is currently logged in.");
    }
  };

  const handleLoginClick = (e) => {
    e.preventDefault();
    if (isUserLoggedIn) {
      alert("You are already logged in!");
    } else {
      navigate("/login");
    }
  };

  const navigationLinks = [
    { name: "Home", link: "/" },
    { name: "Movies", link: "/movies" },
    { name: "TV Shows", link: "/series" },
    { name: "Search", link: "/search" },
    { name: "Login", link: "/", onClick: handleLoginClick },
  ];

  const sideLinks = [
    { name: "Favourites", link: "/favourites", Icon: FavoriteIcon },
    { name: "Watchlist", link: "/watchlist", Icon: AddToQueueIcon },
    { name: "Reviews", link: "/reviews", Icon: RateReviewIcon },
    { name: "Challenges", link: "/challenges", Icon: ExtensionIcon },
    { name: "Recommendations", link: "/recommendations", Icon: MovieIcon },
  ];

  return (
    <HeaderContainer fluid>
      <nav className={`${isScrolled ? "scrolled" : ""}`}>
        <div className="left-section">
          <div className="logo-container">
            <img src={appLogo} alt="Logo" />
          </div>
          <ul className="navigation-links">
            {navigationLinks.map(({ name, link, onClick }) => (
              <li key={name} onClick={onClick ? onClick : null}>
                {onClick ? (
                  <a href={link}>{name}</a>
                ) : (
                  <Link to={link}>{name}</Link>
                )}
              </li>
            ))}
          </ul>
        </div>
        <div className="right-section">
          {isUserLoggedIn && (
            <>
              <button onClick={toggleSidebar}>
                <FaBars style={{ color: "white" }} />
              </button>
              {sidebarOpen && (
                <div className="sidebar">
                  {sideLinks.map(({ name, link, Icon }) => (
                    <Link key={name} to={link} onClick={toggleSidebar}>
                      <Icon style={{ marginRight: "10px" }} />
                      {name}
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}
          <button onClick={handleSignOut}>
            <FaPowerOff style={{ color: "#f34242" }} />
          </button>
        </div>
      </nav>
    </HeaderContainer>
  );
}

const HeaderContainer = styled(Container)`
  padding-left: 0 !important;
  padding-right: 0 !important;
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
    padding: 0 2rem 0 3rem;
    transition: background-color 0.3s ease-in-out;
    z-index: 100;

    .left-section {
      display: flex;
      align-items: center;
      gap: 0.5rem;

      .logo-container {
        img {
          height: 4rem;
          padding-right: 2rem;
        }
      }

      .navigation-links {
        display: flex;
        list-style: none;
        padding-top: 1.1rem;
        padding-left: 0.2rem;
        gap: 2rem;
        align-items: center;

        li a {
          color: white;
          text-decoration: none;

          &:hover {
            color: #f34242;
          }
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
        min-width: 220px;

        a {
          display: block;
          padding: 0.5rem 1rem;
          color: #8a0606;
          text-decoration: none;
          border-bottom: 1px solid #f34242;
          font-weight: bold;

          &:hover {
            background-color: #ff000042;
            color: #d12f2f;
          }
        }
      }
    }
  }
`;
