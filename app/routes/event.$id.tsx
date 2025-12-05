import React from "react";
import { useParams, Link } from "react-router";
import data from "./data.json";
import "./style.css";

const MapComponent = React.lazy(() => import("./MapComponent"));

export default function EventDetailPage() {
  const { id } = useParams();
  const [isClient, setIsClient] = React.useState(false);
  const [isAttending, setIsAttending] = React.useState(false);

  React.useEffect(() => setIsClient(true), []);

  const event = data.events.find((e: any) => e.id === Number(id));

  if (!event) {
    return (
      <div className="main-container">
        <div className="content-wrapper" style={{ textAlign: "center", padding: "3rem 1rem" }}>
          <h1 style={{ color: "var(--aub-red)" }}>Event Not Found</h1>
          <p style={{ color: "var(--text-secondary)", marginBottom: "2rem" }}>
            The event you're looking for doesn't exist.
          </p>
          <Link to="/events" className="view-on-map-btn" style={{ textDecoration: "none" }}>
            ← Back to Events
          </Link>
        </div>
      </div>
    );
  }

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      day: date.getDate(),
      month: date.toLocaleDateString("en-US", { month: "short" }),
      year: date.getFullYear(),
      time: date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true }),
      fullDate: date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    };
  };

  const dateTime = formatDateTime(event.date);

  const handleRegister = () => {
    setIsAttending(!isAttending);
  };

  return (
    <div className="main-container">
      <div className="content-grid">
        {/* Main Content */}
        <div className="content-main">
          <div className="content-wrapper">
            {/* Back Button */}
            <div style={{ marginBottom: "2rem" }}>
              <Link to="/events" className="view-on-map-btn" style={{ textDecoration: "none", padding: "0.625rem 1.25rem", fontSize: "0.95rem" }}>
                ← Back to Events
              </Link>
            </div>

            {/* Event Details Card */}
            <div className="event-card" style={{ backgroundColor: "white", border: "2px solid var(--border)", padding: "2rem" }}>
              {/* Header with Title and Date Badge */}
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "2rem", marginBottom: "2rem", borderBottom: "2px solid var(--border)", paddingBottom: "1.5rem" }}>
                <div style={{ flex: 1 }}>
                  <h1 style={{ margin: "0 0 1rem 0", fontSize: "2.5rem", color: "var(--aub-red)" }}>
                    {event.name}
                  </h1>
                  <span
                    style={{
                      display: "inline-block",
                      backgroundColor: "white",
                      color: "var(--aub-red)",
                      border: "2px solid var(--aub-red)",
                      padding: "0.5rem 1rem",
                      borderRadius: "var(--radius)",
                      fontSize: "1rem",
                      fontWeight: 600
                    }}
                  >
                    {event.category}
                  </span>
                </div>
                <div style={{ 
                  display: "flex", 
                  flexDirection: "column", 
                  alignItems: "center",
                  backgroundColor: "var(--aub-red)",
                  color: "white",
                  padding: "1rem 1.25rem",
                  borderRadius: "var(--radius)",
                  minWidth: "100px",
                  border: "2px solid var(--aub-red)"
                }}>
                  <div style={{ fontSize: "1rem", fontWeight: 600, textTransform: "uppercase" }}>
                    {dateTime.month}
                  </div>
                  <div style={{ fontSize: "3rem", fontWeight: 700, lineHeight: 1, margin: "0.25rem 0" }}>
                    {dateTime.day}
                  </div>
                  <div style={{ fontSize: "0.9rem", opacity: 0.9 }}>
                    {dateTime.year}
                  </div>
                </div>
              </div>

              {/* Event Info Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "2rem", marginBottom: "2rem" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
                    <svg viewBox="0 0 24 24" fill="var(--aub-red)" style={{ width: "24px", height: "24px" }}>
                      <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <h3 style={{ margin: 0, fontSize: "1.1rem", color: "var(--aub-red)", fontWeight: 600 }}>Date</h3>
                  </div>
                  <p style={{ margin: 0, color: "var(--text-primary)", fontSize: "1rem", paddingLeft: "2rem" }}>
                    {dateTime.fullDate}
                  </p>
                </div>

                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
                    <svg viewBox="0 0 24 24" fill="var(--aub-red)" style={{ width: "24px", height: "24px" }}>
                      <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 style={{ margin: 0, fontSize: "1.1rem", color: "var(--aub-red)", fontWeight: 600 }}>Time</h3>
                  </div>
                  <p style={{ margin: 0, color: "var(--text-primary)", fontSize: "1rem", paddingLeft: "2rem" }}>
                    {dateTime.time}
                  </p>
                </div>

                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
                    <svg viewBox="0 0 24 24" fill="var(--aub-red)" style={{ width: "24px", height: "24px" }}>
                      <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    <h3 style={{ margin: 0, fontSize: "1.1rem", color: "var(--aub-red)", fontWeight: 600 }}>Location</h3>
                  </div>
                  <p style={{ margin: 0, color: "var(--text-primary)", fontSize: "1rem", paddingLeft: "2rem" }}>
                    {event.location}
                  </p>
                </div>

                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
                    <svg viewBox="0 0 24 24" fill="var(--aub-red)" style={{ width: "24px", height: "24px" }}>
                      <path d="M7 7h10M7 12h10M7 17h10" />
                    </svg>
                    <h3 style={{ margin: 0, fontSize: "1.1rem", color: "var(--aub-red)", fontWeight: 600 }}>Category</h3>
                  </div>
                  <p style={{ margin: 0, color: "var(--text-primary)", fontSize: "1rem", paddingLeft: "2rem" }}>
                    {event.category}
                  </p>
                </div>
              </div>

              {/* Description */}
              {event.description && (
                <div style={{ marginTop: "2rem", paddingTop: "2rem", borderTop: "2px solid var(--border)" }}>
                  <h3 style={{ margin: "0 0 1rem 0", fontSize: "1.5rem", color: "var(--aub-red)" }}>About This Event</h3>
                  <p style={{ margin: 0, color: "var(--text-secondary)", lineHeight: "1.8", fontSize: "1rem" }}>
                    {event.description}
                  </p>
                </div>
              )}

              {/* Action Button */}
              <div style={{ marginTop: "2rem", display: "flex", gap: "1rem" }}>
                <button
                  onClick={handleRegister}
                  style={{
                    flex: 1,
                    padding: "1rem 2rem",
                    fontSize: "1rem",
                    border: `2px solid ${isAttending ? "#28a745" : "var(--aub-red)"}`,
                    cursor: "pointer",
                    backgroundColor: isAttending ? "#28a745" : "var(--aub-red)",
                    color: "white",
                    fontWeight: 600,
                    borderRadius: "var(--radius)",
                    transition: "all 0.3s ease"
                  }}
                >
                  {isAttending ? "✓ Attending" : "Register for Event"}
                </button>
                <button
                  style={{
                    padding: "1rem 2rem",
                    fontSize: "1rem",
                    border: "2px solid var(--aub-red)",
                    cursor: "pointer",
                    backgroundColor: "white",
                    color: "var(--aub-red)",
                    fontWeight: 600,
                    borderRadius: "var(--radius)"
                  }}
                >
                  Share Event
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Map Sidebar */}
        <aside className="map-sidebar">
          <div className="map-container">
            <React.Suspense fallback={<div className="map-loading">Loading map…</div>}>
              {isClient && (
                <MapComponent
                  locations={[]}
                  events={[event]}
                  selectedItem={event.id}
                  onItemSelect={() => {}}
                />
              )}
            </React.Suspense>
          </div>
        </aside>
      </div>
    </div>
  );
}