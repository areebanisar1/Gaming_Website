import React, { useState, useEffect } from "react";
import "./Mainheader.css";
import axios from "axios";

const Mainheader = () => {
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");

  // Fetch user role and email
  const fetchEmail = async () => {
    try {
      const result = await axios.get("http://localhost:5000/get-role");
      console.log("Fetch result:", result.data);
      if (result.data !== "Invalid") {
        setEmail(result.data.email);
        setRole(result.data.role);
      }
    } catch (error) {
      console.error("Error fetching user role:", error);
    }
  };

  useEffect(() => {
    fetchEmail();
  }, []);

  console.log("Current role:", role);

  const handleLogoutConfirm = async () => {
    try {
      await axios.post("http://localhost:5000/logout");
      setRole("");
      setEmail("");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  return (
    <div>
      <header className="header">
        <div className="logo">Fast Gaming Society</div>
        <nav className="nav">
          <ul>
            <li>
              <a href="./home">
                <button className="nav-button">Home</button>
              </a>
            </li>
            <li>
              <button className="nav-button">About</button>
            </li>
            {role && (
              <li>
                <a href="./apply">
                  <button className="nav-button">Apply</button>
                </a>
              </li>
            )}
            <li>
              <button className="nav-button">Games</button>
            </li>

            <li>
              {(role === "President" || role === "Head") && (
                <a href="./history">
                  <button className="nav-button">History</button>
                </a>
              )}
            </li>
            <li>
              {role && (
                <a href="./events">
                  <button className="nav-button">Events</button>
                </a>
              )}
            </li>
            <li>
              <button className="nav-button">Contact</button>
            </li>
            <li>
              {role && (
                <a href="./tasks">
                  <button className="nav-button">Tasks</button>
                </a>
              )}
            </li>
            <li>
              {(role === "President" ||
                role === "Head" ||
                role === "Vice Head") && (
                <a href="./team">
                  <button className="nav-button">Teams</button>
                </a>
              )}
            </li>
            <li>
              {role && (
                <a href="./gallery">
                  <button className="nav-button">Gallery</button>
                </a>
              )}
            </li>
            {(role === "President" ||
              role === "Head" ||
              role === "Vice Head") && (
              <li>
                <a href="./announcements">
                  <button className="nav-button">Announcements</button>
                </a>
              </li>
            )}
          </ul>
          {role && (
            <div className="auth-buttons">
              <a href="./login">
                <button onClick={handleLogoutConfirm} className="login">
                  LOGOUT
                </button>
              </a>
            </div>
          )}

          {!role && (
            <div className="auth-buttons">
              <a href="./login">
                <button className="login">LOGIN</button>
              </a>
              <a href="./signup">
                <button className="signup">SIGN UP</button>
              </a>
            </div>
          )}
        </nav>
      </header>
    </div>
  );
};

export default Mainheader;
