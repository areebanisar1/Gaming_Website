import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./ForgetPassword.css";
import axios from "axios";

const Verification = () => {
  const location = useLocation();
  const { email } = location.state || {};

  const navigate = useNavigate();

  const [code, setCode] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:5000/verify-code", { email, code })
      .then((result) => {
        navigate("/resetpassword", { state: { email: email } });
      })
      .catch((err) => {
        alert("Incorrect OTP code. Please try again!");
      });
  };

  return (
    <div className="forget-password-container">
      <div className="forget-password-card">
        <h2>Verification</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Verification Code</label>
          <input
            type="code"
            id="code"
            name="code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
          <button type="submit">Verify</button>
        </form>
      </div>
    </div>
  );
};

export default Verification;
