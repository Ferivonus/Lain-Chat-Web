// src/services/api.js
import axios from 'axios';

// API URL for your backend
const API_URL = 'http://localhost:5000/api';  // Adjust this based on your backend URL

// Function to login a user
export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, credentials);
    return response.data; // Assuming it returns the logged-in user data
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

// Function to register a new user
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, userData);
    return response.data; // Assuming it returns the newly created user data
  } catch (error) {
    console.error('Error registering:', error);
    throw error;
  }
};

const ROOM_API_URL = 'http://localhost:5000/api/rooms';  // Adjust the URL if necessary


// Create a new room
export const createRoom = async (roomName) => {
    try {
        const response = await axios.post(ROOM_API_URL, { room_name: roomName });
        return response.data; // This should return the newly created room
    } catch (error) {
        console.error("Error creating room:", error);
        throw error; // Rethrow error to handle it in the component
    }
};

// Fetch rooms from the backend
export const fetchRooms = async () => {
    try {
        const response = await axios.get(ROOM_API_URL);
        return response.data;
    } catch (error) {
        console.error("Error fetching rooms:", error);
        throw error;
    }
};

// You can add more functions here based on your application's needs

