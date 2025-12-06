
import React, { useEffect, useState } from "react";
import "./signup.css";


export default function Home() {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);

  const [isMenuOpen, setIsMenuOpen] = useState(false);



  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <nav className="navbar">
        {/* LEFT EMPTY SPACER (keeps layout correct) */}
        <div className="nav-menu-container">
          <a href="/">
            <img src="/favicon.ico" width="64px" height="64px" />
          </a>
        </div>

        {/* CENTER BRAND */}
        <div className="nav-container">
          <div className="nav-brand">
            <span className="brand-text">nearU.</span>
          </div>
        </div>

        {/* RIGHT HAMBURGER — SAME POSITION AS ORIGINAL */}
        <div className="nav-menu-container">
          <button
            className={`nav-toggle ${isMenuOpen ? "opened" : ""}`}
            onClick={toggleMenu}
            type="button"
            aria-label="Main Menu"
            aria-expanded={isMenuOpen}
          >
            <svg width="30" height="30" viewBox="0 0 100 100">
              <path
                className="line line1"
                d="M 20,29.000046 H 80.000231 C 80.000231,29.000046 94.498839,28.817352 94.532987,66.711331 94.543142,77.980673 90.966081,81.670246 85.259173,81.668997 79.552261,81.667751 75.000211,74.999942 75.000211,74.999942 L 25.000021,25.000058"
              />
              <path className="line line2" d="M 20,50 H 80" />
              <path
                className="line line3"
                d="M 20,70.999954 H 80.000231 C 80.000231,70.999954 94.498839,71.182648 94.532987,33.288669 94.543142,22.019327 90.966081,18.329754 85.259173,18.331003 79.552261,18.332249 75.000211,25.000058 75.000211,25.000058 L 25.000021,74.999942"
              />
            </svg>
          </button>

          <div className={`nav-dropdown ${isMenuOpen ? "active" : ""}`}>
            <div className="dropdown-header">
              <h3>Menu</h3>
            </div>
            <div className="dropdown-content">
              <a className="dropdown-item" href="/locations">
                Locations
              </a>
              <a className="dropdown-item" href="/events">
                Events
              </a>
              <a className="dropdown-item" href="/leaderboard">
                Leaderboard
              </a>
              <div className="dropdown-divider" />
              <a className="dropdown-item sign-in" href="#">
                Sign In
              </a>
            </div>
          </div>
        </div>
      </nav>

      {isMenuOpen && <div className="menu-overlay" onClick={toggleMenu}></div>}

      <div className="main-container">
        <main className="content-main">
          <div className="content-wrapper">
            <header className="page-header">
              <h1 className="page-title">Sign Up</h1>
              <div className="form-container">
                <input type="text" className="form" placeholder="Username"/>
                <input type="text" className="form" placeholder="Email"/>
                <input type="password" className="form" placeholder="Password"/>
              </div>
              <button className="submit-button">Sign Up</button>
              <p className="page-subtitle">
                Already have an account? <a className="switch-form-button" href="/login">Log in</a>
              </p>
            </header>

          </div>
        </main>
      </div>
    </>
  );
}