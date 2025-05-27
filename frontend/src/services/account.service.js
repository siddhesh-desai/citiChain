import axios from "axios";

const URL = "http://localhost:8000/api/v1/bankusers/account-details";

export const getAccountDetails = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching account details:", error);
    throw error;
  }
};
