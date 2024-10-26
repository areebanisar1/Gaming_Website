import React from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <h2>Gaming Society Dashboard</h2>
        <button onClick={handleLogout}>Logout</button>
      </nav>
      <div className="dashboard-sidebar">
        <ul>
          <li>
            <a href="#overview">Overview</a>
          </li>
          <li>
            <a href="#events">Events</a>
          </li>
          <li>
            <a href="#members">Members</a>
          </li>
          <li>
            <a href="#settings">Settings</a>
          </li>
        </ul>
      </div>
      <div className="dashboard-content">
        <section id="overview">
          <h3>Overview</h3>
          <p>
            Welcome to your dashboard! Here you can manage your gaming society
            activities.
          </p>
        </section>
        <section id="events">
          <h3>Events</h3>
          <p>Manage your events here.</p>
        </section>
        <section id="members">
          <h3>Members</h3>
          <p>View and manage your members here.</p>
        </section>
        <section id="settings">
          <h3>Settings</h3>
          <p>Update your settings here.</p>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
