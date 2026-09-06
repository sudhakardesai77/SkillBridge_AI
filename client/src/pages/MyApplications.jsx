import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";

import { getMyApplications } from "../api/applicationApi";

function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  // =====================================================
  // LOAD APPLICATIONS
  // =====================================================

  const loadApplications = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const res = await getMyApplications();

      console.log("My Applications:", res);

      setApplications(res.applications || []);

    } catch (err) {
      console.error(
        "My Applications Error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to load applications."
      );

    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    loadApplications();
  }, []);

  // =====================================================
  // STATUS STYLE
  // =====================================================

  const getStatusStyle = (status) => {
    switch (status) {
      case "Shortlisted":
        return "bg-yellow-100 text-yellow-700";

      case "Selected":
        return "bg-green-100 text-green-700";

      case "Rejected":
        return "bg-red-100 text-red-700";

      case "Applied":
      default:
        return "bg-blue-100 text-blue-700";
    }
  };

  // =====================================================
  // STATUS ICON
  // =====================================================

  const getStatusIcon = (status) => {
    switch (status) {
      case "Shortlisted":
        return "🟠";

      case "Selected":
        return "🟢";

      case "Rejected":
        return "🔴";

      case "Applied":
      default:
        return "🟡";
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-100">
        <h1 className="text-3xl font-bold text-blue-600">
          Loading Applications...
        </h1>
      </div>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="flex min-h-screen bg-slate-100">

      <Sidebar />

      <div className="flex-1">

        <Navbar />

        <div className="p-8 max-w-7xl mx-auto">

          {/* =====================================================
              HEADER
          ===================================================== */}

          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">

            <div>

              <h1 className="text-4xl font-bold">
                📋 My Applications
              </h1>

              <p className="text-gray-500 mt-2">
                Track the jobs and internships you have
                applied for.
              </p>

            </div>

            <div className="flex flex-wrap gap-3">

              {/* REFRESH */}

              <button
                onClick={() =>
                  loadApplications(true)
                }
                disabled={refreshing}
                className={`px-5 py-3 rounded-xl font-semibold transition ${
                  refreshing
                    ? "bg-gray-300 text-gray-600 cursor-wait"
                    : "bg-purple-600 hover:bg-purple-700 text-white"
                }`}
              >
                {refreshing
                  ? "Refreshing..."
                  : "🔄 Refresh Status"}
              </button>

              {/* BROWSE JOBS */}

              <Link
                to="/jobs"
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold text-center"
              >
                Browse Jobs
              </Link>

            </div>

          </div>

          {/* =====================================================
              ERROR
          ===================================================== */}

          {error && (
            <div className="bg-red-100 border border-red-200 text-red-700 p-5 rounded-xl mb-6">
              {error}
            </div>
          )}

          {/* =====================================================
              EMPTY
          ===================================================== */}

          {applications.length === 0 && !error ? (

            <div className="bg-white rounded-2xl shadow p-10 text-center">

              <div className="text-5xl mb-4">
                📭
              </div>

              <h2 className="text-2xl font-bold">
                No Applications Yet
              </h2>

              <p className="text-gray-500 mt-2">
                You haven't applied for any jobs yet.
              </p>

              <Link
                to="/jobs"
                className="inline-block mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold"
              >
                Find Jobs
              </Link>

            </div>

          ) : (

            /* =====================================================
               APPLICATION LIST
            ===================================================== */

            <div className="space-y-6">

              {applications.map((application) => {

                const job = application.job;

                // Job may have been deleted
                if (!job) {
                  return (
                    <div
                      key={application._id}
                      className="bg-white rounded-2xl shadow-md p-6"
                    >
                      <p className="text-gray-500">
                        This job is no longer available.
                      </p>
                    </div>
                  );
                }

                return (

                  <div
                    key={application._id}
                    className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition"
                  >

                    {/* =================================================
                        TOP SECTION
                    ================================================= */}

                    <div className="flex flex-col md:flex-row md:justify-between gap-5">

                      <div>

                        <h2 className="text-2xl font-bold">
                          {job.jobTitle}
                        </h2>

                        <p className="text-blue-600 font-semibold mt-1">
                          {job.company}
                        </p>

                        {/* JOB DETAILS */}

                        <div className="flex flex-wrap gap-2 mt-4">

                          {job.location && (
                            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                              📍 {job.location}
                            </span>
                          )}

                          {job.jobType && (
                            <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
                              💼 {job.jobType}
                            </span>
                          )}

                        </div>

                      </div>

                      {/* =================================================
                          STATUS
                      ================================================= */}

                      <div>

                        <span
                          className={`inline-block px-5 py-2 rounded-full font-bold ${getStatusStyle(
                            application.status
                          )}`}
                        >

                          {getStatusIcon(
                            application.status
                          )}{" "}

                          {application.status || "Applied"}

                        </span>

                      </div>

                    </div>

                    {/* =================================================
                        STATUS MESSAGE
                    ================================================= */}

                    <div className="mt-5">

                      {application.status === "Applied" && (

                        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-xl">
                          Your application has been submitted.
                          Waiting for recruiter review.
                        </div>

                      )}

                      {application.status === "Shortlisted" && (

                        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-xl">
                          🎉 Congratulations! You have been
                          shortlisted by the recruiter.
                        </div>

                      )}

                      {application.status === "Selected" && (

                        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl">
                          🎉 Congratulations! You have been
                          selected for this opportunity.
                        </div>

                      )}

                      {application.status === "Rejected" && (

                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
                          Your application was not selected
                          for this opportunity.
                        </div>

                      )}

                    </div>

                    {/* =================================================
                        DESCRIPTION
                    ================================================= */}

                    {job.description && (

                      <p className="text-gray-600 mt-5">
                        {job.description}
                      </p>

                    )}

                    {/* =================================================
                        SKILLS
                    ================================================= */}

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

                    {/* =================================================
                        APPLICATION DATE
                    ================================================= */}

                    <p className="text-sm text-gray-500 mt-5">

                      Applied on:{" "}

                      {application.createdAt
                        ? new Date(
                            application.createdAt
                          ).toLocaleDateString()
                        : "N/A"}

                    </p>

                    {/* =================================================
                        LAST UPDATED
                    ================================================= */}

                    {application.updatedAt &&
                      application.updatedAt !==
                        application.createdAt && (

                        <p className="text-sm text-gray-500 mt-1">

                          Last updated:{" "}

                          {new Date(
                            application.updatedAt
                          ).toLocaleDateString()}

                        </p>

                    )}

                    {/* =================================================
                        ACTIONS
                    ================================================= */}

                    <div className="flex flex-wrap gap-3 mt-6">

                      {/* VIEW JOB */}

                      {job.applyLink && (

                        <a
                          href={job.applyLink}
                          target="_blank"
                          rel="noreferrer"
                          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold"
                        >
                          🔗 View Job
                        </a>

                      )}

                      {/* BROWSE MORE */}

                      <Link
                        to="/jobs"
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-3 rounded-xl font-semibold"
                      >
                        Browse More Jobs
                      </Link>

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

export default MyApplications;