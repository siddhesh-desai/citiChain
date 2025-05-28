import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api/v1";
const FASTAPI_BASE_URL = "http://localhost:8001";
const user_id = "68368dd42d5b47fe37b359bb";

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

export const getBalance = async () => {
  try {
    const response = await axios.get(
      `${FASTAPI_BASE_URL}/rupeex/balance/${user_id}` // Replace with the actual user ID if needed
    );
    console.log("Balance response:", response.data);
    return response.data.balance;
  } catch (error) {
    console.error("Error fetching balance:", error);
    throw error;
  }
};

export const getnewAccountDetails = async () => {
  try {
    const response = await axios.get(
      `${FASTAPI_BASE_URL}/rupeex/users/${user_id}`
    );
    return response.data?.user;
  } catch (error) {
    console.error("Error fetching new account details:", error);
    throw error;
  }
}