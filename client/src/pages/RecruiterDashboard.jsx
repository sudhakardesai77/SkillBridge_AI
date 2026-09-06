import { useEffect, useState } from "react";
import {
  FaBuilding,
  FaPlus,
  FaTrash,
  FaBriefcase,
  FaUsers,
  FaCheck,
  FaTimes,
  FaGithub,
  FaLinkedin,
  FaFilePdf,
} from "react-icons/fa";

import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";

import {
  getMyJobs,
  createJob,
  deleteJob,
} from "../api/jobApi";

import {
  getJobApplicants,
  updateApplicationStatus,
} from "../api/applicationApi";

function RecruiterDashboard() {
  const [jobs, setJobs] = useState([]);

  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    company: "",
    jobTitle: "",
    location: "",
    jobType: "Full-time",
    description: "",
    skills: "",
    applyLink: "",
  });

  const [message, setMessage] = useState("");

  // ================= APPLICANTS =================

  const [selectedJob, setSelectedJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loadingApplicants, setLoadingApplicants] = useState(false);

  // ================= LOAD MY JOBS =================

  const loadJobs = async () => {
    try {
      setLoading(true);

      const res = await getMyJobs();

      console.log("My Jobs:", res);

      if (res.success) {
        setJobs(res.jobs || []);
      }
    } catch (err) {
      console.error("Load Jobs Error:", err);

      setMessage(
        err.response?.data?.message ||
          "Failed to load jobs."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  // ================= FORM CHANGE =================

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ================= CREATE JOB =================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setMessage("");

      const skillsArray = form.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill.length > 0);

      const res = await createJob({
        ...form,
        skills: skillsArray,
      });

      console.log("Create Job Response:", res);

      if (res.success) {
        setMessage("Job posted successfully! 🎉");

        setForm({
          company: "",
          jobTitle: "",
          location: "",
          jobType: "Full-time",
          description: "",
          skills: "",
          applyLink: "",
        });

        setShowForm(false);

        await loadJobs();
      }
    } catch (err) {
      console.error("Create Job Error:", err);

      setMessage(
        err.response?.data?.message ||
          "Failed to create job."
      );
    }
  };

  // ================= DELETE JOB =================

  const handleDelete = async (jobId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this job?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const res = await deleteJob(jobId);

      console.log("Delete Job Response:", res);

      if (res.success) {
        setMessage("Job deleted successfully.");

        setJobs((previousJobs) =>
          previousJobs.filter(
            (job) => job._id !== jobId
          )
        );

        if (selectedJob?._id === jobId) {
          setSelectedJob(null);
          setApplicants([]);
        }
      }
    } catch (err) {
      console.error("Delete Job Error:", err);

      setMessage(
        err.response?.data?.message ||
          "Failed to delete job."
      );
    }
  };

  // ================= VIEW APPLICANTS =================

  const handleViewApplicants = async (job) => {
    try {
      setSelectedJob(job);
      setLoadingApplicants(true);
      setApplicants([]);
      setMessage("");

      const res = await getJobApplicants(job._id);

      console.log("Applicants Response:", res);

      if (res.success) {
        setApplicants(res.applicants || []);
      } else {
        setMessage(
          res.message ||
            "Failed to load applicants."
        );
      }
    } catch (err) {
      console.error(
        "Load Applicants Error:",
        err
      );

      setMessage(
        err.response?.data?.message ||
          "Failed to load applicants."
      );
    } finally {
      setLoadingApplicants(false);
    }
  };

  // ================= CLOSE APPLICANTS =================

  const closeApplicants = () => {
    setSelectedJob(null);
    setApplicants([]);
  };

  // ================= UPDATE STATUS =================

  const handleStatusChange = async (
    applicationId,
    status
  ) => {
    try {
      const res =
        await updateApplicationStatus(
          applicationId,
          status
        );

      console.log(
        "Status Update Response:",
        res
      );

      if (res.success) {
        setMessage(
          `Application marked as ${status}.`
        );

        setApplicants((previousApplicants) =>
          previousApplicants.map(
            (application) =>
              application._id === applicationId
                ? {
                    ...application,
                    status,
                  }
                : application
          )
        );
      }
    } catch (err) {
      console.error(
        "Status Update Error:",
        err
      );

      setMessage(
        err.response?.data?.message ||
          "Failed to update application status."
      );
    }
  };

  // ================= LOADING =================

  if (loading) {
    return (
      <div className="flex min-h-screen bg-slate-100">
        <Sidebar />

        <div className="flex-1">
          <Navbar />

          <div className="flex justify-center items-center min-h-[80vh]">
            <h1 className="text-3xl font-bold text-blue-600">
              Loading Recruiter Dashboard...
            </h1>
          </div>
        </div>
      </div>
    );
  }

  // ================= PAGE =================

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <div className="p-8 max-w-7xl mx-auto">

          {/* ================= HEADER ================= */}

          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">

            <div>
              <h1 className="text-4xl font-bold">
                Recruiter Dashboard
              </h1>

              <p className="text-gray-500 mt-2">
                Manage your job postings and applicants.
              </p>
            </div>

            <button
              onClick={() =>
                setShowForm(!showForm)
              }
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-md"
            >
              <FaPlus />

              {showForm
                ? "Close"
                : "Post New Job"}
            </button>

          </div>

          {/* ================= MESSAGE ================= */}

          {message && (
            <div className="bg-blue-50 text-blue-700 p-4 rounded-xl mt-6 font-semibold">
              {message}
            </div>
          )}

          {/* ================= STATISTICS ================= */}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">

            <div className="bg-white rounded-2xl shadow-md p-6">
              <div className="flex items-center gap-4">

                <FaBriefcase className="text-3xl text-blue-600" />

                <div>
                  <p className="text-gray-500">
                    Total Jobs
                  </p>

                  <h2 className="text-3xl font-bold">
                    {jobs.length}
                  </h2>
                </div>

              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6">
              <div className="flex items-center gap-4">

                <FaBuilding className="text-3xl text-green-600" />

                <div>
                  <p className="text-gray-500">
                    Active Jobs
                  </p>

                  <h2 className="text-3xl font-bold">
                    {jobs.length}
                  </h2>
                </div>

              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6">
              <div className="flex items-center gap-4">

                <FaUsers className="text-3xl text-purple-600" />

                <div>
                  <p className="text-gray-500">
                    Applicants
                  </p>

                  <h2 className="text-3xl font-bold text-purple-600">
                    {selectedJob
                      ? applicants.length
                      : "-"}
                  </h2>
                </div>

              </div>
            </div>

          </div>

          {/* ================= POST JOB FORM ================= */}

          {showForm && (
            <div className="bg-white rounded-2xl shadow-md p-8 mt-8">

              <h2 className="text-2xl font-bold mb-6">
                Post New Job
              </h2>

              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >

                {/* Company */}

                <div>
                  <label className="block font-semibold mb-2">
                    Company
                  </label>

                  <input
                    type="text"
                    name="company"
                    value={form.company}
                    onChange={handleChange}
                    placeholder="Amazon"
                    required
                    className="w-full border rounded-xl px-4 py-3"
                  />
                </div>

                {/* Job Title */}

                <div>
                  <label className="block font-semibold mb-2">
                    Job Title
                  </label>

                  <input
                    type="text"
                    name="jobTitle"
                    value={form.jobTitle}
                    onChange={handleChange}
                    placeholder="Software Development Engineer"
                    required
                    className="w-full border rounded-xl px-4 py-3"
                  />
                </div>

                {/* Location */}

                <div>
                  <label className="block font-semibold mb-2">
                    Location
                  </label>

                  <input
                    type="text"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="Bangalore, India"
                    className="w-full border rounded-xl px-4 py-3"
                  />
                </div>

                {/* Job Type */}

                <div>
                  <label className="block font-semibold mb-2">
                    Job Type
                  </label>

                  <select
                    name="jobType"
                    value={form.jobType}
                    onChange={handleChange}
                    className="w-full border rounded-xl px-4 py-3"
                  >
                    <option value="Full-time">
                      Full-time
                    </option>

                    <option value="Internship">
                      Internship
                    </option>

                    <option value="Part-time">
                      Part-time
                    </option>
                  </select>
                </div>

                {/* Skills */}

                <div>
                  <label className="block font-semibold mb-2">
                    Skills
                  </label>

                  <input
                    type="text"
                    name="skills"
                    value={form.skills}
                    onChange={handleChange}
                    placeholder="Java, DSA, SQL, React"
                    className="w-full border rounded-xl px-4 py-3"
                  />

                  <p className="text-sm text-gray-400 mt-1">
                    Separate skills using commas.
                  </p>
                </div>

                {/* Description */}

                <div>
                  <label className="block font-semibold mb-2">
                    Description
                  </label>

                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Job description..."
                    rows="5"
                    className="w-full border rounded-xl px-4 py-3"
                  />
                </div>

                {/* Apply Link */}

                <div>
                  <label className="block font-semibold mb-2">
                    Apply Link
                  </label>

                  <input
                    type="url"
                    name="applyLink"
                    value={form.applyLink}
                    onChange={handleChange}
                    placeholder="https://company.com/jobs"
                    className="w-full border rounded-xl px-4 py-3"
                  />
                </div>

                {/* Submit */}

                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-bold"
                >
                  🚀 Post Job
                </button>

              </form>
            </div>
          )}

          {/* ================= MY JOBS ================= */}

          <div className="bg-white rounded-2xl shadow-md p-8 mt-8">

            <h2 className="text-2xl font-bold mb-6">
              My Posted Jobs
            </h2>

            {jobs.length === 0 ? (

              <div className="text-center py-12">

                <FaBriefcase className="text-5xl text-gray-300 mx-auto mb-4" />

                <p className="text-gray-500">
                  You haven't posted any jobs yet.
                </p>

                <button
                  onClick={() =>
                    setShowForm(true)
                  }
                  className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-xl"
                >
                  Post Your First Job
                </button>

              </div>

            ) : (

              <div className="space-y-5">

                {jobs.map((job) => (

                  <div
                    key={job._id}
                    className="border rounded-2xl p-6 hover:shadow-md transition"
                  >

                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-5">

                      <div>

                        <h3 className="text-xl font-bold">
                          {job.jobTitle}
                        </h3>

                        <p className="text-blue-600 font-semibold mt-1">
                          {job.company}
                        </p>

                        <p className="text-gray-500 mt-2">
                          📍 {job.location}
                        </p>

                        <span className="inline-block mt-3 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                          {job.jobType}
                        </span>

                      </div>

                      <div className="flex gap-3">

                        {/* VIEW APPLICANTS */}

                        <button
                          onClick={() =>
                            handleViewApplicants(job)
                          }
                          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl font-semibold"
                        >
                          <FaUsers />

                          View Applicants
                        </button>

                        {/* DELETE */}

                        <button
                          onClick={() =>
                            handleDelete(job._id)
                          }
                          className="bg-red-100 text-red-600 hover:bg-red-200 px-4 py-2 rounded-xl font-semibold"
                        >
                          <FaTrash className="inline mr-2" />

                          Delete
                        </button>

                      </div>

                    </div>

                    {job.description && (
                      <p className="text-gray-600 mt-4">
                        {job.description}
                      </p>
                    )}

                    {job.skills &&
                      job.skills.length > 0 && (

                        <div className="flex flex-wrap gap-2 mt-4">

                          {job.skills.map(
                            (skill, index) => (

                              <span
                                key={index}
                                className="bg-slate-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                              >
                                {skill}
                              </span>

                            )
                          )}

                        </div>

                      )}

                  </div>

                ))}

              </div>

            )}

          </div>

          {/* ================================================= */}
          {/* APPLICANTS SECTION */}
          {/* ================================================= */}

          {selectedJob && (

            <div className="bg-white rounded-2xl shadow-md p-8 mt-8">

              {/* HEADER */}

              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">

                <div>

                  <h2 className="text-2xl font-bold">
                    Applicants
                  </h2>

                  <p className="text-gray-500 mt-1">
                    {selectedJob.jobTitle} —{" "}
                    {selectedJob.company}
                  </p>

                </div>

                <button
                  onClick={closeApplicants}
                  className="bg-gray-100 hover:bg-gray-200 px-5 py-2 rounded-xl font-semibold"
                >
                  Close
                </button>

              </div>

              {/* LOADING */}

              {loadingApplicants ? (

                <div className="text-center py-10">

                  <p className="text-blue-600 font-semibold text-lg">
                    Loading applicants...
                  </p>

                </div>

              ) : applicants.length === 0 ? (

                /* EMPTY */

                <div className="text-center py-10">

                  <FaUsers className="text-5xl text-gray-300 mx-auto mb-4" />

                  <h3 className="text-xl font-bold">
                    No Applicants Yet
                  </h3>

                  <p className="text-gray-500 mt-2">
                    Applicants will appear here when students apply.
                  </p>

                </div>

              ) : (

                /* APPLICANTS */

                <div className="space-y-6">

                  {applicants.map(
                    (application) => {

                      const candidate =
                        application.applicant;

                      return (
                        <div
                          key={application._id}
                          className="border rounded-2xl p-6"
                        >

                          {/* CANDIDATE HEADER */}

                          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">

                            <div>

                              <h3 className="text-2xl font-bold">
                                {candidate?.name ||
                                  "Unknown Candidate"}
                              </h3>

                              <p className="text-gray-500 mt-1">
                                {candidate?.email}
                              </p>

                              <p className="text-gray-600 mt-2">
                                {candidate?.college}
                              </p>

                              <p className="text-gray-600">
                                {candidate?.branch}
                              </p>

                              <p className="font-semibold mt-2">
                                CGPA:{" "}
                                {candidate?.cgpa ?? "N/A"}
                              </p>

                            </div>

                            {/* STATUS */}

                            <span
                              className={`px-4 py-2 rounded-full font-semibold ${
                                application.status ===
                                "Selected"
                                  ? "bg-green-100 text-green-700"
                                  : application.status ===
                                    "Rejected"
                                  ? "bg-red-100 text-red-700"
                                  : application.status ===
                                    "Shortlisted"
                                  ? "bg-purple-100 text-purple-700"
                                  : "bg-blue-100 text-blue-700"
                              }`}
                            >
                              {application.status}
                            </span>

                          </div>

                          {/* SKILLS */}

                          {candidate?.skills?.length >
                            0 && (

                            <div className="mt-5">

                              <h4 className="font-bold mb-3">
                                Skills
                              </h4>

                              <div className="flex flex-wrap gap-2">

                                {candidate.skills.map(
                                  (skill) => (

                                    <span
                                      key={skill}
                                      className="bg-slate-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                                    >
                                      {skill}
                                    </span>

                                  )
                                )}

                              </div>

                            </div>

                          )}

                          {/* PROFILE LINKS */}

                          <div className="flex flex-wrap gap-3 mt-6">

                            {candidate?.linkedin && (
                              <a
                                href={
                                  candidate.linkedin
                                }
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-xl font-semibold"
                              >
                                <FaLinkedin />
                                LinkedIn
                              </a>
                            )}

                            {candidate?.github && (
                              <a
                                href={
                                  candidate.github
                                }
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-xl font-semibold"
                              >
                                <FaGithub />
                                GitHub
                              </a>
                            )}

                            {candidate?.leetcode && (
                              <a
                                href={
                                  candidate.leetcode
                                }
                                target="_blank"
                                rel="noreferrer"
                                className="bg-orange-100 text-orange-700 px-4 py-2 rounded-xl font-semibold"
                              >
                                LeetCode
                              </a>
                            )}

                            {candidate?.resume?.url && (
                              <a
                                href={
                                  candidate.resume.url
                                }
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-xl font-semibold"
                              >
                                <FaFilePdf />
                                View Resume
                              </a>
                            )}

                          </div>

                          {/* ACTIONS */}

                          <div className="flex flex-wrap gap-3 mt-6 pt-5 border-t">

                            <button
                              onClick={() =>
                                handleStatusChange(
                                  application._id,
                                  "Shortlisted"
                                )
                              }
                              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-xl font-semibold"
                            >
                              <FaCheck />
                              Shortlist
                            </button>

                            <button
                              onClick={() =>
                                handleStatusChange(
                                  application._id,
                                  "Selected"
                                )
                              }
                              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-xl font-semibold"
                            >
                              <FaCheck />
                              Select
                            </button>

                            <button
                              onClick={() =>
                                handleStatusChange(
                                  application._id,
                                  "Rejected"
                                )
                              }
                              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-xl font-semibold"
                            >
                              <FaTimes />
                              Reject
                            </button>

                          </div>

                        </div>
                      );
                    }
                  )}

                </div>

              )}

            </div>

          )}

        </div>

      </div>

    </div>
  );
}

export default RecruiterDashboard;