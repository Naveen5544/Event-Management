import React, { useEffect, useState } from "react";
import Axios from "axios";
import EventCard from "./EventCard";

const EventList = () => {
  const token = localStorage.getItem("token");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    //Axios.get("http://localhost:5000/eventRoute/event-list")
     Axios.get("http://localhost:5000/eventRoute/event-list", {
      headers: {
        Authorization: `Bearer ${token}`, // Add token to headers
      },
    })
      .then((res) => {
        if (res.status === 200 && Array.isArray(res.data)) {
          setEvents(res.data);
        } else {
          setError("Invalid response from server");
        }
      })
      .catch((err) => {
        console.error("Axios Error:", err.response || err.message || err);
        setError("Error fetching events");
        alert("Error fetching events. See console.");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p style={{ textAlign: "center" }}>Loading events...</p>;
  if (error) return <p style={{ textAlign: "center", color: "red" }}>{error}</p>;
  if (!events || events.length === 0) return <p style={{ textAlign: "center" }}>No events found.</p>;

  return (
    <div className="cardContainer">
      {events.map((event) => {
        const slotsLeft = `Slots Left: ${event.slots}`;
        return (
          <EventCard
            key={event._id}
            obj={event}
            action="book"
            slotsLeft={slotsLeft}
          />
        );
      })}
    </div>
  );
};

export default EventList;
