import React from "react";
import "./style.css";

export default function Home() {
  return (
    <>
      <header className="topbar">
        <div className="logo">nearU.</div>
        <div className="hamburger">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </header>

      <div className="container">
        <div className="left">
          <div className="header">
            <h1>University Event Discovery App</h1>
            <p>
              The event action for unittesting evening to reverral the enterimed tipes of your impekle to cuntine rindi bodr, entimatics and event percionaltions.
            </p>
          </div>

          <div className="tabs">
            <button className="active">All Events</button>
            <button>Personalised Events</button>
          </div>

          <div className="filters">
            <h3>Filterv details</h3>
            <ul>
              <li>Frankintent cokt quoties, noar routs final directlions</li>
              <li>Comirution and walking directions</li>
            </ul>
          </div>

          <div className="personalization">
            <h3>Personalizerptions</h3>
            <div className="photos">
              <img src="/mnt/data/f4e8bc45-9f66-4296-b166-8d03a8b19141.jpeg" alt="preview1" />
              <img src="/mnt/data/f4e8bc45-9f66-4296-b166-8d03a8b19141.jpeg" alt="preview2" />
            </div>
          </div>
        </div>

        <div className="right">
          <img className="map" src="/mnt/data/f4e8bc45-9f66-4296-b166-8d03a8b19141.jpeg" alt="map" />
        </div>
      </div>
    </>
  );
}
