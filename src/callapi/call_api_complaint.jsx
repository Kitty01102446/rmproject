import axios from "axios";
import { authHeader } from "./auth";

import { API_BASE_URL as api } from "../config";

export async function createComplaint(payload) {
  const res = await axios.post(`${api}/complaints`, payload, { headers: authHeader() });
  return res.data;
}

export async function getComplaints(status) {
  const res = await axios.get(`${api}/admin/complaints`, {
    params: status ? { status } : {},
    headers: authHeader(),
  });
  return res.data;
}

export async function getComplaintById(complaintId) {
  const res = await axios.get(`${api}/admin/complaints/${complaintId}`, { headers: authHeader() });
  return res.data;
}

export async function resolveComplaint(complaintId, status, resolutionNote) {
  const res = await axios.put(
    `${api}/admin/complaints/${complaintId}/resolve`,
    { status, resolution_note: resolutionNote },
    { headers: authHeader() }
  );
  return res.data;
}
