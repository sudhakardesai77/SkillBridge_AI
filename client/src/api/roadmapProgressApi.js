import API from "./axios";


// =============================================
// GET PROGRESS
// =============================================

export const getRoadmapProgress = async (
  company
) => {

  const token =
    localStorage.getItem("token");

  const response = await API.get(
    `/roadmap-progress?company=${encodeURIComponent(
      company
    )}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};


// =============================================
// TOGGLE WEEK
// =============================================

export const toggleWeekProgress = async (
  company,
  week
) => {

  const token =
    localStorage.getItem("token");

  const response = await API.post(
    "/roadmap-progress/toggle",
    {
      company,
      week,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};