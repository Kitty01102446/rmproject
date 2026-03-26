let api = "http://localhost:5010";
import axios from "axios";

/* =========================================================
   CREATE BOOKING  ✅ (อันที่ขาด)
   POST /booking
========================================================= */
export async function createBooking(payload) {
  try {
    const response = await axios.post(
      `${api}/booking`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
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
  try {
    const response = await axios.get(`${api}/users/${userId}`, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

/* =========================================================
   GET BOOKINGS
========================================================= */
export async function getBookings() {
  try {
    const response = await axios.get(`${api}/booking`, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}
/* =========================================================
   GET BOOKINGS Dashboard
========================================================= */

export async function getStoreBookings(storeId) {
  try {
    const response = await axios.get(
      `${api}/booking/store/${storeId}`,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getAlerts(storeId) {
  const response = await axios.get(
    `${api}/booking/alerts/${storeId}`
  );
  return response.data;
}




export async function getScheduleByDate(storeId, date) {
  const response = await axios.get(
    `http://localhost:5010/schedule/${storeId}/${date}`
  );
  return response.data;
}