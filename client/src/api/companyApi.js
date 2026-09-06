import API from "./axios";

// ==========================================
// GET ALL COMPANIES
// ==========================================

export const getCompanies = async () => {
  const token = localStorage.getItem("token");

  const res = await API.get("/companies", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};


// ==========================================
// GET SINGLE COMPANY
// ==========================================

export const getCompanyByName = async (companyName) => {
  const token = localStorage.getItem("token");

  const res = await API.get(
    `/companies/${encodeURIComponent(companyName)}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};