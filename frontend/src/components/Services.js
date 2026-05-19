import React, { useEffect, useState } from "react";
import { apiFetch } from "../api";

function Services({ user, isAdmin }) {
  const [list, setList] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");

  const load = async () => {
    const res = await apiFetch("get_services.php", {}, user);
    const data = await res.json();
    setList(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    load();
  }, [user]);

  const reset = () => {
    setName("");
    setPrice("");
    setEditing(null);
    setError("");
  };

  const save = async (e) => {
    e.preventDefault();
    setError("");
    const p = parseFloat(price);
    if (!name.trim() || !Number.isFinite(p) || p <= 0) {
      setError("Enter a valid name and a price greater than 0.");
      return;
    }
    try {
      const url = editing ? "update_service.php" : "add_service.php";
      const body = editing
        ? { id: editing.id, name: name.trim(), price: p }
        : { name: name.trim(), price: p };
      const res = await apiFetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }, user);
      const data = await res.json();
      if (data.error) {
        setError(data.error);
        return;
      }
      reset();
      load();
    } catch {
      setError("Could not save.");
    }
  };

  const startEdit = (s) => {
    setEditing(s);
    setName(s.name);
    setPrice(String(s.price));
    setError("");
  };

  const del = async (id) => {
    if (!window.confirm("Delete this service?")) return;
    setError("");
    try {
      const res = await apiFetch(`delete_service.php?id=${id}`, {}, user);
      const data = await res.json();
      if (data.error) {
        setError(data.error);
        return;
      }
      if (editing?.id === id) reset();
      load();
    } catch {
      setError("Delete failed.");
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Services</h1>
        <p className="page-desc">
          {isAdmin
            ? "Add services, set prices, and manage the salon menu."
            : "View available services and prices (admin can add or edit)."}
        </p>
      </div>

      {isAdmin && (
      <section className="card card--form">
        <h2 className="card__title">{editing ? "Edit service" : "New service"}</h2>
        <form className="form-grid form-grid--3" onSubmit={save}>
          {error && <div className="form-error form-grid__full">{error}</div>}
          <label className="field">
            <span className="field__label">Name</span>
            <input className="field__input" value={name} onChange={(e) => setName(e.target.value)} required />
          </label>
          <label className="field">
            <span className="field__label">Price (MKD)</span>
            <input
              className="field__input"
              type="number"
              min="1"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </label>
          <div className="form-actions form-actions--end">
            <button type="submit" className="btn btn--primary">
              {editing ? "Save" : "Add"}
            </button>
            {editing && (
              <button type="button" className="btn btn--ghost" onClick={reset}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>
      )}

      <section className="card">
        <h2 className="card__title">Service list</h2>
        {list.length === 0 ? (
          <p className="muted">No services yet.</p>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Service</th>
                  <th>Price</th>
                  {isAdmin && <th />}
                </tr>
              </thead>
              <tbody>
                {list.map((s) => (
                  <tr key={s.id}>
                    <td>{s.name}</td>
                    <td>{Number(s.price).toLocaleString("en-US")} MKD</td>
                    {isAdmin && (
                      <td className="data-table__actions">
                        <button type="button" className="btn btn--sm btn--ghost" onClick={() => startEdit(s)}>
                          Edit
                        </button>
                        <button type="button" className="btn btn--sm btn--danger" onClick={() => del(s.id)}>
                          Delete
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default Services;
