import React, { useEffect, useState } from "react";
import { getUserBookedEvents } from "../../api";
import EventCard from "./EventCard";

export default function BookedEventsList() {
  const [bookedEvents, setBookedEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserBookedEvents()
      .then((res) => {
        if (res.status === 200) {
          setBookedEvents(res.data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p>Loading your booked events...</p>;
  }

  return (
    <div>
      <h1 style={{ color: "white", textAlign: "center", marginTop: "5rem" }}>Your Booked Events</h1>
      <div className="cardContainer">
        {bookedEvents.length > 0 ? (
          bookedEvents.map((event) => (
            <EventCard key={event._id} obj={event} action="cancel" />
          ))
        ) : (
          <p style={{ color: "white" }}>You have not booked any events yet.</p>
        )}
      </div>
    </div>
  );
}