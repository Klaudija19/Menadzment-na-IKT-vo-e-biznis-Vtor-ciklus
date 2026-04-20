import React from "react";

function Home({ setPage }) {
  return (
    <div className="auth-layout">
      <div className="auth-hero">
        <p className="eyebrow">Welcome</p>
        <h1 className="auth-hero__title">Bella Luxe</h1>
        <p className="auth-hero__lead">
          Manage appointments, services, and your team in one place.
        </p>
        <div className="auth-hero__actions">
          <button type="button" className="btn btn--primary" onClick={() => setPage("login")}>
            Sign in
          </button>
          <button type="button" className="btn btn--outline" onClick={() => setPage("register")}>
            Create account
          </button>
        </div>
      </div>
      <div className="auth-panel auth-panel--decorative" aria-hidden="true" />
    </div>
  );
}

export default Home;
