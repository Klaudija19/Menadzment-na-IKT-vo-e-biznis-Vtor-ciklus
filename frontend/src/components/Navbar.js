import React from "react";

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
        <button
          type="button"
          className={`nav-link${page === "appointments" ? " nav-link--active" : ""}`}
          onClick={() => setPage("appointments")}
        >
          Appointments
        </button>
        <button
          type="button"
          className={`nav-link${page === "services" ? " nav-link--active" : ""}`}
          onClick={() => setPage("services")}
        >
          Services
        </button>
        <button
          type="button"
          className={`nav-link${page === "employees" ? " nav-link--active" : ""}`}
          onClick={() => setPage("employees")}
        >
          Employees
        </button>
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
