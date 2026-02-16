import axios from "axios";
const API_URL = "https://event-backend-7qo2.onrender.com/eventRoute";

// Auth APIs
export const registerUser = (userData) => {
    return axios.post(`${API_URL}/create-user`, userData);
};

export const loginUser = (userData) => {
    return axios.post(`${API_URL}/login`, userData);
};

// Event-related APIs
export const createEvent = (eventData) => {
    return axios.post(`${API_URL}/create-event`, eventData);
};

export const getEvents = (token) => {
    return axios.get(`${API_URL}/event-list`, {
        headers: {
            Authorization: token ? `Bearer ${token}` : ""
        }
    });
};

export const getEventById = (id) => {
    return axios.get(`${API_URL}/get-event/${id}`);
};

export const updateEvent = (id, eventData) => {
    return axios.put(`${API_URL}/update-event/${id}`, eventData);
};

export const deleteEvent = (id) => {
    return axios.delete(`${API_URL}/delete-event/${id}`);
};

export const bookEvent = (eventId) => {
    return axios.post(`${API_URL}/book-event/${eventId}`);
};

export const cancelBooking = (eventId) => {
    return axios.post(`${API_URL}/cancel-booking/${eventId}`);
};

// User-related APIs
export const getUserById = (userId, token) => {
    return axios.get(`${API_URL}/get-user/${userId}`, {
        headers: { Authorization: token ? `Bearer ${token}` : "" }
    });
};

export const getUserBookedEvents = (token) => {
    return axios.get(`${API_URL}/user-booked-events`, {
        headers: { Authorization: token ? `Bearer ${token}` : "" }
    });
};

export const updateUser = (userId, userData, token) => {
    return axios.put(`${API_URL}/update-user/${userId}`, userData, {
        headers: { Authorization: token ? `Bearer ${token}` : "" }
    });
};

export const deleteUser = (userId, token) => {
    return axios.delete(`${API_URL}/delete-user/${userId}`, {
        headers: { Authorization: token ? `Bearer ${token}` : "" }
    });
};

export const getUserList = (token) => {
    return axios.get(`${API_URL}/user-list`, {
        headers: { Authorization: token ? `Bearer ${token}` : "" }
    });
}