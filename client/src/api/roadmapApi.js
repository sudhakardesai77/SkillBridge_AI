import API from "./axios";


// ==========================================
// GET AUTH HEADERS
// ==========================================

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};


// ==========================================
// GENERATE ROADMAP
// ==========================================

export const generateRoadmap = async (
  company,
  missingSkills
) => {

  const res = await API.post(
    "/roadmap",

    {
      company,
      missingSkills,
    },

    getAuthHeaders()
  );

  return res.data;
};


// ==========================================
// GET ROADMAP PROGRESS
// ==========================================

export const getRoadmapProgress =
  async () => {

    const res = await API.get(
      "/roadmap/progress",

      getAuthHeaders()
    );

    return res.data;
  };


// ==========================================
// TOGGLE WEEK COMPLETION
// ==========================================

export const toggleWeekCompletion =
  async (weekNumber) => {

    const res = await API.patch(
      `/roadmap/progress/${weekNumber}`,

      {},

      getAuthHeaders()
    );

    return res.data;
  };