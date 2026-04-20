import React, { useState } from "react";
import { apiUrl } from "../api";

function Register({ setPage }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const res = await fetch(apiUrl("register.php"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
        }),
      });
      const data = await res.json();

      if (data.error) {
        setError(data.error);
        return;
      }

      setSuccess("Account created. You can sign in now.");
      setTimeout(() => setPage("login"), 1200);
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
        <h2 className="auth-card__title">Register</h2>
        <p className="auth-card__subtitle">
          This creates a <strong>staff login</strong> (default role: employee). After you sign in,
          use <strong>Employees</strong> for people who appear in appointment booking, and{" "}
          <strong>Services</strong> to add or edit treatments — separate from this login account.
        </p>

        <form className="form" onSubmit={handleRegister}>
          {error && <div className="form-error">{error}</div>}
          {success && <div className="form-success">{success}</div>}
          <label className="field">
            <span className="field__label">Full name</span>
            <input
              className="field__input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              minLength={2}
            />
          </label>
          <label className="field">
            <span className="field__label">Email</span>
            <input
              className="field__input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label className="field">
            <span className="field__label">Password (min. 6 characters)</span>
            <input
              className="field__input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </label>
          <button type="submit" className="btn btn--primary btn--block" disabled={loading}>
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="auth-card__footer">
          Already have an account?{" "}
          <button type="button" className="link-inline" onClick={() => setPage("login")}>
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}

export default Register;
