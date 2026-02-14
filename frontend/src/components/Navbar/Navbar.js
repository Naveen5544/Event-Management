import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { BiSolidUserCircle } from "react-icons/bi";
import Logo from "../../assets/logo_circle.jpg";

import "./Navbar.css";

export default function Navbar() { // Removed the unused `props` parameter
  const [user, setUser] = useState();

  useEffect(() => {
    const interval = setInterval(() => {
      const user = JSON.parse(localStorage.getItem("user"));
      setUser(user);
    }, 5000);

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  const logout = () => {
    localStorage.setItem("loginStatus", false);
    localStorage.removeItem("user");
    setUser(null); // Clear state immediately
  };

  if (user && user.role === "admin") {
    return (
      <nav className="navbar navbar-expand-lg">
        <div className="container-fluid box">
          <img className="logo" src={Logo} alt="" />
          <div className="menu">
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/view-event">View Events</Link></li>
              <li><Link to="/create-event">Create Event</Link></li>
              <li><Link to="/view-user">View Users</Link></li>
              <li><Link to="/weather-report">Weather Report</Link></li>
            </ul>
          </div>
          <div className="dropdown">
            <button className="dropbtn">
              <BiSolidUserCircle className="usericon admin" />
              {user.username}
            </button>
            <div className="dropdown-content admin">
              <Link to="/" onClick={logout}>Logout</Link>
            </div>
          </div>
        </div>
      </nav>
    );
  } else if (user) {
    return (
      <nav className="navbar navbar-expand-lg">
        <div className="container-fluid box">
          <img className="logo" src={Logo} alt="" />
          <div className="menu">
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/view-event">Events</Link></li>
              <li><Link to="/create-event">Create Event</Link></li> {/* <-- Added for users */}
              <li><Link to="/contact">CONTACT US</Link></li>
              <li><Link to="/weather-report">Weather Report</Link></li>
            </ul>
          </div>
          <div className="dropdown">
            <button className="dropbtn">
              <BiSolidUserCircle className="usericon user" />
              {user.username}
            </button>
            <div className="dropdown-content user">
              <Link to="/edit-profile">Edit Profile</Link>
              <Link to="/booked-events">Booked Events</Link>
              <Link to="/" onClick={logout}>Logout</Link>
            </div>
          </div>
        </div>
      </nav>
    );
  } else {
    return (
      <nav className="navbar navbar-expand-lg">
        <div className="container-fluid box">
          <img className="logo" src={Logo} alt="" />
          <div className="menu">
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/contact">CONTACT US</Link></li>
              <li><Link to="/weather-report">Weather Report</Link></li> {/* <-- Added */}
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}