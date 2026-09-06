import API from "./axios";

export const getProfile = async () => {
  const token = localStorage.getItem("token");

  const res = await API.get("/auth/profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const updateProfile = async (profileData) => {
  const token = localStorage.getItem("token");

  const res = await API.put("/auth/profile", profileData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};