////////////////////Google//////////////////////
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import axios from "axios";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/login",
        formData
      );
      if (response.data.message === "Successfully Login") {
        navigate("/home");
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      alert("An error occurred during login.");
    }
  };

  const handleGoogleSignIn = () => {
    window.location.href = "http://localhost:5000/auth/google";
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Login to Gaming Society</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit">Login</button>
        </form>
        <br />
        <button onClick={handleGoogleSignIn}>Continue with Google</button>

        <p>
          Don't have an account? <Link to="/signup">Sign Up</Link> <br />
          <br />
          <Link to="/forget-password">Forget Password?</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
