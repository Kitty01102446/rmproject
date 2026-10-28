import axios from "axios";

import { API_BASE_URL as api } from "../config";

export async function getAllPromotions() {
  const response = await axios.get(`${api}/promotion`, {
    headers: { "Content-Type": "application/json" },
  });
  return response.data;
}

export async function getPromotionsByStore(storeId) {
  const response = await axios.get(`${api}/promotion/store/${storeId}`, {
    headers: { "Content-Type": "application/json" },
  });
  return response.data;
}

export async function createPromotion(payload) {
  const response = await axios.post(`${api}/promotion`, payload, {
    headers: { "Content-Type": "application/json" },
  });
  return response.data;
}

export async function updatePromotion(promoId, payload) {
  const response = await axios.put(`${api}/promotion/${promoId}`, payload, {
    headers: { "Content-Type": "application/json" },
  });
  return response.data;
}

export async function deletePromotion(promoId) {
  const response = await axios.delete(`${api}/promotion/${promoId}`, {
    headers: { "Content-Type": "application/json" },
  });
  return response.data;
}
