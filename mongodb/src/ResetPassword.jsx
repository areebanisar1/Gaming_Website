import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./ForgetPassword.css";
import axios from "axios";

const Resetpassword = () => {
  const location = useLocation();
  const { email } = location.state || {};

  const [password, setP] = useState("");
  const [cpassword, setCP] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:5000/reset-password", { email, password })
      .then((result) => {
        alert("Password changed Successfully");
        navigate("/login");
      })
      .catch((err) => alert("An error occurred. Please try again."));
  };

  return (
    <div className="forget-password-container">
      <div className="forget-password-card">
        <h2>Reset Password</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">New Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setP(e.target.value)}
            required
          />
          <label htmlFor="email">Confirm Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={cpassword}
            onChange={(e) => setCP(e.target.value)}
            required
          />
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default Resetpassword;
