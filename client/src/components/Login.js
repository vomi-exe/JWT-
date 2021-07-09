import "./Login.css";
import React from "react";
import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";

export const Login = ({ location }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    try {
      const res = await axios.post("/login", { email, password });
      localStorage.setItem("userInfo", JSON.stringify(res.data));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="container">
      <div className="login">
        <form onSubmit={handleSubmit}>
          <span className="formTitle">LOGIN</span>
          <input
            type="email"
            placeholder="email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button action="/" type="submit" className="submitButton">
            Login
          </button>
        </form>
        New User? <Link to="/register">Register</Link>
      </div>
    </div>
  );
};
