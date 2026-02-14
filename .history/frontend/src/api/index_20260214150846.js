import axios from "axios";

const API_URL = "/eventRoute";

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

export const getEvents = () => {
    return axios.get(`${API_URL}/event-list`);
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
export const getUserById = (userId) => {
    return axios.get(`${API_URL}/get-user/${userId}`);
};

export const getUserBookedEvents = () => {
    return axios.get(`${API_URL}/user-booked-events`);
};

export const updateUser = (userId, userData) => {
    return axios.put(`${API_URL}/update-user/${userId}`, userData);
};

export const deleteUser = (userId) => {
    return axios.delete(`${API_URL}/delete-user/${userId}`);
};

export const getUserList = () => {
    return axios.get(`${API_URL}/user-list`);
}