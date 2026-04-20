import React, { useState } from "react";
import { apiUrl } from "../api";

function Login({ setUser, setPage }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(apiUrl("login.php"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = await res.json();

      if (data.success) {
        setUser({
          ...data.user,
          role: data.user.role || "employee",
        });
        setPage("appointments");
      } else {
        setError(data.message || "Sign in failed");
      }
    } catch {
      setError("Could not reach the server. Check that the API is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-layout auth-layout--narrow">
      <div className="auth-card">
        <button type="button" className="link-back" onClick={() => setPage("home")}>
          ← Back
        </button>
        <h2 className="auth-card__title">Sign in</h2>
        <p className="auth-card__subtitle">Enter your email and password to continue.</p>

        <form className="form" onSubmit={handleLogin}>
          {error && <div className="form-error">{error}</div>}
          <label className="field">
            <span className="field__label">Email</span>
            <input
              className="field__input"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label className="field">
            <span className="field__label">Password</span>
            <input
              className="field__input"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          <button type="submit" className="btn btn--primary btn--block" disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="auth-card__footer">
          No account yet?{" "}
          <button type="button" className="link-inline" onClick={() => setPage("register")}>
            Register
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;
