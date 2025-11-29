import React, { useEffect, useState } from "react";
import "./style.css";

// Import your data (you can also fetch this from a JSON file)
import data from './data.json';

// Lazy-load the map
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
  const [selectedItem, setSelectedItem] = useState<number | null>(null); // Changed from selectedEvent

  useEffect(() => setIsClient(true), []);

  // Filter events based on selected category
  useEffect(() => {
    if (selectedCategory === "all") {
      setFilteredEvents(data.events);
    } else {
      setFilteredEvents(data.events.filter(event => event.category === selectedCategory));
    }
    setCurrentPage(1);
    setSelectedItem(null); // Reset selected item when filter changes
  }, [selectedCategory]);

  // Update visible events when filtered events or page changes
  useEffect(() => {
    const endIndex = currentPage * EVENTS_PER_PAGE;
    setVisibleEvents(filteredEvents.slice(0, endIndex));
    setHasMoreEvents(endIndex < filteredEvents.length);
  }, [filteredEvents, currentPage]);

  const loadMoreEvents = () => {
    setCurrentPage(prev => prev + 1);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleItemClick = (itemId: number) => { // Changed from handleEventClick
    setSelectedItem(itemId);
  };

  const getCategoryLabel = (categoryValue: string) => {
    const category = data.categories.find(cat => cat.value === categoryValue);
    return category ? category.label : categoryValue;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <>
      <nav className="navbar">

        <div className="nav-menu-container">
          
        </div>

        <div className="nav-container">
          <div className="nav-brand">
            <span className="brand-text">nearU.</span>
          </div>
          </div>
          <div className="nav-menu-container">
            <button 
  className={`nav-toggle ${isMenuOpen ? 'opened' : ''}`}
  onClick={toggleMenu}
  type="button"
  aria-label="Main Menu"
  aria-expanded={isMenuOpen}
>
  <svg width="30" height="30" viewBox="0 0 100 100">
    <path className="line line1" d="M 20,29.000046 H 80.000231 C 80.000231,29.000046 94.498839,28.817352 94.532987,66.711331 94.543142,77.980673 90.966081,81.670246 85.259173,81.668997 79.552261,81.667751 75.000211,74.999942 75.000211,74.999942 L 25.000021,25.000058" />
    <path className="line line2" d="M 20,50 H 80" />
    <path className="line line3" d="M 20,70.999954 H 80.000231 C 80.000231,70.999954 94.498839,71.182648 94.532987,33.288669 94.543142,22.019327 90.966081,18.329754 85.259173,18.331003 79.552261,18.332249 75.000211,25.000058 75.000211,25.000058 L 25.000021,74.999942" />
  </svg>
</button>

            <div className={`nav-dropdown ${isMenuOpen ? 'active' : ''}`}>
              <div className="dropdown-header">
                <h3>Menu</h3>
              </div>
              <div className="dropdown-content">
                <a href="#" className="dropdown-item">
                  <svg className="dropdown-icon" viewBox="0 0 24 24" width="20" height="20">
                    <path fill="currentColor" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z" />
                  </svg>
                  Locations
                </a>
                <a href="#" className="dropdown-item">
                  <svg className="dropdown-icon" viewBox="0 0 24 24" width="20" height="20">
                    <path fill="currentColor" d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19a2 2 0 002 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z" />
                  </svg>
                  Events
                </a>
                <a href="#" className="dropdown-item">
                  <svg className="dropdown-icon" viewBox="0 0 24 24" width="20" height="20">
                    <path fill="currentColor" d="M16 11V3H8v6H2v12h20V11h-6zm-6-6h4v14h-4V5zm-6 6h4v8H4v-8zm16 8h-4v-6h4v6z" />
                  </svg>
                  Leaderboard
                </a>
                <div className="dropdown-divider"></div>
                <a href="#" className="dropdown-item sign-in">
                  <svg className="dropdown-icon" viewBox="0 0 24 24" width="20" height="20">
                    <path fill="currentColor" d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5c-1.11 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
                  </svg>
                  Sign In
                </a>
              </div>
            </div>
        </div>
      </nav>

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
                    {selectedCategory === 'all' ? 'EVENTS' : getCategoryLabel(selectedCategory)}
                  </h2>
                  <div className="events-count">
                    {visibleEvents.length} of {filteredEvents.length} events
                  </div>
                </div>

                <div className="events-grid">
                  {visibleEvents.length > 0 ? (
                    visibleEvents.map(event => (
                      <div
                        key={event.id}
                        className={`event-card ${selectedItem === event.id ? 'event-card-active' : ''}`}
                      >
                        <div className="event-header">
                          <h3
                            className="event-title"
                            // onClick={() => handleItemClick(event.id)}
                            // style={{ cursor: 'pointer' }}
                          >
                            {event.name}
                          </h3>
                          <span className="event-category">{getCategoryLabel(event.category)}</span>
                        </div>
                        <div className="event-details">
                          <div className="event-location">
                            <svg className="icon" viewBox="0 0 24 24" width="16" height="16">
                              <path fill="currentColor" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z" />
                            </svg>
                            {event.location}
                          </div>
                          <div className="event-date">
                            <svg className="icon" viewBox="0 0 24 24" width="16" height="16">
                              <path fill="currentColor" d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19a2 2 0 002 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
                            </svg>
                            {formatDate(event.date)}
                          </div>
                        </div>
                        <div className="event-action">
                          <button
                            className="view-on-map-btn"
                            onClick={() => handleItemClick(event.id)}
                          >
                            View on Map
                            <svg className="map-icon" viewBox="0 0 24 24" width="16" height="16">
                              <path fill="currentColor" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="empty-state">
                      <div className="empty-icon">📅</div>
                      <p className="empty-text">No events found in this category</p>
                      <small className="empty-subtext">Try selecting a different category</small>
                    </div>
                  )}
                </div>

                {hasMoreEvents && (
                  <div className="load-more-container">
                    <button className="load-more-btn" onClick={loadMoreEvents}>
                      Load More Events
                      <span className="remaining-count">({filteredEvents.length - visibleEvents.length} remaining)</span>
                    </button>
                  </div>
                )}

                {!hasMoreEvents && visibleEvents.length > 0 && (
                  <div className="all-loaded">
                    <span>All events loaded</span>
                  </div>
                )}
              </section>

              <section className="filter-section">
                <div className="filter-header">
                  <h3 className="filter-title">Filter Events</h3>
                  <div className="filter-indicator">
                    <span className="indicator-dot"></span>
                    Active Filter
                  </div>
                </div>
                <div className="filter-controls">
                  <div className="custom-select">
                    <select
                      className="select-input"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                      {data.categories.map(category => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                    <div className="select-arrow">
                      <svg viewBox="0 0 24 24" width="16" height="16">
                        <path fill="currentColor" d="M7 10l5 5 5-5z" />
                      </svg>
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
                    locations={data.locations} // ADD THIS LINE
                    events={data.events}
                    selectedItem={selectedItem} // Changed from selectedEvent
                    onItemSelect={setSelectedItem} // Changed from onEventSelect
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
