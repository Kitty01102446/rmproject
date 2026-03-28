import axios from 'axios';

const api = "https://backend-gold-kappa-26.vercel.app";

// สมัครร้านค้า
export async function registerStore(payload) {
  try {
    const response = await axios.post(`${api}/register-store`, payload, {
      headers: { "Content-Type": "application/json" }
    });
    return response.data;
  } catch (error) {
    console.error("Error registering store:", error?.response?.data || error.message);
    throw error;
  }
}

// ดึงข้อมูลร้านค้า
export async function getStores(userId = null) {
  try {
    const url = userId ? `${api}/stores?user_id=${userId}` : `${api}/stores`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching store:", error?.response?.data || error.message);
    throw error;
  }
}