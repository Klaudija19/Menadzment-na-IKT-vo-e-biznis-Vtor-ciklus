import React, { useState } from "react";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import Navbar from "./components/Navbar";
import Appointments from "./components/Appointments";
import Services from "./components/Services";
import Employees from "./components/Employees";
import "./App.css";

function App() {
  const [page, setPage] = useState("home");
  const [user, setUser] = useState(null);

  if (!user) {
    return (
      <div className="app app--auth">
        {page === "home" && <Home setPage={setPage} />}
        {page === "login" && <Login setUser={setUser} setPage={setPage} />}
        {page === "register" && <Register setPage={setPage} />}
      </div>
    );
  }

  const isAdmin = user.role === "admin";

  return (
    <div className="app">
      <Navbar
        page={page}
        setPage={setPage}
        setUser={setUser}
        user={user}
        isAdmin={isAdmin}
      />
      <main className="main">
        {page === "appointments" && <Appointments />}
        {page === "services" && <Services />}
        {page === "employees" && <Employees />}
      </main>
    </div>
  );
}

export default App;
