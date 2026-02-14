import React from "react";
import { useNavigate } from "react-router-dom";
import EventRegistrationForm from "./eventform";
import { createEvent } from "../../api"; // Import the API function for creating events

export default function CreateEvent() {
    const navigate = useNavigate();

    // Function to handle form submission
    const handleSubmit = (eventData) => {
        // Send the event data to the backend
        createEvent(eventData)
            .then((response) => {
                alert("Event created successfully!");
                console.log(response.data); // Log the response from the backend
                navigate("/event-list"); // Redirect to event list
            })
            .catch((error) => {
                console.error("Error creating event:", error);
                const errorMessage = error.response?.data?.error || "Failed to create event. Please try again.";
                alert(errorMessage);
            });
    };

    return (
        <EventRegistrationForm
            nameValue=""
            startTimeValue=""
            endTimeValue=""
            dateValue=""
            placeValue=""
            descriptionValue=""
            clubValue=""
            slotsValue=""
            action="create"
            onSubmit={handleSubmit} // Pass the handleSubmit function as a prop
        />
    );
}