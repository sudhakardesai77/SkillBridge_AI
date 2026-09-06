import API from "./axios";

// =====================================================
// UPLOAD / REPLACE RESUME
// =====================================================

export const uploadResume = async (file) => {
  const token = localStorage.getItem("token");

  const formData = new FormData();

  formData.append(
    "resume",
    file
  );

  const res = await API.post(
    "/auth/resume",
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type":
          "multipart/form-data",
      },
    }
  );

  return res.data;
};

// =====================================================
// DELETE RESUME
// =====================================================

export const deleteResume = async () => {
  const token = localStorage.getItem("token");

  const res = await API.delete(
    "/auth/resume",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};