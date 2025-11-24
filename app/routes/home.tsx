import React, { useEffect, useState } from "react";
import "./style.css";

// Lazy-load the map to avoid SSR errors — MapComponent is in the same folder
const MapComponent = React.lazy(() => import("./MapComponent"));

export default function Home() {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-danger fixed-top">
        <div className="container-fluid">
          <span className="navbar-brand mb-0 h1">AUB Mediterraneo</span>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            aria-controls="nav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
        </div>
      </nav>

      <div className="container-fluid" style={{ paddingTop: 72 }}>
        <div className="row gx-4">
          {/* LEFT SIDE */}
          <main className="col-12 col-md-8">
            <div className="p-3">
              <header className="mb-3">
                <h1 className="h2 text-danger">Campus & Mediterranean Events</h1>
                <p className="text-secondary">
                  Discover curated events for the AUB Mediterraneo community —
                  cultural nights, talks, workshops and local meetups tailored to
                  students and alumni.
                </p>
              </header>

              <div className="mb-3">
                <div className="btn-group" role="group" aria-label="tabs">
                  <button className="btn btn-outline-danger active">Campus Events</button>
                  <button className="btn btn-outline-danger">Mediterraneo Picks</button>
                </div>
              </div>

              <section className="mb-3">
                <h3 className="h5 text-danger">Filters</h3>
                <ul className="ps-3">
                  <li>Walking-friendly routes</li>
                  <li>Student discounts & RSVP</li>
                </ul>
              </section>

              <section>
                <h3 className="h5 text-danger">Personalized for you</h3>
                <div className="d-flex flex-wrap gap-3">
                  <img src="/preview1.jpeg" alt="preview1" className="rounded" style={{ width: 160, height: 120, objectFit: "cover" }} />
                  <img src="/preview2.jpeg" alt="preview2" className="rounded" style={{ width: 160, height: 120, objectFit: "cover" }} />
                </div>
              </section>
            </div>
          </main>

          {/* RIGHT SIDE */}
          <aside className="col-12 col-md-4">
            <div className="right-panel shadow-sm rounded" style={{ height: "calc(100vh - 92px)", overflow: "hidden" }}>
              <React.Suspense fallback={<div className="p-3">Loading map…</div>}>
                {isClient && <MapComponent />}
              </React.Suspense>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
