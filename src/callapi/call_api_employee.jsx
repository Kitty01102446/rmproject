import axios from "axios";
const api = "http://localhost:5010";

export async function getEmployeeByStore(storeId) {
  const res = await axios.get(`${api}/employees/store/${storeId}`);
  return res.data;
}


export async function getEmployeesByStore(storeId) {
  const response = await axios.get(
    `${api}/employees/store/${storeId}`  // ต้องมี s หน้า employees
  );
  return response.data;
}


export async function createEmployee(data) {
  const response = await axios.post(`${api}/employees`, data);
  return response.data;
}

export async function updateEmployee(id, data) {
  const response = await axios.put(`${api}/employees/${id}`, data);
  return response.data;
}

export async function deleteEmployee(id) {
  const response = await axios.delete(`${api}/employees/${id}`);
  return response.data;
}
