const API = "http://localhost:5010";
import axios from "axios";

// ===============================
// GET SERVICE BY STORE
// ===============================
export const fetchServicesByStore = async (storeId) => {
  const res = await axios.get(`${API}/service/store/${storeId}`);
  return res.data;
};

// ===============================
// CREATE
// ===============================
export const createService = async (data) => {
  const res = await axios.post(`${API}/service`, data);
  return res.data;
};

// ===============================
// UPDATE
// ===============================
export const updateServiceAPI = async (id, data) => {
  const res = await axios.put(`${API}/service/${id}`, data);
  return res.data;
};

// ===============================
// DELETE
// ===============================
export const deleteServiceAPI = async (id) => {
  const res = await axios.delete(`${API}/service/${id}`);
  return res.data;
};
