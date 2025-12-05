import React from "react";
import { useState } from "react";
import { Link } from "react-router";
import data from "./data.json";
import "./style.css";

export default function EventsPage() {
  const [filter, setFilter] = React.useState<string>("all");

  const filtered = React.useMemo(() => {
    if (filter === "all") return data.events;
    return data.events.filter((e: any) => e.category === filter);
  }, [filter]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
      year: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      month: date.toLocaleString("default", { month: "short" }),
      day: date.getDate(),
      year: date.getFullYear(),
      time: date.toLocaleString("default", { hour: "2-digit", minute: "2-digit", hour12: true }),
    };
  };

  return (
    <div className="main-container">
      <div className="content-wrapper">
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
          <div>
            <h1 style={{ margin: "0 0 0.5rem 0", fontSize: "2.5rem" }}>Events</h1>
            <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: "1.125rem" }}>
              Discover upcoming events and activities
            </p>
          </div>
          <Link to="/" className="view-on-map-btn" style={{ textDecoration: "none", whiteSpace: "nowrap", padding: "0.625rem 1.25rem", fontSize: "0.95rem" }}>
            ← Home
          </Link>
        </div>

        {/* Filter Section */}
        <div style={{ marginBottom: "2.5rem", display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
          <label style={{ color: "var(--text-secondary)", fontWeight: 600, fontSize: "1rem" }}>Filter by category:</label>
          <select
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
            }}
            style={{
              padding: "0.625rem 0.875rem",
              borderRadius: "var(--radius)",
              border: "2px solid var(--border)",
              fontSize: "0.95rem",
              fontWeight: 500,
              backgroundColor: "var(--surface)",
              color: "var(--text-primary)",
              cursor: "pointer"
            }}
          >
            {data.categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* Events Grid - 3 cards per row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2rem", marginBottom: "2rem" }}>
          {filtered.map((event: any) => {
            const dateTime = formatDateTime(event.date);
            return (
              <div key={event.id} className="event-card" style={{ display: "flex", flexDirection: "column", height: "100%", border: "2px solid var(--border)", backgroundColor: "white" }}>
                {/* Title + Category + Date Badge */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", marginBottom: "1.5rem" }}>
                  <h3 style={{ margin: 0, fontSize: "1.25rem", color: "var(--aub-red)" }}>
                    {event.name}
                  </h3>
                  <span
                    style={{
                      display: "inline-block",
                      backgroundColor: "white",
                      color: "var(--aub-red)",
                      border: "2px solid var(--aub-red)",
                      padding: "0.35rem 0.7rem",
                      borderRadius: "var(--radius)",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      margin: "0 auto",
                      whiteSpace: "nowrap"
                    }}
                  >
                    {event.category}
                  </span>
                  <div style={{ 
                    display: "flex", 
                    flexDirection: "column", 
                    alignItems: "center",
                    backgroundColor: "var(--aub-red)",
                    color: "white",
                    padding: "0.5rem 0.75rem",
                    borderRadius: "var(--radius)",
                    minWidth: "60px",
                    flexShrink: 0,
                    border: "2px solid var(--aub-red)"
                  }}>
                    <div style={{ fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase" }}>
                      {dateTime.month}
                    </div>
                    <div style={{ fontSize: "1.75rem", fontWeight: 700, lineHeight: 1 }}>
                      {dateTime.day}
                    </div>
                    <div style={{ fontSize: "0.7rem", opacity: 0.9 }}>
                      {dateTime.year}
                    </div>
                  </div>
                </div>

                {/* Location and Time - Centered */}
                <div style={{ marginBottom: "1.5rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem", textAlign: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--aub-red)", justifyContent: "center" }}>
                    <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: "18px", height: "18px" }}>
                      <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    <span style={{ fontWeight: 600, fontSize: "0.95rem" }}>{event.location}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--aub-red)", justifyContent: "center" }}>
                    <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: "18px", height: "18px" }}>
                      <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span style={{ fontWeight: 600, fontSize: "0.95rem" }}>{dateTime.time}</span>
                  </div>
                </div>

                <p style={{ margin: "0 0 auto 0", color: "var(--text-secondary)", lineHeight: "1.5", fontSize: "0.9rem", textAlign: "center" }}>
                  {event.description || "Join us for this exciting event!"}
                </p>

                {/* Button at bottom */}
                <div style={{ marginTop: "1.5rem" }}>
                  <Link to={`/event/${event.id}`} style={{ textDecoration: "none", display: "block" }}>
                    <button
                      className="view-on-map-btn"
                      style={{
                        width: "100%",
                        padding: "0.625rem 1rem",
                        fontSize: "0.875rem",
                        border: "2px solid var(--aub-red)",
                        cursor: "pointer",
                        backgroundColor: "var(--aub-red)",
                        color: "white",
                        fontWeight: 600,
                        borderRadius: "var(--radius)"
                      }}
                    >
                      View Details
                    </button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "3rem 1rem" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📅</div>
            <h3 style={{ color: "var(--text-primary)", marginBottom: "0.5rem" }}>No events found</h3>
            <p style={{ color: "var(--text-secondary)" }}>Try selecting a different category</p>
          </div>
        )}
      </div>
    </div>
  );
}
