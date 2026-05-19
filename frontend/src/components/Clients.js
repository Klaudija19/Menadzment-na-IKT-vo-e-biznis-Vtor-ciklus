import React, { useCallback, useEffect, useState } from "react";
import { apiFetch, parseApiList, parseApiResponse } from "../api";

function Clients({ user, isAdmin }) {
  const [list, setList] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [detail, setDetail] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadList = useCallback(async () => {
    const res = await apiFetch("get_clients.php", {}, user);
    const { list, error: err } = await parseApiList(res);
    setList(list);
    if (err) setError(err);
  }, [user]);

  const loadDetail = useCallback(
    async (id) => {
      if (!id) {
        setDetail(null);
        return;
      }
      const res = await apiFetch(`get_client.php?id=${id}`, {}, user);
      const { ok, data, error: err } = await parseApiResponse(res);
      if (!ok) {
        setError(err);
        return;
      }
      setDetail(data);
      setSelectedId(id);
    },
    [user]
  );

  useEffect(() => {
    loadList();
  }, [loadList]);

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setPhone("");
    setEmail("");
    setNotes("");
    setEditingId(null);
    setError("");
    setMessage("");
  };

  const startEdit = (c) => {
    setEditingId(c.id);
    setFirstName(c.first_name || "");
    setLastName(c.last_name || "");
    setPhone(c.phone || "");
    setEmail(c.email || "");
    setNotes(c.notes || "");
    setSelectedId(c.id);
    loadDetail(c.id);
    setError("");
    setMessage("");
  };

  const save = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    if (!firstName.trim() || !lastName.trim()) {
      setError("First and last name are required.");
      return;
    }
    const payload = {
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      phone: phone.trim(),
      email: email.trim(),
      notes: notes.trim(),
    };
    try {
      const url = editingId ? "update_client.php" : "add_client.php";
      const body = editingId ? { ...payload, id: editingId } : payload;
      const res = await apiFetch(
        url,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        },
        user
      );
      const { ok, data, error: err } = await parseApiResponse(res);
      if (!ok) {
        setError(err);
        return;
      }
      setMessage(data?.message || "Saved.");
      const savedId = editingId || data.id;
      resetForm();
      await loadList();
      if (savedId) loadDetail(savedId);
    } catch {
      setError("Could not save.");
    }
  };

  const del = async (id) => {
    if (!window.confirm("Delete this client?")) return;
    setError("");
    try {
      const res = await apiFetch(`delete_client.php?id=${id}`, {}, user);
      const { ok, error: err } = await parseApiResponse(res);
      if (!ok) {
        setError(err);
        return;
      }
      if (selectedId === id) {
        setSelectedId(null);
        setDetail(null);
      }
      if (editingId === id) resetForm();
      loadList();
    } catch {
      setError("Delete failed.");
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Clients</h1>
        <p className="page-desc">
          {isAdmin
            ? "Client database: contact details, preferences, visit count, and appointment history."
            : "View client profiles and history (admin can add or edit clients)."}
        </p>
      </div>

      {isAdmin && (
      <section className="card card--form">
        <h2 className="card__title">{editingId ? "Edit client" : "New client"}</h2>
        <form className="form-grid" onSubmit={save}>
          {message && <div className="form-success form-grid__full">{message}</div>}
          {error && <div className="form-error form-grid__full">{error}</div>}

          <label className="field">
            <span className="field__label">First name</span>
            <input className="field__input" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
          </label>
          <label className="field">
            <span className="field__label">Last name</span>
            <input className="field__input" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
          </label>
          <label className="field">
            <span className="field__label">Phone</span>
            <input className="field__input" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="070 …" />
          </label>
          <label className="field">
            <span className="field__label">Email</span>
            <input className="field__input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          <label className="field form-grid__full">
            <span className="field__label">Notes / preferences</span>
            <textarea
              className="field__input field__input--textarea"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Allergies, preferred stylist, special requests…"
            />
          </label>
          <div className="form-actions form-grid__full">
            <button type="submit" className="btn btn--primary">
              {editingId ? "Save changes" : "Add client"}
            </button>
            {editingId && (
              <button type="button" className="btn btn--ghost" onClick={resetForm}>
                Cancel edit
              </button>
            )}
          </div>
        </form>
      </section>
      )}

      <div className="split-layout">
        <section className="card">
          <h2 className="card__title">All clients</h2>
          {list.length === 0 ? (
            <p className="muted">{isAdmin ? "No clients yet. Add one above." : "No clients yet."}</p>
          ) : (
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Visits</th>
                    {isAdmin && <th />}
                  </tr>
                </thead>
                <tbody>
                  {list.map((c) => (
                    <tr key={c.id} className={selectedId === c.id ? "data-table__row--active" : ""}>
                      <td>
                        <button
                          type="button"
                          className="link-inline link-inline--table"
                          onClick={() => loadDetail(c.id)}
                        >
                          {c.full_name || `${c.first_name} ${c.last_name}`}
                        </button>
                      </td>
                      <td>{c.phone || "—"}</td>
                      <td>{c.visit_count ?? 0}</td>
                      {isAdmin && (
                        <td className="data-table__actions">
                          <button type="button" className="btn btn--sm btn--ghost" onClick={() => startEdit(c)}>
                            Edit
                          </button>
                          <button type="button" className="btn btn--sm btn--danger" onClick={() => del(c.id)}>
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

        <section className="card">
          <h2 className="card__title">Client profile</h2>
          {!detail?.client ? (
            <p className="muted">Select a client to see history and services.</p>
          ) : (
            <>
              <dl className="detail-list">
                <div>
                  <dt>Name</dt>
                  <dd>{detail.client.full_name}</dd>
                </div>
                <div>
                  <dt>Phone</dt>
                  <dd>{detail.client.phone || "—"}</dd>
                </div>
                <div>
                  <dt>Email</dt>
                  <dd>{detail.client.email || "—"}</dd>
                </div>
                <div>
                  <dt>Visit count</dt>
                  <dd>{detail.client.visit_count}</dd>
                </div>
                <div>
                  <dt>Notes</dt>
                  <dd>{detail.client.notes || "—"}</dd>
                </div>
              </dl>

              {detail.service_types?.length > 0 && (
                <>
                  <h3 className="card__subtitle">Services received</h3>
                  <ul className="tag-list">
                    {detail.service_types.map((s) => (
                      <li key={s} className="tag">
                        {s}
                      </li>
                    ))}
                  </ul>
                </>
              )}

              <h3 className="card__subtitle">Appointment history</h3>
              {detail.appointments?.length === 0 ? (
                <p className="muted">No appointments yet.</p>
              ) : (
                <div className="table-wrap">
                  <table className="data-table data-table--compact">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Service</th>
                        <th>Employee</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detail.appointments.map((a) => (
                        <tr key={a.id}>
                          <td>{a.date}</td>
                          <td>{String(a.time).slice(0, 5)}</td>
                          <td>{a.service_name || "—"}</td>
                          <td>{a.employee_name || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}

export default Clients;
