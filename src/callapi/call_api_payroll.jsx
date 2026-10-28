import axios from "axios";
import { authHeader } from "./auth";
import { API_BASE_URL as api } from "../config";

export async function getEmployeePayroll(employeeId, year, month) {
  const res = await axios.get(`${api}/employees/${employeeId}/payroll`, {
    params: { year, month },
    headers: authHeader(),
  });
  return res.data;
}

export async function getEmployeePayrollHistory(employeeId) {
  const res = await axios.get(`${api}/employees/${employeeId}/payroll/history`, { headers: authHeader() });
  return res.data;
}

export async function confirmEmployeePayroll(employeeId, payload) {
  const res = await axios.post(`${api}/employees/${employeeId}/payroll/confirm`, payload, { headers: authHeader() });
  return res.data;
}

export async function getStorePayroll(storeId, year, month) {
  const res = await axios.get(`${api}/employees/store/${storeId}/payroll`, {
    params: { year, month },
    headers: authHeader(),
  });
  return res.data;
}
