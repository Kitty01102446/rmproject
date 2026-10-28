import axios from "axios";
import { API_BASE_URL as api } from "../config";
export async function getTypeServices() {
  const res = await axios.get(`${api}/type-services`);
  return res.data;
}
