import React from "react";

const NAV_ITEMS = [
  { id: "appointments", label: "Appointments" },
  { id: "services", label: "Services" },
  { id: "employees", label: "Employees" },
  { id: "clients", label: "Clients" },
];

function Navbar({ page, setPage, setUser, user, isAdmin }) {
  const handleLogout = () => {
    setUser(null);
    setPage("home");
  };

  return (
    <header className="navbar">
      <button
        type="button"
        className="navbar__brand navbar__brand--link"
        onClick={() => setPage("appointments")}
        title="Go to appointments"
      >
        <span className="navbar__logo">Bella Luxe</span>
        <span className="navbar__tagline">Beauty Salon</span>
      </button>

      <nav className="navbar__nav" aria-label="Main">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`nav-link${page === item.id ? " nav-link--active" : ""}`}
            onClick={() => setPage(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div className="navbar__user">
        <div className="navbar__user-text">
          <span className="navbar__user-name">{user.name}</span>
          <span className={`role-badge role-badge--${isAdmin ? "admin" : "staff"}`}>
            {isAdmin ? "Administrator" : "Staff"}
          </span>
        </div>
        <button type="button" className="btn btn--ghost btn--sm" onClick={handleLogout}>
          Sign out
        </button>
      </div>
    </header>
  );
}

export default Navbar;
