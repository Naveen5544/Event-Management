import React from "react";
import { useNavigate } from "react-router-dom";
import RegistrationForm from "./RegistrationForm";
import { registerUser } from "../../api";

export default function Register() {
    const navigate = useNavigate();

    const handleSubmit = async (formData) => {
        try {
            await registerUser(formData);
            alert("Registration successful! Please log in.");
            navigate("/"); // Redirect to login page
        } catch (error) {
            const errorMessage = error.response?.data?.error || "Registration failed. Please try again.";
            alert(errorMessage);
            console.error('Registration failed:', error);
        }
    };

    return (
        <RegistrationForm
            action="create"
            onSubmit={handleSubmit}
        />
    );
}