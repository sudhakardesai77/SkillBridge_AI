import API from "./axios";

export const analyzeResume = async () => {
  const token = localStorage.getItem("token");

  const res = await API.get("/ats/analyze", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};