import React, { useState, useEffect } from "react";

import Login from "../Login/Login";
import "./Home.css";

export default function Home() {
  const [isLoggedIn, setLoggedIn] = useState(false); // Use boolean

  useEffect(() => {
    const checkLoginStatus = () => {
      const loginStatus = localStorage.getItem("loginStatus");
      setLoggedIn(loginStatus === "true"); // Set boolean
    };

    checkLoginStatus();
    const intervalId = setInterval(checkLoginStatus, 5000);
    return () => clearInterval(intervalId);
  }, []);

  if (!isLoggedIn) {
    return (
      <div className="content">
        <div>
          <h1>Eventify</h1>
          <p className="tagline">
            <em> &lsquo; Simplify &rsquo; your Events </em>
          </p>
          <p className="about">
            Explore the magic of our application &apos;EVENTIFY&apos;. A go-to
            solution for managing amazing events effortlessly. From easy sign-ups
            to registering and managing event schedules, our user-friendly
            platform has everything you need for a flawless experience. With
            powerful features, trust our system to handle the details, and
            let&apos;s bring your event vision to life!!!
          </p>
        </div>

        <Login />
      </div>
    );
  } else {
    return (
      <div className="content">
        <div>
          <h1>Eventify</h1>
          <p className="tagline">
            <em> &lsquo; Simplify &rsquo; your Events </em>
          </p>
          <p className="about">
            Explore the magic of our application &apos;EVENTIFY&apos;. A go-to
            solution for managing amazing events effortlessly. From easy sign-ups
            to registering and managing event schedules, our user-friendly
            platform has everything you need for a flawless experience. With
            powerful features, trust our system to handle the details, and
            let&apos;s bring your event vision to life!!!
          </p>
        </div>
      </div>
    );
  }
}