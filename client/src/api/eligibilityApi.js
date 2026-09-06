import API from "./axios";

export const getEligibility = async () => {
  const token = localStorage.getItem("token");

  const res = await API.get("/eligibility", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};