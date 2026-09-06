import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";

import {
  getJobs,
  bookmarkJob,
  removeBookmark,
} from "../api/jobApi";

import {
  applyForJob,
  cancelApplication,
  getMyApplications,
} from "../api/applicationApi";

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // =====================================================
  // APPLICATION STATES
  // =====================================================

  const [applyingJob, setApplyingJob] = useState(null);
  const [appliedJobs, setAppliedJobs] = useState([]);

  // =====================================================
  // LOAD JOBS
  // =====================================================

  const loadJobs = async () => {
    try {
      setLoading(true);

      const res = await getJobs();

      console.log("Jobs Response:", res);

      setJobs(res.jobs || []);

    } catch (err) {
      console.error("Jobs Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOAD MY APPLICATIONS
  // =====================================================

  const loadApplications = async () => {
    try {
      const res = await getMyApplications();

      console.log("My Applications:", res);

      if (res.success) {
        const applicationIds = (res.applications || [])
          .filter((application) => application.job)
          .map((application) => {
            // If job is populated object
            if (typeof application.job === "object") {
              return application.job._id;
            }

            // If job is only an ID
            return application.job;
          });

        setAppliedJobs(applicationIds);
      }

    } catch (err) {
      console.error(
        "Load Applications Error:",
        err
      );
    }
  };

  // =====================================================
  // LOAD ALL DATA
  // =====================================================

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        loadJobs(),
        loadApplications(),
      ]);
    };

    loadData();
  }, []);

  // =====================================================
  // BOOKMARK / REMOVE BOOKMARK
  // =====================================================

  const handleBookmark = async (job) => {
    try {
      if (job.bookmarked) {
        await removeBookmark(job._id);
      } else {
        await bookmarkJob(job._id);
      }

      await loadJobs();

    } catch (err) {
      console.error(
        "Bookmark Error:",
        err
      );
    }
  };

  // =====================================================
  // APPLY FOR JOB
  // =====================================================

  const handleApply = async (jobId) => {
    try {
      setApplyingJob(jobId);

      const res = await applyForJob(jobId);

      console.log(
        "Application Response:",
        res
      );

      if (res.success) {

        setAppliedJobs((previous) => {

          // Prevent duplicate ID
          if (previous.includes(jobId)) {
            return previous;
          }

          return [
            ...previous,
            jobId,
          ];
        });

        alert(
          "Application submitted successfully! 🎉"
        );
      }

    } catch (err) {

      console.error(
        "Apply Error:",
        err
      );

      const message =
        err.response?.data?.message ||
        "Failed to apply for job.";

      alert(message);

    } finally {
      setApplyingJob(null);
    }
  };

  // =====================================================
  // CANCEL APPLICATION
  // =====================================================

  const handleCancelApplication = async (jobId) => {

    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this application?"
    );

    if (!confirmCancel) {
      return;
    }

    try {

      setApplyingJob(jobId);

      const res =
        await cancelApplication(jobId);

      console.log(
        "Cancel Application Response:",
        res
      );

      if (res.success) {

        // Remove job from applied jobs
        setAppliedJobs((previous) =>
          previous.filter(
            (id) => id !== jobId
          )
        );

        alert(
          "Application cancelled successfully."
        );
      }

    } catch (err) {

      console.error(
        "Cancel Application Error:",
        err
      );

      const message =
        err.response?.data?.message ||
        "Failed to cancel application.";

      alert(message);

    } finally {
      setApplyingJob(null);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-100">

        <h1 className="text-3xl font-bold text-blue-600">
          Loading Jobs...
        </h1>

      </div>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="flex min-h-screen bg-slate-100">

      {/* SIDEBAR */}

      <Sidebar />

      <div className="flex-1">

        {/* NAVBAR */}

        <Navbar />

        <div className="p-8 max-w-7xl mx-auto">

          {/* =====================================================
              HEADER
          ===================================================== */}

          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">

            <div>

              <h1 className="text-4xl font-bold">
                Jobs & Internships
              </h1>

              <p className="text-gray-500 mt-2">
                Find opportunities, apply for jobs,
                and save the ones you're interested in.
              </p>

            </div>

            <Link
              to="/saved-jobs"
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-xl font-semibold text-center"
            >
              🔖 Saved Jobs
            </Link>

          </div>

          {/* =====================================================
              JOB LIST
          ===================================================== */}

          {jobs.length === 0 ? (

            <div className="bg-white rounded-2xl shadow p-10 text-center">

              <h2 className="text-2xl font-bold">
                No Jobs Available
              </h2>

              <p className="text-gray-500 mt-2">
                New opportunities will appear here.
              </p>

            </div>

          ) : (

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {jobs.map((job) => {

                const isApplied =
                  appliedJobs.includes(job._id);

                const isApplying =
                  applyingJob === job._id;

                return (

                  <div
                    key={job._id}
                    className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition"
                  >

                    {/* =====================================================
                        COMPANY + TITLE
                    ===================================================== */}

                    <div className="flex justify-between items-start gap-4">

                      <div>

                        <h2 className="text-2xl font-bold">
                          {job.jobTitle}
                        </h2>

                        <p className="text-blue-600 font-semibold mt-1">
                          {job.company}
                        </p>

                      </div>

                      {/* BOOKMARK ICON */}

                      <button
                        onClick={() =>
                          handleBookmark(job)
                        }
                        className={`text-2xl ${
                          job.bookmarked
                            ? "text-yellow-500"
                            : "text-gray-400"
                        }`}
                        title={
                          job.bookmarked
                            ? "Remove Bookmark"
                            : "Bookmark Job"
                        }
                      >

                        {job.bookmarked
                          ? "★"
                          : "☆"}

                      </button>

                    </div>

                    {/* =====================================================
                        JOB DETAILS
                    ===================================================== */}

                    <div className="flex flex-wrap gap-2 mt-5">

                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                        📍 {job.location}
                      </span>

                      <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
                        💼 {job.jobType}
                      </span>

                    </div>

                    {/* =====================================================
                        DESCRIPTION
                    ===================================================== */}

                    {job.description && (

                      <p className="text-gray-600 mt-5">
                        {job.description}
                      </p>

                    )}

                    {/* =====================================================
                        SKILLS
                    ===================================================== */}

                    {job.skills?.length > 0 && (

                      <div className="mt-5">

                        <h3 className="font-bold mb-2">
                          Required Skills
                        </h3>

                        <div className="flex flex-wrap gap-2">

                          {job.skills.map(
                            (skill, index) => (

                              <span
                                key={`${skill}-${index}`}
                                className="bg-gray-100 text-gray-700 px-3 py-1 rounded-lg text-sm"
                              >
                                {skill}
                              </span>

                            )
                          )}

                        </div>

                      </div>

                    )}

                    {/* =====================================================
                        APPLICATION STATUS
                    ===================================================== */}

                    {isApplied && (

                      <div className="mt-5 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl font-semibold">

                        ✓ You have already applied for this job.

                      </div>

                    )}

                    {/* =====================================================
                        ACTION BUTTONS
                    ===================================================== */}

                    <div className="flex flex-col sm:flex-row gap-3 mt-6">

                      {/* =================================================
                          APPLY / CANCEL
                      ================================================= */}

                      {isApplied ? (

                        <button
                          onClick={() =>
                            handleCancelApplication(
                              job._id
                            )
                          }
                          disabled={isApplying}
                          className={`flex-1 py-3 rounded-xl font-semibold transition ${
                            isApplying
                              ? "bg-red-300 text-white cursor-wait"
                              : "bg-red-100 hover:bg-red-200 text-red-700"
                          }`}
                        >

                          {isApplying
                            ? "Cancelling..."
                            : "✕ Cancel Application"}

                        </button>

                      ) : (

                        <button
                          onClick={() =>
                            handleApply(job._id)
                          }
                          disabled={isApplying}
                          className={`flex-1 py-3 rounded-xl font-semibold transition ${
                            isApplying
                              ? "bg-blue-400 text-white cursor-wait"
                              : "bg-blue-600 hover:bg-blue-700 text-white"
                          }`}
                        >

                          {isApplying
                            ? "Applying..."
                            : "Apply on SkillBridge"}

                        </button>

                      )}

                      {/* =================================================
                          COMPANY WEBSITE
                      ================================================= */}

                      {job.applyLink && (

                        <a
                          href={job.applyLink}
                          target="_blank"
                          rel="noreferrer"
                          className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl text-center font-semibold transition"
                        >

                          🔗 Company Website

                        </a>

                      )}

                      {/* =================================================
                          SAVE JOB
                      ================================================= */}

                      <button
                        onClick={() =>
                          handleBookmark(job)
                        }
                        className={`flex-1 py-3 rounded-xl font-semibold transition ${
                          job.bookmarked
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >

                        {job.bookmarked
                          ? "★ Saved"
                          : "☆ Save Job"}

                      </button>

                    </div>

                  </div>

                );
              })}

            </div>

          )}

        </div>

      </div>

    </div>
  );
}

export default Jobs;