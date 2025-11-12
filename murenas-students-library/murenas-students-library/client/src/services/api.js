// client/src/services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; // Adjust the base URL as needed

export const fetchStudents = async () => {
  try {
    const response = await axios.get(`${API_URL}/students`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addStudent = async (studentData) => {
  try {
    const response = await axios.post(`${API_URL}/students`, studentData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Add more API functions as needed for your application.