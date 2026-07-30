import api from "../api/axios";

export const checkIn = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await api.post("/attendance/checkin", formData);

  return res.data;
};

export const checkOut = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await api.post("/attendance/checkout", formData);

  return res.data;
};

export const getAttendanceHistory = async () => {
  const res = await api.get("/attendance/history");

  return res.data;
};