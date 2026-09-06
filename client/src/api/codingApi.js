import API from "./axios";


// =====================================================
// GET CODING PROBLEMS
// =====================================================

export const getCodingProblems = async () => {

  const token =
    localStorage.getItem("token");


  const res =
    await API.get(
      "/coding",
      {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    );


  return res.data;
};


// =====================================================
// ADD CODING PROBLEM
// =====================================================

export const addCodingProblem =
  async (problem) => {

    const token =
      localStorage.getItem("token");


    const res =
      await API.post(
        "/coding",
        problem,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );


    return res.data;
  };


// =====================================================
// ADD AI RECOMMENDATION TO TRACKER
// =====================================================

export const addAIProblemToTracker =
  async (
    problem,
    jobId
  ) => {

    const token =
      localStorage.getItem("token");


    const res =
      await API.post(
        "/coding/recommendations/add",

        {
          title:
            problem.title,

          platform:
            problem.platform,

          difficulty:
            problem.difficulty,

          link:
            problem.link || "",

          jobId:
            jobId,
        },

        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );


    return res.data;
  };


// =====================================================
// TOGGLE CODING PROBLEM
// =====================================================

export const toggleCodingProblem =
  async (id) => {

    const token =
      localStorage.getItem("token");


    const res =
      await API.put(
        `/coding/${id}/toggle`,
        {},

        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );


    return res.data;
  };


// =====================================================
// DELETE CODING PROBLEM
// =====================================================

export const deleteCodingProblem =
  async (id) => {

    const token =
      localStorage.getItem("token");


    const res =
      await API.delete(
        `/coding/${id}`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );


    return res.data;
  };


// =====================================================
// CODING STATS
// =====================================================

export const getCodingStats =
  async () => {

    const token =
      localStorage.getItem("token");


    const res =
      await API.get(
        "/coding/stats",
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );


    return res.data;
  };


// =====================================================
// APPLIED JOBS
// =====================================================

export const getAppliedJobsForCoding =
  async () => {

    const token =
      localStorage.getItem("token");


    const res =
      await API.get(
        "/coding/applied-jobs",
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );


    return res.data;
  };


// =====================================================
// AI CODING RECOMMENDATIONS
// =====================================================

export const getCodingRecommendations =
  async ({
    jobId,
    platform,
    difficulty,
    problemCount,
  }) => {

    const token =
      localStorage.getItem("token");


    const res =
      await API.post(

        "/coding/recommendations",

        {
          jobId,

          platform,

          difficulty,

          problemCount,
        },

        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }

      );


    return res.data;
  };