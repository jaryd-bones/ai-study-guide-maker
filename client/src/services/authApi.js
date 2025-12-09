import { apiClient } from "./apiClient.js";

export const loginRequest = async (email, password) => {
  const response = await apiClient.post("/auth/login", {
    email,
    password,
  });
  // Backend returns { accessToken, tokenType }
  return response.data;
};

export const registerRequest = async ({ email, password, firstName, lastName }) => {
  const response = await apiClient.post("/auth/register", {
    email,
    password,
    firstName,
    lastName,
  });
  // Backend returns { id, email, firstName, lastName }
  return response.data;
};
