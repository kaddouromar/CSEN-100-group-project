import React from "react";
import { useState } from "react";
import { Link } from "react-router";
import data from "./data.json";
import "./style.css";

export default function EventsPage() {
  const [filter, setFilter] = React.useState<string>("all");

  const categories = React.useMemo(() => {
    const setCats = new Set<string>(data.events.map((e: any) => e.category || "Other"));
    return ["all", ...Array.from(setCats)];
  }, []);

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
            {categories.map((c) => (
              <option key={c} value={c}>
                {c === "all" ? "All categories" : c}
              </option>
            ))}
          </select>
        </div>

        {/* Events Grid - 3 cards per row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2rem", marginBottom: "2rem" }}>
          {filtered.map((event: any) => (
            <div key={event.id} className="event-card" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", marginBottom: "1rem" }}>
                  <div>
                    <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1.25rem", color: "var(--text-primary)" }}>
                      {event.name}
                    </h3>
                    <span
                      style={{
                        display: "inline-block",
                        backgroundColor: "rgba(132, 1, 50, 0.1)",
                        color: "var(--aub-red)",
                        padding: "0.35rem 0.7rem",
                        borderRadius: "var(--radius)",
                        fontSize: "0.8rem",
                        fontWeight: 600
                      }}
                    >
                      {event.category}
                    </span>
                  </div>
                  <div style={{ fontSize: "2rem" }}>
                    {event.icon || "📅"}
                  </div>
                </div>

                <div style={{ marginBottom: "0.875rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-secondary)", marginBottom: "0.5rem" }}>
                    <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: "16px", height: "16px" }}>
                      <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    <span style={{ fontWeight: 500, fontSize: "0.9rem" }}>{event.location}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-secondary)" }}>
                    <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: "16px", height: "16px" }}>
                      <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span style={{ fontWeight: 500, fontSize: "0.9rem" }}>{formatDate(event.date)}</span>
                  </div>
                </div>

                <p style={{ margin: "0 0 1.25rem 0", color: "var(--text-secondary)", lineHeight: "1.5", fontSize: "0.9rem" }}>
                  {event.description || "Join us for this exciting event!"}
                </p>
              </div>

              {/* Button at bottom */}
              <div>
                <Link to={`/event/${event.id}`} style={{ textDecoration: "none", display: "block" }}>
                  <button
                    className="view-on-map-btn"
                    style={{
                      width: "100%",
                      padding: "0.625rem 1rem",
                      fontSize: "0.875rem",
                      border: "none",
                      cursor: "pointer",
                      textDecoration: "none"
                    }}
                  >
                    View Details
                  </button>
                </Link>
              </div>
            </div>
          ))}
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
