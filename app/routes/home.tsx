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
  const [selectedEvent, setSelectedEvent] = useState<number | null>(null);

  useEffect(() => setIsClient(true), []);

  // Filter events based on selected category
  useEffect(() => {
    if (selectedCategory === "all") {
      setFilteredEvents(data.events);
    } else {
      setFilteredEvents(data.events.filter(event => event.category === selectedCategory));
    }
    setCurrentPage(1);
    setSelectedEvent(null); // Reset selected event when filter changes
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

  const handleEventClick = (eventId: number) => {
    setSelectedEvent(eventId);
    // Scroll to top to see the map movement better
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
        <div className="nav-container">
          <div className="nav-brand">
            <span className="brand-text">AUB Mediterraneo</span>
          </div>
          
          <div className="nav-menu-container">
            <button 
              className={`nav-toggle ${isMenuOpen ? 'active' : ''}`} 
              onClick={toggleMenu}
              type="button"
            >
              <span className="toggle-line"></span>
              <span className="toggle-line"></span>
              <span className="toggle-line"></span>
            </button>

            <div className={`nav-dropdown ${isMenuOpen ? 'active' : ''}`}>
              <div className="dropdown-header">
                <h3>Menu</h3>
              </div>
              <div className="dropdown-content">
                <a href="#" className="dropdown-item">
                  <svg className="dropdown-icon" viewBox="0 0 24 24" width="20" height="20">
                    <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                  </svg>
                  About
                </a>
                <a href="#" className="dropdown-item">
                  <svg className="dropdown-icon" viewBox="0 0 24 24" width="20" height="20">
                    <path fill="currentColor" d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19a2 2 0 002 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"/>
                  </svg>
                  Events
                </a>
                <a href="#" className="dropdown-item">
                  <svg className="dropdown-icon" viewBox="0 0 24 24" width="20" height="20">
                    <path fill="currentColor" d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                  Contact
                </a>
                <a href="#" className="dropdown-item">
                  <svg className="dropdown-icon" viewBox="0 0 24 24" width="20" height="20">
                    <path fill="currentColor" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                  Profile
                </a>
                <div className="dropdown-divider"></div>
                <a href="#" className="dropdown-item sign-in">
                  <svg className="dropdown-icon" viewBox="0 0 24 24" width="20" height="20">
                    <path fill="currentColor" d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5c-1.11 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>
                  </svg>
                  Sign In
                </a>
              </div>
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
                    {selectedCategory === 'all' ? 'All Events & Places' : getCategoryLabel(selectedCategory)}
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
                        className={`event-card ${selectedEvent === event.id ? 'event-card-active' : ''}`}
                        onClick={() => handleEventClick(event.id)}
                      >
                        <div className="event-header">
                          <h3 className="event-title">{event.name}</h3>
                          <span className="event-category">{getCategoryLabel(event.category)}</span>
                        </div>
                        <div className="event-details">
                          <div className="event-location">
                            <svg className="icon" viewBox="0 0 24 24" width="16" height="16">
                              <path fill="currentColor" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z"/>
                            </svg>
                            {event.location}
                          </div>
                          <div className="event-date">
                            <svg className="icon" viewBox="0 0 24 24" width="16" height="16">
                              <path fill="currentColor" d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19a2 2 0 002 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
                            </svg>
                            {formatDate(event.date)}
                          </div>
                        </div>
                        <div className="event-action">
                          <button className="view-on-map-btn">
                            View on Map
                            <svg className="map-icon" viewBox="0 0 24 24" width="16" height="16">
                              <path fill="currentColor" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z"/>
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
                        <path fill="currentColor" d="M7 10l5 5 5-5z"/>
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
                    events={data.events}
                    selectedEvent={selectedEvent}
                    onEventSelect={setSelectedEvent}
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