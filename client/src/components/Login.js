import "./Login.css";
import React from "react";
import axios from "axios";
import { useState } from "react";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";

export const Login = ({ location }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://signup-app-5hk3.onrender.com/login", { email, password });
      localStorage.setItem("userInfo", JSON.stringify(res.data));
      history.push("/");
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="container">
      <div className="login">
        <form onSubmit={handleSubmit}>
          <span className="formTitleLogin">LOGIN</span>
          <input
            className="inputLogin"
            type="email"
            placeholder="email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="inputLogin"
            type="password"
            placeholder="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="submitButtonLogin">
            Login
          </button>
        </form>
        <div className="RegisterLogin">
          New User? <Link to="/register">Register</Link>
        </div>
      </div>
    </div>
  );
};
