import React, { useEffect, useState } from "react";
import { apiUrl } from "../api";

function Employees() {
  const [list, setList] = useState([]);
  const [name, setName] = useState("");
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");

  const load = async () => {
    const res = await fetch(apiUrl("get_employees.php"));
    const data = await res.json();
    setList(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    load();
  }, []);

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
      const url = editing ? apiUrl("update_employee.php") : apiUrl("add_employee.php");
      const body = editing ? { id: editing.id, name: name.trim() } : { name: name.trim() };
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
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
      const res = await fetch(apiUrl(`delete_employee.php?id=${id}`));
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
          Stylists and staff who can be selected when booking appointments (separate from login
          accounts).
        </p>
      </div>

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
                  <th />
                </tr>
              </thead>
              <tbody>
                {list.map((em) => (
                  <tr key={em.id}>
                    <td>{em.name}</td>
                    <td className="data-table__actions">
                      <button type="button" className="btn btn--sm btn--ghost" onClick={() => startEdit(em)}>
                        Edit
                      </button>
                      <button type="button" className="btn btn--sm btn--danger" onClick={() => del(em.id)}>
                        Delete
                      </button>
                    </td>
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
