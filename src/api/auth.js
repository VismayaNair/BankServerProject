// src/api/auth.js
export const loginUser = async ({ username, password }) => {
  const response = await axios.post(`${API_URL}/login`, { username, password });
  return response.data; // should include { username, userId, roles, token, expiration }
};
