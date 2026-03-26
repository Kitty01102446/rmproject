let api = "http://localhost:5010";
import axios from "axios";


export async function updateUserById(userId, payload) {
  const res = await axios.put(
    `${api}/users/${userId}`,
    payload,
    { headers: { "Content-Type": "application/json" } }
  );
  return res.data;
}


/* =========================================================
   GET USER BY ID (profile)
   GET /users/<id>
========================================================= */
export async function getUserById(userId) {
  try {
    const response = await axios.get(
      `${api}/users/${userId}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("user by id:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching user by id:", error);
    throw error;
  }
}

/* =========================================================
   GET ADDRESS
========================================================= */
export async function getdataProducts() {
  try {
    const response = await axios.get(`${api}/address`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}

/* =========================================================
   ADD PRODUCTS
========================================================= */
export async function adddataProducts(token, id_year) {
  try {
    const response = await axios.post(
      `${api}/products`,
      { id_year },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response;
  } catch (error) {
    console.error("Error adding product:", error);
    throw error;
  }
}

/* =========================================================
   GET USERS (admin / list)
========================================================= */
export async function getUsers() {
  try {
    const response = await axios.get(`${api}/users`, {   // ✅ /users
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}


export async function getUserBookings(userId) {
  try {
    // แก้ไข URL ตรงนี้ให้เป็นที่อยู่จริงของ Backend ของคุณ
    const response = await axios.get(`http://localhost:5010/booking/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการดึงข้อมูลการจอง:", error);
    return [];
  }
}

export async function getStoreByUser(userId) {
  const res = await axios.get(`${api}/store/by-user/${userId}`);
  return res.data;
}
