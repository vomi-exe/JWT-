import React from "react";
import "./Success.css";

export const Success = () => {
  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem("userInfo");
    window.location.reload();
  };

  return (
    <div>
      <h1 className="successh1">SUCCESS</h1>
      <h4 className="successh4">You have successfully loged in!</h4>
      <div>
        <button className="logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};
