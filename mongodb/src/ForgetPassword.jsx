import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ForgetPassword.css";
import axios from "axios";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setEmail(e.target.value);
    setErrorMessage("");
    setSuccessMessage("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:5000/forget-password", { email })
      .then((result) => {
        console.log(result.data);
        if (result.data !== "Incorrect email") {
          alert("OTP successfully sent to your Email");
          navigate("/verification", {
            state: { email: email },
          });
        }
      })
      .catch((err) => alert("An error occurred. Please try again."));
  };

  return (
    <div className="forget-password-container">
      <div className="forget-password-card">
        <h2>Forget Password</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={handleChange}
            required
          />
          <button type="submit">Send Reset Link</button>
        </form>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
      </div>
    </div>
  );
};

export default ForgetPassword;
