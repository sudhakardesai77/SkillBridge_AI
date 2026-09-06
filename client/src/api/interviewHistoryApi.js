import API from "./axios";

export const getInterviewHistory = async () => {
  const token = localStorage.getItem("token");

  const res = await API.get("/interview/history", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};