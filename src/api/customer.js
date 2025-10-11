import axios from "axios";

const API_URL = "https://localhost:7286/api/Customer";

// ------------------ Customer Dashboard ------------------
// Get logged-in user's details
export const getCustomerDetails = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching customer details:", error);
    throw error;
  }
};

// ------------------ Admin Dashboard ------------------

// Get all customers (Admin only)
export const getAllCustomers = async (token) => {
  try {
    const response = await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching all customers:", error);
    throw error;
  }
};

// Get customer by UserId (for search)
export const getCustomerById = async (userId, token) => {
  try {
    const response = await axios.get(`${API_URL}/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching customer ${userId}:`, error);
    throw error;
  }
};

// Update customer details (Admin/User)
export const updateCustomer = async (userId, updatedData, token) => {
  try {
    const response = await axios.put(`${API_URL}/${userId}`, updatedData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating customer ${userId}:`, error);
    throw error;
  }
};

// Delete customer (Admin only)
export const deleteCustomer = async (userId, token) => {
  try {
    await axios.delete(`${API_URL}/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    console.error(`Error deleting customer ${userId}:`, error);
    throw error;
  }
};
