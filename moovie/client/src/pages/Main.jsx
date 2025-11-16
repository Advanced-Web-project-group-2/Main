import React from "react";
import { Link } from "react-router-dom";
import TopThreeMovies from "../components/movies/TopThreeMovies.jsx";
import banner from "../assets/images/banner.png";
import BasicSearch from "../components/search/basicSearch.jsx";

export default function Main() {
  return (
    <div className="home-wrapper">

      <div className="hero-image">
        <img src={banner} alt="Cinema banner" />
      </div>

      {/* White card container */}
      <div className="home-card">

        <section className="intro-section">
          <h2>Welcome to Moo-viestar</h2>
          <p>You found the perfect Webpage for cinema enthusiasts like you!</p>
          <p>You can search all movies and series, make friends and share interests!</p>
        </section>

        <section className="search-section">
          <h3>Search Movies and Series</h3>
          <BasicSearch />
        </section>

        <section className="top-movies-section">
          <TopThreeMovies />
          <p className="cinema-link">
            <Link to="/in-cinemas">See all movies in cinemas right now</Link>
          </p>
        </section>

      </div>
    </div>
  );
}