import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Axios from "axios";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import "./Events.css";

const ViewEvent = () => {
  const { id } = useParams(); // Get event ID from URL
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    Axios.get(`http://localhost:5000/eventRoute/get-event/${id}`)
      .then((res) => {
        if (res.status === 200) {
          setEvent(res.data);
        } else {
          throw new Error("Event not found");
        }
      })
      .catch((err) => alert("Error loading event: " + err.message));
  }, [id]);

  if (!event) return <p>Loading event details...</p>;

  const {
    name,
    club,
    description,
    date,
    place,
    startTime,
    endTime,
    slots,
  } = event;

  return (
    <div className="viewEventContainer">
      <Card className="eventCard" style={{ margin: "2rem auto", maxWidth: "600px" }}>
        <Card.Body>
          <Card.Title style={{ fontSize: "2vw", fontWeight: "bold" }}>{name}</Card.Title>
          <Card.Subtitle style={{ fontSize: "1.3vw", fontStyle: "italic" }}>{club}</Card.Subtitle>
          <Card.Text style={{ fontSize: "1.1vw", marginTop: "1rem" }}>
            <strong>Description:</strong> {description}<br />
            <strong>Date:</strong> {date}<br />
            <strong>Time:</strong> {startTime} - {endTime}<br />
            <strong>Place:</strong> {place}<br />
            <strong>Slots Left:</strong> {slots}
          </Card.Text>
          <Button variant="secondary" onClick={() => navigate("/event-list")}>
            Back to Event List
          </Button>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ViewEvent;
