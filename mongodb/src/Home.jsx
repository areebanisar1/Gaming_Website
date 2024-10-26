import React from "react";
import "./Home.css";
import { Link } from "react-router-dom";
import Mainheader from "./Mainheader";

const Home = () => {
  return (
    <div className="container">
      <Mainheader />
      <main className="main">
        <div className="main-content">
          <h1>Join the ultimate gaming community!</h1>
          <p>
            At Fast Gaming Society, we bring together gamers of all levels to
            share experiences, strategies, and fun. Whether you're a casual
            player or a competitive gamer, there's a place for you here!
          </p>
          <div className="buttons">
            <button className="about">ABOUT THE GAME</button>
            <button className="news">NEWS</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
