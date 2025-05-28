import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api/v1";

export const getAccountDetails = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/bankusers/account-details`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching account details:", error);
    throw error;
  }
};
