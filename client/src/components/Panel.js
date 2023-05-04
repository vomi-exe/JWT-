import React from "react";
import axios from "axios";
import { useState } from "react";
import jwt_decode from "jwt-decode";

export const Panel = (user) => {
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const refreshToken = async () => {
    try {
      const res = await axios.post("https://signup-app-5hk3.onrender.com/refresh", { token: user.refreshToken });
      localStorage.setItem("userInfo", {
        ...user,
        accessToken: res.data.accessToken,
        refreshToken: res.data.refreshToken,
      });
      return res.data;
    } catch (err) {
      console.error(err);
    }
  };

  const axiosToken = axios.create();

  axiosToken.interceptors.request.use(
    async (config) => {
      let currentDate = new Date();
      const decodedToken = jwt_decode(user.accessToken);
      if (decodedToken.exp * 1000 < currentDate.getTime()) {
        const data = await refreshToken();
        config.headers["authorization"] = "Bearer " + data.accessToken;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  const handleDelete = async (id) => {
    setSuccess(false);
    setError(false);
    try {
      await axiosToken.delete("https://signup-app-5hk3.onrender.com/users/" + id, {
        headers: { authorization: "Bearer " + user.accessToken },
      });
      setSuccess(true);
    } catch (error) {
      setError(true);
    }
  };

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem("userInfo");
    window.location.reload();
  };

  return (
    <>
      <div className="home">
        <span>
          Welcome to the <b>{user.isAdmin ? "admin" : "user"}</b> dashboard{" "}
          <b>{user.username}</b>.
        </span>
        <span>Delete Users:</span>
        <button className="deleteButton" onClick={() => handleDelete(1)}>
          Delete John
        </button>
        <button className="deleteButton" onClick={() => handleDelete(2)}>
          Delete Jane
        </button>
        {error && (
          <span className="error">
            You are not allowed to delete this user!
          </span>
        )}
        {success && (
          <span className="success">User has been deleted successfully...</span>
        )}
      </div>
      <div>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </>
  );
};
