import axios from "axios";

const API_URL = "https://localhost:7286/api/Transaction";

// Get all transactions (Admin only)
export const getAllTransactions = async (token) => {
  const response = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Get logged-in customer's transactions
export const getMyTransactions = async (token) => {
  const response = await axios.get(`${API_URL}/my`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Create new transaction
export const createTransaction = async (data, token) => {
  const response = await axios.post(API_URL, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
