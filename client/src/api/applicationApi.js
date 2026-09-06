import API from "./axios";

// ================= APPLY FOR JOB =================

export const applyForJob = async (jobId) => {
  const token = localStorage.getItem("token");

  const res = await API.post(
    `/applications/${jobId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

// ================= CANCEL APPLICATION =================

export const cancelApplication = async (jobId) => {
  const token = localStorage.getItem("token");

  const res = await API.delete(
    `/applications/${jobId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

// ================= MY APPLICATIONS =================

export const getMyApplications = async () => {
  const token = localStorage.getItem("token");

  const res = await API.get(
    "/applications/my-applications",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

// ================= RECRUITER - GET JOB APPLICANTS =================

export const getJobApplicants = async (jobId) => {
  const token = localStorage.getItem("token");

  const res = await API.get(
    `/applications/job/${jobId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

// ================= RECRUITER - UPDATE APPLICATION STATUS =================

export const updateApplicationStatus = async (
  applicationId,
  status
) => {
  const token = localStorage.getItem("token");

  const res = await API.put(
    `/applications/${applicationId}/status`,
    {
      status,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};