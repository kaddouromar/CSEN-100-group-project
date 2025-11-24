import React, { useEffect, useState } from "react";
import "./style.css";

// Lazy-load the map to avoid SSR errors — MapComponent is in the same folder
const MapComponent = React.lazy(() => import("./MapComponent"));

export default function Home() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Only true in browser
  }, []);

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
        {/* LEFT SIDE */}
        <div className="left">
          <div className="header">
            <h1>University Event Discovery App</h1>
            <p>
              The event action for unittesting evening to reverral the enterimed
              tipes of your impekle to cuntine rindi bodr, entimatics and event
              percionaltions.
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
              <img src="/preview1.jpeg" alt="preview1" />
              <img src="/preview2.jpeg" alt="preview2" />
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="right">
          <div className="right-panel">
            {/* Only show MapComponent AFTER hydration */}
            <React.Suspense fallback={<div>Loading map…</div>}>
              {isClient && <MapComponent />}
            </React.Suspense>
          </div>
        </div>
      </div>
    </>
  );
}
