import API from "./axios";

// ================= GET ALL JOBS =================

export const getJobs = async () => {
  const token = localStorage.getItem("token");

  const res = await API.get("/jobs", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

// ================= CREATE JOB =================

export const createJob = async (jobData) => {
  const token = localStorage.getItem("token");

  const res = await API.post(
    "/jobs",
    jobData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

// ================= GET MY JOBS =================

export const getMyJobs = async () => {
  const token = localStorage.getItem("token");

  const res = await API.get("/jobs/my-jobs", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

// ================= DELETE JOB =================

export const deleteJob = async (jobId) => {
  const token = localStorage.getItem("token");

  const res = await API.delete(
    `/jobs/${jobId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

// ================= BOOKMARK JOB =================

export const bookmarkJob = async (jobId) => {
  const token = localStorage.getItem("token");

  const res = await API.post(
    `/jobs/${jobId}/bookmark`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

// ================= REMOVE BOOKMARK =================

export const removeBookmark = async (jobId) => {
  const token = localStorage.getItem("token");

  const res = await API.delete(
    `/jobs/${jobId}/bookmark`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

// ================= SAVED JOBS =================

export const getBookmarkedJobs = async () => {
  const token = localStorage.getItem("token");

  const res = await API.get("/jobs/bookmarks", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};