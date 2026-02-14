import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserById, updateUser } from "../../api";
import { useAuth } from "../../context/AuthContext";
import RegistrationForm from "../Login/RegistrationForm";

function UserUpdateForm() {
  const [initialData, setInitialData] = useState(null);
  const [error, setError] = useState(null);
  const { user, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Current user in EditProfile:", user);
    if (user?.id) {
      getUserById(user.id)
        .then(response => {
          console.log("Fetched user data:", response.data);
          setInitialData(response.data);
        })
        .catch(err => {
          console.error('Error fetching user details:', err);
          setError("Could not load profile data. Please try again later.");
        });
    } else {
      console.warn("User ID not found in context. Check if user is logged in.");
      setError("User session not found. Please log in again.");
    }
  }, [user]);

  const handleSubmit = (formData) => {
    // Exclude password if it's empty
    const { password, ...dataToSubmit } = formData;
    if (password) {
      dataToSubmit.password = password;
    }

    updateUser(user.id, dataToSubmit)
      .then((res) => {
        alert("Profile updated successfully!");
        // Update the user details in the auth context
        const updatedUser = { ...user, ...res.data };
        const token = localStorage.getItem('token');
        login(updatedUser, token); // Update global state
        navigate('/event-list');
      })
      .catch((err) => {
        console.error("Error updating user:", err);
        alert("Failed to update profile. Please try again.");
      });
  };

  if (error) {
    return (
      <div style={{ color: "white", textAlign: "center", marginTop: "100px" }}>
        <h3>{error}</h3>
        <button className="button" onClick={() => navigate('/login')} style={{ width: "auto", padding: "10px 20px" }}>
          Go to Login
        </button>
      </div>
    );
  }

  if (!initialData) {
    return <p style={{ color: "white", textAlign: "center", marginTop: "100px" }}>Loading your profile...</p>;
  }

  return (
    <RegistrationForm
      usernameValue={initialData.username}
      fullNameValue={initialData.fullName}
      emailValue={initialData.email}
      phoneValue={initialData.phone}
      passwordValue="" // Password should not be pre-filled
      action="update"
      onSubmit={handleSubmit}
    />
  );
};

export default UserUpdateForm;