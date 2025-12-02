import React, { useEffect, useState, createContext, useContext } from "react";
import "./style.css";

// Import your data (you can also fetch this from a JSON file)
import data from './data.json';

// Lazy-load the map
const MapComponent = React.lazy(() => import("./MapComponent"));

const EVENTS_PER_PAGE = 5;

// ====== TYPES ======
type XPUser = {
  id: string;
  username: string;
  xp: number;
  isCurrentUser: boolean;
};

type EventItem = {
  id: number;
  name: string;
  category: string;
  location: string;
  date: string;
  hostId?: string;
  participants?: string[];
  maxParticipants?: number;
};

type XPAnimationType = {
  amount: number;
  reason: string;
} | null;

type NotificationType = {
  id: number;
  message: string;
  type?: "success" | "info";
} | null;

type Category = {
  value: string;
  label: string;
};

type Location = {
  id: number;
  name: string;
  lat: number;
  lng: number;
};

type Data = {
  events: EventItem[];
  categories: Category[];
  locations: Location[];
};

// ====== MOCK DATA ======
// Mock user data
const initialUsers: XPUser[] = [
  { id: "1", username: "You", xp: 0, isCurrentUser: true },
  { id: "2", username: "Maria", xp: 120, isCurrentUser: false },
  { id: "3", username: "Alex", xp: 85, isCurrentUser: false },
  { id: "4", username: "Sam", xp: 200, isCurrentUser: false },
  { id: "5", username: "Lena", xp: 65, isCurrentUser: false },
  { id: "6", username: "John", xp: 150, isCurrentUser: false },
  { id: "7", username: "Sarah", xp: 95, isCurrentUser: false },
  { id: "8", username: "Mike", xp: 110, isCurrentUser: false },
  { id: "9", username: "Emma", xp: 75, isCurrentUser: false },
  { id: "10", username: "David", xp: 130, isCurrentUser: false },
  { id: "11", username: "Lisa", xp: 88, isCurrentUser: false },
  { id: "12", username: "Chris", xp: 142, isCurrentUser: false },
];

// ====== CONTEXT TYPES ======
type XPContextType = {
  users: XPUser[];
  addXP: (amount: number, reason: string) => void;
  showXPAnimation: boolean;
  xpAnimation: XPAnimationType;
  events: EventItem[];
  setEvents: React.Dispatch<React.SetStateAction<EventItem[]>>;
  notification: NotificationType;
  showNotification: (message: string, type?: "success" | "info") => void;
  xpGained: number;
  totalUsers: number;
};

// ====== XP CONTEXT ======
const XPContext = createContext<XPContextType | undefined>(undefined);

// XP Provider Component
const XPProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<XPUser[]>(initialUsers);
  const [hydrated, setHydrated] = useState(false);
  const [events, setEvents] = useState<EventItem[]>((data as Data).events || []);
  const [showXPAnimation, setShowXPAnimation] = useState(false);
  const [xpAnimation, setXPAnimation] = useState<XPAnimationType>(null);
  const [notification, setNotification] = useState<NotificationType>(null);
  const [xpGained, setXpGained] = useState(0);
  const [totalUsers, setTotalUsers] = useState(initialUsers.length); // Use actual user count

  useEffect(() => {
    try {
      const saved = localStorage.getItem("leaderboardUsers");
      if (saved) {
        setUsers(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem("leaderboardUsers", JSON.stringify(users));
      setTotalUsers(users.length); // Update total users count
    } catch {
      // ignore
    }
  }, [users, hydrated]);

  const addXP = (amount: number, reason: string) => {
    setUsers((prevUsers) => {
      const updatedUsers = prevUsers.map((user) =>
        user.isCurrentUser ? { ...user, xp: user.xp + amount } : user
      );
      return updatedUsers.sort((a, b) => b.xp - a.xp);
    });

    setXpGained(prev => prev + amount);
    setXPAnimation({ amount, reason });
    setShowXPAnimation(true);
    setTimeout(() => {
      setShowXPAnimation(false);
      setXPAnimation(null);
    }, 3000);
  };

  const showNotification = (message: string, type: "success" | "info" = "success") => {
    const id = Date.now();
    setNotification({ id, message, type });
    setTimeout(() => {
      setNotification((current) => (current?.id === id ? null : current));
    }, 4000);
  };

  return (
    <XPContext.Provider
      value={{
        users,
        addXP,
        showXPAnimation,
        xpAnimation,
        events,
        setEvents,
        notification,
        showNotification,
        xpGained,
        totalUsers,
      }}
    >
      {children}
    </XPContext.Provider>
  );
};

const useXP = () => {
  const context = useContext(XPContext);
  if (context === undefined) {
    throw new Error("useXP must be used within an XPProvider");
  }
  return context;
};

// XP Animation Component
const XPAnimation: React.FC = () => {
  const { showXPAnimation, xpAnimation } = useXP();
  if (!showXPAnimation || !xpAnimation) return null;

  return (
    <div className="xp-animation">
      <div className="xp-popup">
        <span className="xp-fire">🔥</span>
        <span className="xp-amount">+{xpAnimation.amount} XP</span>
        <span className="xp-reason">{xpAnimation.reason}</span>
      </div>
    </div>
  );
};

// Notification Bar Component
const NotificationBar: React.FC = () => {
  const { notification } = useXP();
  if (!notification) return null;

  return (
    <div className={`notification-bar ${notification.type || "success"}`}>
      {notification.message}
    </div>
  );
};

// ====== LEADERBOARD RANKING COMPONENT ======
interface Player {
  rank: number | 'medal';
  medal?: string;
  name: string;
  xp: number;
  isCurrentUser: boolean;
  id: string;
}

interface LeaderboardRankingProps {
  users: XPUser[];
  onSelectUser: (userId: string) => void;
}

const LeaderboardRanking: React.FC<LeaderboardRankingProps> = ({ users, onSelectUser }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const ranksPerPage = 5;

  // Sort users by XP and create player objects
  const players: Player[] = users
  .sort((a, b) => b.xp - a.xp)
  .map((user, index) => {
    const rank = index + 1;
    if (rank <= 3) {
      return {
        rank: 'medal' as const,
        medal: rank === 1 ? '🥇' : rank === 2 ? '🥈' : '🥉', // Medals for leaderboard
        name: user.username,
        xp: user.xp,
        isCurrentUser: user.isCurrentUser,
        id: user.id
      };
    } else {
      return {
        rank,
        name: user.username,
        xp: user.xp,
        isCurrentUser: user.isCurrentUser,
        id: user.id
      };
    }
  });

  // Calculate pagination
  const totalPages = Math.ceil(players.length / ranksPerPage);
  const startIndex = (currentPage - 1) * ranksPerPage;
  const endIndex = startIndex + ranksPerPage;
  const currentPlayers = players.slice(startIndex, endIndex);

  const getRankShadowClass = (rank: number | 'medal', medal?: string) => {
  if (rank === 'medal') {
    switch (medal) {
      case '🥇': return 'rank-gold';
      case '🥈': return 'rank-silver';
      case '🥉': return 'rank-bronze';
      default: return 'rank-normal';
    }
  } else {
    if (rank <= 3) {
      return rank === 1 ? 'rank-gold' : rank === 2 ? 'rank-silver' : 'rank-bronze';
    } else {
      return 'rank-normal';
    }
  }
};

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="ranking-container">
      <h2 className="ranking-title">LEADERBOARD RANKINGS</h2>
      <div className="ranking-list">
        {currentPlayers.map((player, index) => (
          <div
            key={player.id}
            className={`ranking-item ${player.isCurrentUser ? 'current-user' : ''} ${getRankShadowClass(player.rank, player.medal)}`}
            onClick={() => onSelectUser(player.id)}
          >
            <div className="rank-col">
              {player.rank === 'medal' ? (
                <span className="medal-icon">{player.medal}</span>
              ) : (
                <span className="rank-number">#{player.rank}</span>
              )}
            </div>

           <div className="name-col">
  {player.isCurrentUser ? (
    <span className="you-label">You</span>
  ) : (
    <span className="player-name">{player.name}</span>
  )}
</div>

            <div className="xp-col">
              <span className="player-xp">{player.xp} XP</span>
            </div>
          </div>
        ))}
      </div>
      
      {/* Pagination Controls - This was missing! */}
      {totalPages > 1 && (
        <div className="pagination-controls">
          <button 
            className={`pagination-arrow ${currentPage === 1 ? 'disabled' : ''}`}
            onClick={handlePrevPage}
            disabled={currentPage === 1}
          >
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path fill="currentColor" d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
            </svg>
          </button>
          
          <span className="pagination-page">
            Page {currentPage} of {totalPages}
          </span>
          
          <button 
            className={`pagination-arrow ${currentPage === totalPages ? 'disabled' : ''}`}
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path fill="currentColor" d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};
// ====== LEADERBOARD PAGE ======
const LeaderboardPage: React.FC<{
  onBack: () => void;
  onSelectUser: (userId: string) => void;
}> = ({ onBack, onSelectUser }) => {
  const { users, xpGained, totalUsers } = useXP();
  const [showXPInfo, setShowXPInfo] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [animationStage, setAnimationStage] = useState(0); // 0: initial, 1: podium, 2: stats, 3: ranking

  const sortedUsers = [...users].sort((a, b) => b.xp - a.xp);
  const [topPlayer, secondPlayer, thirdPlayer, ...otherPlayers] = sortedUsers;

  // Find current user's rank
  const currentUser = users.find(user => user.isCurrentUser);
  const currentUserRank = users.sort((a, b) => b.xp - a.xp).findIndex(user => user.id === currentUser?.id) + 1;

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const renderMedal = (rank: number) => {
    if (rank === 1) return <span className="medal-icon gold">🏆</span>; // Trophy for 1st place
    if (rank === 2) return <span className="medal-icon silver">🥈</span>; // Silver medal for 2nd
    if (rank === 3) return <span className="medal-icon bronze">🥉</span>; // Bronze medal for 3rd
    return null;
  };

  // Animation sequence on component mount
  useEffect(() => {
    // Start with podium
    const timer1 = setTimeout(() => setAnimationStage(1), 300);
    // Then show stats message
    const timer2 = setTimeout(() => setAnimationStage(2), 1200);
    // Finally show ranking table
    const timer3 = setTimeout(() => setAnimationStage(3), 2000);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <div className="app">
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-brand">
            <span className="brand-text">AUB Mediterraneo</span>
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
                <button className="dropdown-item" onClick={() => { onBack(); setIsMenuOpen(false); }}>
                  <svg className="dropdown-icon" viewBox="0 0 24 24" width="20" height="20">
                    <path fill="currentColor" d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19a2 2 0 002 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z" />
                  </svg>
                  Events
                </button>
                <button className="dropdown-item leaderboard-btn" onClick={() => setIsMenuOpen(false)}>
                  <svg className="dropdown-icon" viewBox="0 0 24 24" width="20" height="20">
                    <path fill="currentColor" d="M16 11V3H8v6H2v12h20V11h-6zm-6-6h4v14h-4V5zm-6 6h4v8H4v-8zm16 8h-4v-6h4v6z" />
                  </svg>
                  Leaderboard
                </button>
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
        </div>
      </nav>

      <XPAnimation />
      <NotificationBar />

      {isMenuOpen && <div className="menu-overlay" onClick={toggleMenu}></div>}

      <div className="main-container leaderboard-fullscreen">
        <div className="content-wrapper-fullscreen">
          <header className="page-header leaderboard-header">
            <button className="back-button" onClick={onBack}>
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
              </svg>
            </button>
            <h1 className="page-title leaderboard-title">Leaderboard</h1>
            <button className="info-button" onClick={() => setShowXPInfo(!showXPInfo)}>
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
              </svg>
            </button>
          </header>

          {showXPInfo && (
            <div className="xp-info-modal">
              <div className="xp-info-content">
                <div className="xp-info-header">
                  <h3>How to Earn XP</h3>
                  <button className="close-info" onClick={() => setShowXPInfo(false)}>
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                    </svg>
                  </button>
                </div>
                <div className="xp-info-body">
                  <div className="xp-rule">
                    <span className="xp-action">Joining Events</span>
                    <span className="xp-amount">+10 XP</span>
                  </div>
                  <div className="xp-rule">
                    <span className="xp-action">Hosting Events</span>
                    <span className="xp-amount">+30 XP</span>
                  </div>
                </div>
              </div>
              <div className="modal-overlay" onClick={() => setShowXPInfo(false)}></div>
            </div>
          )}

          <div className="leaderboard-content-fullscreen">
            {/* Podium Section - appears first */}
            {topPlayer && (
              <div className={`podium-section ${animationStage >= 1 ? 'animate-in' : ''}`}>
                <div className="podium-container">
                  {secondPlayer && (
                    <div className="podium-card podium-second rank-silver" onClick={() => onSelectUser(secondPlayer.id)}>
                      <div className="podium-avatar-container">
                        <div className="podium-avatar podium-avatar-silver">
                          {secondPlayer.username.charAt(0).toUpperCase()}
                        </div>
                      </div>
                      <div className="podium-name">
                        {secondPlayer.isCurrentUser ? (
                          <span className="podium-you-badge">You</span>
                        ) : (
                          secondPlayer.username
                        )}
                      </div>
                      <div className="podium-badge">
                        <div className="badge-icon">{renderMedal(2)}</div>
                      </div>
                      <div className="podium-xp">
                        <span className="xp-value">{secondPlayer.xp} XP</span>
                      </div>
                    </div>
                  )}

                  <div className="podium-card podium-first rank-gold" onClick={() => onSelectUser(topPlayer.id)}>
                    <div className="podium-avatar-container">
                      <div className="podium-avatar podium-avatar-gold">
                        {topPlayer.username.charAt(0).toUpperCase()}
                      </div>
                    </div>
                    <div className="podium-name">
                      {topPlayer.isCurrentUser ? (
                        <span className="podium-you-badge">You</span>
                      ) : (
                        topPlayer.username
                      )}
                    </div>
                    <div className="podium-badge podium-badge-large">
                      <div className="badge-icon">{renderMedal(1)}</div>
                    </div>
                    <div className="podium-xp podium-xp-large">
                      <span className="xp-value">{topPlayer.xp} XP</span>
                    </div>
                  </div>

                  {thirdPlayer && (
                    <div className="podium-card podium-third rank-bronze" onClick={() => onSelectUser(thirdPlayer.id)}>
                      <div className="podium-avatar-container">
                        <div className="podium-avatar podium-avatar-bronze">
                          {thirdPlayer.username.charAt(0).toUpperCase()}
                        </div>
                      </div>
                      <div className="podium-name">
                        {thirdPlayer.isCurrentUser ? (
                          <span className="podium-you-badge">You</span>
                        ) : (
                          thirdPlayer.username
                        )}
                      </div>
                      <div className="podium-badge">
                        <div className="badge-icon">{renderMedal(3)}</div>
                      </div>
                      <div className="podium-xp">
                        <span className="xp-value">{thirdPlayer.xp} XP</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Original daily stats message - appears second */}
                <div className={`daily-stats ${animationStage >= 2 ? 'animate-in' : ''}`}>
                  You earned <span className="stats-xp">{xpGained} XP</span> today and you are ranked{" "}
                  <span className="stats-rank">#{currentUserRank}</span> out of{" "}
                  <span className="stats-users">{totalUsers} users</span>
                </div>
              </div>
            )}

            {/* Ranking Table - appears third */}
            <div className={`ranking-section ${animationStage >= 3 ? 'animate-in' : ''}`}>
              <LeaderboardRanking users={users} onSelectUser={onSelectUser} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ====== USER PROFILE PAGE ======
const UserProfilePage: React.FC<{
  userId: string | null;
  onBackToLeaderboard: () => void;
}> = ({ userId, onBackToLeaderboard }) => {
  const { users, events } = useXP();

  if (!userId) {
    return (
      <div className="app">
        <div className="main-container">
          <p>No user selected.</p>
          <button onClick={onBackToLeaderboard}>Back to Leaderboard</button>
        </div>
      </div>
    );
  }

  const user = users.find((u: XPUser) => u.id === userId);
  if (!user) {
    return (
      <div className="app">
        <div className="main-container">
          <p>User not found.</p>
          <button onClick={onBackToLeaderboard}>Back to Leaderboard</button>
        </div>
      </div>
    );
  }

  const hostedEvents = events.filter((e: EventItem) => e.hostId === user.id);
  const joinedEvents = events.filter((e: EventItem) => (e.participants || []).includes(user.id));

  return (
    <div className="app">
      <XPAnimation />
      <NotificationBar />

      <div className="main-container profile-container">
        <header className="profile-header">
          <button className="back-button" onClick={onBackToLeaderboard}>
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
            </svg>
          </button>
          <h1 className="page-title">{user.username}'s Profile ({user.xp} XP)</h1>
        </header>
        <section className="profile-section">
          <h2>Hosted Events</h2>
          {hostedEvents.length === 0 ? (
            <p className="profile-empty">No hosted events yet.</p>
          ) : (
            <ul className="profile-event-list">
              {hostedEvents.map((event: EventItem) => (
                <li key={event.id}>
                  <strong>{event.name}</strong> — {event.location} on {new Date(event.date).toLocaleDateString()}
                </li>
              ))}
            </ul>
          )}
        </section>
        <section className="profile-section">
          <h2>Joined Events</h2>
          {joinedEvents.length === 0 ? (
            <p className="profile-empty">No joined events yet.</p>
          ) : (
            <ul className="profile-event-list">
              {joinedEvents.map((event: EventItem) => (
                <li key={event.id}>
                  <strong>{event.name}</strong> — {event.location} on {new Date(event.date).toLocaleDateString()}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
};

// ====== MAIN EVENTS PAGE ======
const EventsMain: React.FC<{ onNavigateToLeaderboard: () => void }> = ({ onNavigateToLeaderboard }) => {
  const { events } = useXP();
  const [isClient, setIsClient] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [filteredEvents, setFilteredEvents] = useState<EventItem[]>(events);
  const [visibleEvents, setVisibleEvents] = useState<EventItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreEvents, setHasMoreEvents] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<number | null>(null);

  useEffect(() => setIsClient(true), []);

  useEffect(() => {
    const base = selectedCategory === "all" ? events : events.filter((event) => event.category === selectedCategory);
    setFilteredEvents(base);
    setCurrentPage(1);
    setSelectedItem(null);
  }, [selectedCategory, events]);

  useEffect(() => {
    const endIndex = currentPage * EVENTS_PER_PAGE;
    setVisibleEvents(filteredEvents.slice(0, endIndex));
    setHasMoreEvents(endIndex < filteredEvents.length);
  }, [filteredEvents, currentPage]);

  const loadMoreEvents = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleItemClick = (itemId: number) => {
    setSelectedItem(itemId === selectedItem ? null : itemId);
  };

  const getCategoryLabel = (categoryValue: string) => {
    const category = (data as Data).categories?.find((cat: Category) => cat.value === categoryValue);
    return category ? category.label : categoryValue;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="app">
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-brand">
            <span className="brand-text">AUB Mediterraneo</span>
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
                <button className="dropdown-item leaderboard-btn" onClick={() => { onNavigateToLeaderboard(); setIsMenuOpen(false); }}>
                  <svg className="dropdown-icon" viewBox="0 0 24 24" width="20" height="20">
                    <path fill="currentColor" d="M16 11V3H8v6H2v12h20V11h-6zm-6-6h4v14h-4V5zm-6 6h4v8H4v-8zm16 8h-4v-6h4v6z" />
                  </svg>
                  Leaderboard
                </button>
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
        </div>
      </nav>

      <XPAnimation />
      <NotificationBar />

      {isMenuOpen && <div className="menu-overlay" onClick={toggleMenu}></div>}

      <div className="main-container">
        <div className="content-grid">
          <main className="content-main">
            <div className="content-wrapper">
              <header className="page-header">
                <h1 className="page-title">Campus & Mediterranean Events</h1>
                <p className="page-subtitle">
                  Discover curated events for the AUB Mediterraneo community —
                  cultural nights, talks, workshops and local meetups tailored to students and alumni.
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
                            onClick={() => handleItemClick(event.id)}
                            style={{ cursor: 'pointer' }}
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
                              <path fill="currentColor" d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19a2 2 0 002 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11zM7 10h5v5H7z" />
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
                      {(data as Data).categories.map((category: Category) => (
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
                    locations={(data as Data).locations}
                    events={(data as Data).events}
                    selectedItem={selectedItem}
                    onItemSelect={setSelectedItem}
                  />
                )}
              </React.Suspense>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

// ====== MAIN APP COMPONENT ======
export default function Home() {
  const [currentView, setCurrentView] = useState<"events" | "leaderboard" | "profile">("events");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const renderView = () => {
    switch (currentView) {
      case "leaderboard":
        return (
          <LeaderboardPage
            onBack={() => setCurrentView("events")}
            onSelectUser={(userId) => {
              setSelectedUserId(userId);
              setCurrentView("profile");
            }}
          />
        );
      case "profile":
        return (
          <UserProfilePage
            userId={selectedUserId}
            onBackToLeaderboard={() => setCurrentView("leaderboard")}
          />
        );
      case "events":
      default:
        return (
          <EventsMain
            onNavigateToLeaderboard={() => setCurrentView("leaderboard")}
          />
        );
    }
  };

  return <XPProvider>{renderView()}</XPProvider>;
}