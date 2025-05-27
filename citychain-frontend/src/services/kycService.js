import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api/v1";

export const registerUser = async (formData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/users/register`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("KYC Registration error:", error);
    throw error;
  }
};

export const approveKYC = async (userId) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/users/approve-kyc/${userId}`
    );
    return response.data;
  } catch (error) {
    console.error("KYC Approval error:", error);
    throw error;
  }
};
