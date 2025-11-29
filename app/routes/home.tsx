import React, { useEffect, useState } from "react";
import "./style.css";
import data from './data.json';

const MapComponent = React.lazy(() => import("./MapComponent"));

const EVENTS_PER_PAGE = 5;

export default function Home() {
  const [isClient, setIsClient] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [filteredEvents, setFilteredEvents] = useState(data.events);
  const [visibleEvents, setVisibleEvents] = useState<typeof data.events>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreEvents, setHasMoreEvents] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<number | null>(null);

  useEffect(() => setIsClient(true), []);

  useEffect(() => {
    if (selectedCategory === "all") {
      setFilteredEvents(data.events);
    } else {
      setFilteredEvents(
        data.events.filter((event) => event.category === selectedCategory)
      );
    }
    setCurrentPage(1);
    setSelectedItem(null);
  }, [selectedCategory]);

  useEffect(() => {
    const endIndex = currentPage * EVENTS_PER_PAGE;
    setVisibleEvents(filteredEvents.slice(0, endIndex));
    setHasMoreEvents(endIndex < filteredEvents.length);
  }, [filteredEvents, currentPage]);

  const loadMoreEvents = () => setCurrentPage((p) => p + 1);
  const showLessEvents = () => setCurrentPage(1);
  const toggleMenu = () => setIsMenuOpen((p) => !p);

  const handleItemClick = (itemId: number) => setSelectedItem(itemId);

  const getCategoryLabel = (value: string) => {
    return data.categories.find((c) => c.value === value)?.label || value;
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  return (
    <>
      <nav className="navbar">

        {/* LEFT EMPTY SPACER (keeps layout correct) */}
        <div className="nav-menu-container"></div>

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
              <a className="dropdown-item" href="#">
                Locations
              </a>
              <a className="dropdown-item" href="#">
                Events
              </a>
              <a className="dropdown-item" href="#">
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

      {/* MENU OVERLAY */}
      {isMenuOpen && <div className="menu-overlay" onClick={toggleMenu}></div>}

      <div className="main-container">
        <div className="content-grid">
          <main className="content-main">
            <div className="content-wrapper">
              <header className="page-header">
                <h1 className="page-title">Campus & Mediterranean Events</h1>
                <p className="page-subtitle">
                  Discover curated events for the AUB Mediterraneo community —
                  cultural nights, talks, workshops and local meetups tailored to
                  students and alumni.
                </p>
              </header>

              <section className="events-section">
                <div className="section-header">
                  <h2 className="section-title">
                    {selectedCategory === "all"
                      ? "EVENTS"
                      : getCategoryLabel(selectedCategory)}
                  </h2>
                  <div className="events-count">
                    {visibleEvents.length} of {filteredEvents.length} events
                  </div>
                </div>

                <div className="events-grid">
                  {visibleEvents.length > 0 ? (
                    visibleEvents.map((event) => (
                      <div
                        key={event.id}
                        className={`event-card ${
                          selectedItem === event.id ? "event-card-active" : ""
                        }`}
                      >
                        <div className="event-header">
                          <h3 className="event-title">{event.name}</h3>
                          <span className="event-category">
                            {getCategoryLabel(event.category)}
                          </span>
                        </div>

                        <div className="event-details">
                          <div className="event-location">
                            {event.location}
                          </div>
                          <div className="event-date">
                            {formatDate(event.date)}
                          </div>
                        </div>

                        <div className="event-action">
                          <button
                            className="view-on-map-btn"
                            onClick={() => handleItemClick(event.id)}
                          >
                            View on Map
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="empty-state">
                      <div className="empty-icon">📅</div>
                      <p>No events in this category</p>
                    </div>
                  )}
                </div>

                {hasMoreEvents ? (
                  <div className="load-more-container">
                    <button className="load-more-btn" onClick={loadMoreEvents}>
                      Load More Events
                    </button>
                  </div>
                ) : visibleEvents.length > EVENTS_PER_PAGE ? (
                  <div className="load-more-container">
                    <button className="load-more-btn" onClick={showLessEvents}>
                      Show Less Events
                    </button>
                  </div>
                ) : null}
              </section>

              <section className="filter-section">
                <div className="filter-header">
                  <h3 className="filter-title">Filter Events</h3>
                </div>
                <div className="filter-controls">
                  <div className="custom-select">
                    <select
                      className="select-input"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                      {data.categories.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                    <div className="select-arrow">
                      ▼
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </main>

          <aside className="map-sidebar">
            <div className="map-container">
              <React.Suspense fallback={<div className="map-loading">Loading map…</div>}>
                {isClient && (
                  <MapComponent
                    locations={data.locations}
                    events={data.events}
                    selectedItem={selectedItem}
                    onItemSelect={setSelectedItem}
                  />
                )}
              </React.Suspense>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
