import axios from "axios";

// ✅ เปลี่ยนตรงนี้
let api = "https://backend-gold-kappa-26.vercel.app";

/* =========================================================
   CREATE BOOKING
========================================================= */
export async function createBooking(payload) {
  try {
    const response = await axios.post(
      `${api}/booking`,
      payload,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    console.log("create booking:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating booking:", error);
    throw error;
  }
}

/* =========================================================
   UPDATE USER
========================================================= */
export async function updateUserById(userId, payload) {
  const res = await axios.put(
    `${api}/users/${userId}`,
    payload,
    { headers: { "Content-Type": "application/json" } }
  );
  return res.data;
}

/* =========================================================
   GET USER BY ID
========================================================= */
export async function getUserById(userId) {
  const response = await axios.get(`${api}/users/${userId}`);
  return response.data;
}

/* =========================================================
   GET BOOKINGS
========================================================= */
export async function getBookings() {
  const response = await axios.get(`${api}/booking`);
  return response.data;
}

/* =========================================================
   GET STORE BOOKINGS
========================================================= */
export async function getStoreBookings(storeId) {
  const response = await axios.get(
    `${api}/booking/store/${storeId}`
  );
  return response.data;
}

/* =========================================================
   GET ALERTS
========================================================= */
export async function getAlerts(storeId) {
  const response = await axios.get(
    `${api}/booking/alerts/${storeId}`
  );
  return response.data;
}

/* =========================================================
   GET SCHEDULE (🔥 แก้ตรงนี้ด้วย)
========================================================= */
export async function getScheduleByDate(storeId, date) {
  const response = await axios.get(
    `${api}/schedule/${storeId}/${date}`
  );
  return response.data;
}