import axios from "axios";
"https://backend-gold-kappa-26.vercel.app";

export async function getTypeServices() {
  const res = await axios.get(`${api}/type-services`);
  return res.data;
}
