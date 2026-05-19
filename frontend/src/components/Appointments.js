import React, { useCallback, useEffect, useState } from "react";
import { apiFetch, parseApiList, parseApiResponse } from "../api";

function Appointments({ user, isAdmin }) {
  const [list, setList] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [services, setServices] = useState([]);
  const [clients, setClients] = useState([]);
  const [filterEmployeeId, setFilterEmployeeId] = useState("");

  const [clientId, setClientId] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadRefs = useCallback(async () => {
    const [er, sr, cr] = await Promise.all([
      apiFetch("get_employees.php", {}, user),
      apiFetch("get_services.php", {}, user),
      apiFetch("get_clients.php", {}, user),
    ]);
    const emp = await parseApiList(er);
    const svc = await parseApiList(sr);
    const cli = await parseApiList(cr);
    setEmployees(emp.list);
    setServices(svc.list);
    setClients(cli.list);
    const err = emp.error || svc.error || cli.error;
    if (err) setError(err);
  }, [user]);

  const loadAppointments = useCallback(async () => {
    const q =
      filterEmployeeId !== ""
        ? `get_appointments.php?employee_id=${encodeURIComponent(filterEmployeeId)}`
        : "get_appointments.php";
    const res = await apiFetch(q, {}, user);
    const { list: rows, error: err } = await parseApiList(res);
    setList(rows);
    if (err) setError(err);
  }, [filterEmployeeId, user]);

  useEffect(() => {
    loadRefs();
  }, [loadRefs]);

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  const resetForm = () => {
    setClientId("");
    setServiceId("");
    setEmployeeId("");
    setDate("");
    setTime("");
    setEditingId(null);
  };

  const submit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    const cid = parseInt(clientId, 10);
    const sid = parseInt(serviceId, 10);
    const eid = parseInt(employeeId, 10);
    if (!cid || !date || !time || !sid || !eid) {
      setError("Please fill in all fields. Add clients first (admin → Clients).");
      return;
    }

    const payload = {
      client_id: cid,
      service_id: sid,
      employee_id: eid,
      date,
      time,
    };

    try {
      const url = editingId ? "update_appointment.php" : "add_appointment.php";
      const body = editingId ? { ...payload, id: editingId } : payload;
      const res = await apiFetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }, user);
      const { ok, data, error: err } = await parseApiResponse(res);
      if (!ok) {
        setError(err);
        return;
      }
      setMessage(data?.message || "Saved.");
      resetForm();
      loadAppointments();
    } catch {
      setError("Could not save. Check your connection and API.");
    }
  };

  const startEdit = (row) => {
    if (!isAdmin) return;
    setEditingId(row.id);
    setClientId(row.client_id != null ? String(row.client_id) : "");
    setServiceId(row.service_id != null ? String(row.service_id) : "");
    setEmployeeId(row.employee_id != null ? String(row.employee_id) : "");
    setDate(row.date || "");
    setTime(row.time ? String(row.time).slice(0, 5) : "");
    setMessage("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const del = async (id) => {
    if (!isAdmin) return;
    if (!window.confirm("Delete this appointment?")) return;
    setError("");
    try {
      const res = await apiFetch(`delete_appointment.php?id=${id}`, {}, user);
      const { ok, error: err } = await parseApiResponse(res);
      if (!ok) {
        setError(err);
        return;
      }
      if (editingId === id) resetForm();
      loadAppointments();
    } catch {
      setError("Delete failed.");
    }
  };

  const formatPrice = (p) => {
    if (p == null || p === "") return "—";
    const n = Number(p);
    return Number.isFinite(n) ? `${n.toLocaleString("en-US")} MKD` : p;
  };

  const clientLabel = (c) => c.full_name || `${c.first_name} ${c.last_name}`;

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Appointments</h1>
        <p className="page-desc">
          {isAdmin
            ? "Add, view, edit, and delete appointments. Double bookings for the same employee, date, and time are blocked."
            : "Add new appointments and view the schedule. Contact an administrator to edit or remove entries."}
        </p>
      </div>

      <div className="toolbar">
        <label className="field field--inline">
          <span className="field__label">Filter by employee</span>
          <select
            className="field__input field__input--select"
            value={filterEmployeeId}
            onChange={(e) => setFilterEmployeeId(e.target.value)}
          >
            <option value="">All employees</option>
            {employees.map((em) => (
              <option key={em.id} value={em.id}>
                {em.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <section className="card card--form">
        <h2 className="card__title">{editingId ? "Edit appointment" : "New appointment"}</h2>
        <form className="form-grid" onSubmit={submit}>
          {message && <div className="form-success form-grid__full">{message}</div>}
          {error && <div className="form-error form-grid__full">{error}</div>}

          <label className="field">
            <span className="field__label">Client</span>
            <select
              className="field__input field__input--select"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              required
            >
              <option value="">Select a client</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {clientLabel(c)}
                  {c.phone ? ` · ${c.phone}` : ""}
                </option>
              ))}
            </select>
            {clients.length === 0 && (
              <span className="field__hint">No clients yet — administrator must add clients first.</span>
            )}
          </label>

          <label className="field">
            <span className="field__label">Service</span>
            <select
              className="field__input field__input--select"
              value={serviceId}
              onChange={(e) => setServiceId(e.target.value)}
              required
            >
              <option value="">Select a service</option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} — {formatPrice(s.price)}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span className="field__label">Employee</span>
            <select
              className="field__input field__input--select"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              required
            >
              <option value="">Select an employee</option>
              {employees.map((em) => (
                <option key={em.id} value={em.id}>
                  {em.name}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span className="field__label">Date</span>
            <input
              className="field__input"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </label>

          <label className="field">
            <span className="field__label">Time</span>
            <input
              className="field__input"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />
          </label>

          <div className="form-actions form-grid__full">
            <button type="submit" className="btn btn--primary">
              {editingId ? "Save changes" : "Add appointment"}
            </button>
            {editingId && isAdmin && (
              <button type="button" className="btn btn--ghost" onClick={resetForm}>
                Cancel edit
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="card">
        <h2 className="card__title">Appointment list</h2>
        {list.length === 0 ? (
          <p className="muted">No appointments for this filter.</p>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Service</th>
                  <th>Employee</th>
                  <th>Date</th>
                  <th>Time</th>
                  {isAdmin && <th />}
                </tr>
              </thead>
              <tbody>
                {list.map((a) => (
                  <tr key={a.id}>
                    <td>{a.client_name}</td>
                    <td>{a.service_name || `Service #${a.service_id}`}</td>
                    <td>{a.employee_name || `Employee #${a.employee_id}`}</td>
                    <td>{a.date}</td>
                    <td>{String(a.time).slice(0, 5)}</td>
                    {isAdmin && (
                      <td className="data-table__actions">
                        <button type="button" className="btn btn--sm btn--ghost" onClick={() => startEdit(a)}>
                          Edit
                        </button>
                        <button type="button" className="btn btn--sm btn--danger" onClick={() => del(a.id)}>
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

export default Appointments;
