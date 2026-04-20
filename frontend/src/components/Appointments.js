import React, { useCallback, useEffect, useState } from "react";
import { apiUrl } from "../api";

function Appointments() {
  const [list, setList] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [services, setServices] = useState([]);
  const [filterEmployeeId, setFilterEmployeeId] = useState("");

  const [clientName, setClientName] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadRefs = useCallback(async () => {
    const [er, sr] = await Promise.all([
      fetch(apiUrl("get_employees.php")),
      fetch(apiUrl("get_services.php")),
    ]);
    const empData = await er.json();
    const svcData = await sr.json();
    setEmployees(Array.isArray(empData) ? empData : []);
    setServices(Array.isArray(svcData) ? svcData : []);
  }, []);

  const loadAppointments = useCallback(async () => {
    const q =
      filterEmployeeId !== ""
        ? `get_appointments.php?employee_id=${encodeURIComponent(filterEmployeeId)}`
        : "get_appointments.php";
    const res = await fetch(apiUrl(q));
    const data = await res.json();
    setList(Array.isArray(data) ? data : []);
  }, [filterEmployeeId]);

  useEffect(() => {
    loadRefs();
  }, [loadRefs]);

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  const resetForm = () => {
    setClientName("");
    setServiceId("");
    setEmployeeId("");
    setDate("");
    setTime("");
    setEditingId(null);
  };

  const parseJsonMessage = async (res) => {
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch {
      return { error: text || "Unexpected response from server" };
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    const sid = parseInt(serviceId, 10);
    const eid = parseInt(employeeId, 10);
    if (!clientName.trim() || !date || !time || !sid || !eid) {
      setError("Please fill in all fields.");
      return;
    }

    const payload = {
      client_name: clientName.trim(),
      service_id: sid,
      employee_id: eid,
      date,
      time,
    };

    try {
      const url = editingId
        ? apiUrl("update_appointment.php")
        : apiUrl("add_appointment.php");
      const body = editingId ? { ...payload, id: editingId } : payload;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await parseJsonMessage(res);
      if (data.error) {
        setError(data.error);
        return;
      }
      setMessage(data.message || "Saved.");
      resetForm();
      loadAppointments();
    } catch {
      setError("Could not save. Check your connection and API.");
    }
  };

  const startEdit = (row) => {
    setEditingId(row.id);
    setClientName(row.client_name || "");
    setServiceId(row.service_id != null ? String(row.service_id) : "");
    setEmployeeId(row.employee_id != null ? String(row.employee_id) : "");
    setDate(row.date || "");
    setTime(row.time ? String(row.time).slice(0, 5) : "");
    setMessage("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const del = async (id) => {
    if (!window.confirm("Delete this appointment?")) return;
    setError("");
    try {
      await fetch(apiUrl(`delete_appointment.php?id=${id}`));
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

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Appointments</h1>
        <p className="page-desc">
          Add, view, edit, and delete appointments. Double bookings for the same employee, date, and
          time are blocked.
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
            <input
              className="field__input"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Client name"
              required
            />
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
            {editingId && (
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
                  <th />
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
                    <td className="data-table__actions">
                      <button type="button" className="btn btn--sm btn--ghost" onClick={() => startEdit(a)}>
                        Edit
                      </button>
                      <button type="button" className="btn btn--sm btn--danger" onClick={() => del(a.id)}>
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

export default Appointments;
