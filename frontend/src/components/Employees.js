import React, { useEffect, useState } from "react";
import { apiFetch } from "../api";

function Employees({ user, isAdmin }) {
  const [list, setList] = useState([]);
  const [name, setName] = useState("");
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");

  const load = async () => {
    const res = await apiFetch("get_employees.php", {}, user);
    const data = await res.json();
    setList(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    load();
  }, [user]);

  const reset = () => {
    setName("");
    setEditing(null);
    setError("");
  };

  const save = async (e) => {
    e.preventDefault();
    setError("");
    if (!name.trim()) {
      setError("Enter a name.");
      return;
    }
    try {
      const url = editing ? "update_employee.php" : "add_employee.php";
      const body = editing ? { id: editing.id, name: name.trim() } : { name: name.trim() };
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

  const startEdit = (row) => {
    setEditing(row);
    setName(row.name);
    setError("");
  };

  const del = async (id) => {
    if (!window.confirm("Delete this employee?")) return;
    setError("");
    try {
      const res = await apiFetch(`delete_employee.php?id=${id}`, {}, user);
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
        <h1 className="page-title">Employees</h1>
        <p className="page-desc">
          {isAdmin
            ? "Stylists and staff for appointment booking (separate from login accounts)."
            : "View staff available for appointments (admin can add or edit)."}
        </p>
      </div>

      {isAdmin && (
      <section className="card card--form">
        <h2 className="card__title">{editing ? "Edit employee" : "New employee"}</h2>
        <form className="form-grid form-grid--2" onSubmit={save}>
          {error && <div className="form-error form-grid__full">{error}</div>}
          <label className="field">
            <span className="field__label">Full name</span>
            <input className="field__input" value={name} onChange={(e) => setName(e.target.value)} required />
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
        <h2 className="card__title">Employee list</h2>
        {list.length === 0 ? (
          <p className="muted">No employees yet.</p>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  {isAdmin && <th />}
                </tr>
              </thead>
              <tbody>
                {list.map((em) => (
                  <tr key={em.id}>
                    <td>{em.name}</td>
                    {isAdmin && (
                      <td className="data-table__actions">
                        <button type="button" className="btn btn--sm btn--ghost" onClick={() => startEdit(em)}>
                          Edit
                        </button>
                        <button type="button" className="btn btn--sm btn--danger" onClick={() => del(em.id)}>
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

export default Employees;
