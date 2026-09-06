import { useEffect, useState } from "react";

import {
  FaBriefcase,
  FaSearch,
  FaSyncAlt,
  FaMapMarkerAlt,
  FaUserTie,
  FaCalendarAlt,
  FaTrash,
  FaExternalLinkAlt,
} from "react-icons/fa";

import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";

import API from "../api/axios";

function AdminJobs() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  // =====================================================
  // LOAD ALL JOBS
  // =====================================================

  const loadJobs = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await API.get(
        "/jobs/admin/all",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        const jobData =
          response.data.jobs || [];

        setJobs(jobData);
        setFilteredJobs(jobData);
      }
    } catch (err) {
      console.error(
        "Admin Jobs Error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to load jobs."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    loadJobs();
  }, []);

  // =====================================================
  // SEARCH + FILTER
  // =====================================================

  useEffect(() => {
    let result = [...jobs];

    if (search.trim()) {
      const searchText =
        search.toLowerCase();

      result = result.filter((job) => {
        return (
          job.company
            ?.toLowerCase()
            .includes(searchText) ||
          job.jobTitle
            ?.toLowerCase()
            .includes(searchText) ||
          job.location
            ?.toLowerCase()
            .includes(searchText) ||
          job.postedBy?.name
            ?.toLowerCase()
            .includes(searchText) ||
          job.postedBy?.email
            ?.toLowerCase()
            .includes(searchText)
        );
      });
    }

    if (typeFilter !== "all") {
      result = result.filter(
        (job) =>
          job.jobType === typeFilter
      );
    }

    setFilteredJobs(result);
  }, [search, typeFilter, jobs]);

  // =====================================================
  // DELETE JOB
  // =====================================================

  const handleDelete = async (job) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${job.jobTitle}" at ${job.company}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      const token =
        localStorage.getItem("token");

      const response =
        await API.delete(
          `/jobs/admin/${job._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

      if (response.data.success) {
        setJobs((previousJobs) =>
          previousJobs.filter(
            (item) =>
              item._id !== job._id
          )
        );
      }
    } catch (err) {
      console.error(
        "Delete Admin Job Error:",
        err
      );

      alert(
        err.response?.data?.message ||
          "Failed to delete job."
      );
    }
  };

  // =====================================================
  // DATE FORMAT
  // =====================================================

  const formatDate = (date) => {
    if (!date) {
      return "N/A";
    }

    return new Date(
      date
    ).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // =====================================================
  // JOB TYPE STYLE
  // =====================================================

  const getJobTypeStyle = (type) => {
    switch (type) {
      case "Internship":
        return "bg-purple-100 text-purple-700";

      case "Part-time":
        return "bg-yellow-100 text-yellow-700";

      case "Full-time":
      default:
        return "bg-green-100 text-green-700";
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex">

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <Sidebar />

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <div className="flex-1 min-w-0">

        <Navbar />

        <main className="p-6 md:p-8 max-w-7xl mx-auto">

          {/* =================================================
              HEADER
          ================================================= */}

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

            <div>

              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                Job Management
              </h1>

              <p className="text-gray-500 mt-2">
                Monitor and manage all jobs posted on SkillBridge AI.
              </p>

            </div>

            <button
              onClick={loadJobs}
              disabled={loading}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white px-5 py-3 rounded-xl font-semibold transition"
            >
              <FaSyncAlt
                className={
                  loading
                    ? "animate-spin"
                    : ""
                }
              />

              Refresh
            </button>

          </div>


          {/* =================================================
              SUMMARY CARD
          ================================================= */}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">

            {/* TOTAL JOBS */}

            <div className="bg-white rounded-2xl shadow-md p-6">

              <div className="flex justify-between items-center">

                <div>

                  <p className="text-gray-500 font-medium">
                    Total Jobs
                  </p>

                  <h2 className="text-4xl font-bold mt-2 text-gray-900">
                    {jobs.length}
                  </h2>

                </div>

                <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-xl">
                  <FaBriefcase />
                </div>

              </div>

              <p className="text-blue-600 text-sm mt-4 font-semibold">
                All posted opportunities
              </p>

            </div>


            {/* FULL TIME */}

            <div className="bg-white rounded-2xl shadow-md p-6">

              <div className="flex justify-between items-center">

                <div>

                  <p className="text-gray-500 font-medium">
                    Full-time
                  </p>

                  <h2 className="text-4xl font-bold mt-2 text-gray-900">
                    {
                      jobs.filter(
                        (job) =>
                          job.jobType ===
                          "Full-time"
                      ).length
                    }
                  </h2>

                </div>

                <div className="w-12 h-12 rounded-xl bg-green-100 text-green-600 flex items-center justify-center text-xl">
                  <FaBriefcase />
                </div>

              </div>

              <p className="text-green-600 text-sm mt-4 font-semibold">
                Full-time positions
              </p>

            </div>


            {/* INTERNSHIPS */}

            <div className="bg-white rounded-2xl shadow-md p-6">

              <div className="flex justify-between items-center">

                <div>

                  <p className="text-gray-500 font-medium">
                    Internships
                  </p>

                  <h2 className="text-4xl font-bold mt-2 text-gray-900">
                    {
                      jobs.filter(
                        (job) =>
                          job.jobType ===
                          "Internship"
                      ).length
                    }
                  </h2>

                </div>

                <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center text-xl">
                  <FaBriefcase />
                </div>

              </div>

              <p className="text-purple-600 text-sm mt-4 font-semibold">
                Internship opportunities
              </p>

            </div>

          </div>


          {/* =================================================
              SEARCH + FILTER
          ================================================= */}

          <div className="bg-white rounded-2xl shadow-md p-5 mb-6">

            <div className="flex flex-col md:flex-row gap-4">

              {/* SEARCH */}

              <div className="relative flex-1">

                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                <input
                  type="text"
                  placeholder="Search by company, job title, location or recruiter..."
                  value={search}
                  onChange={(e) =>
                    setSearch(
                      e.target.value
                    )
                  }
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                />

              </div>


              {/* TYPE FILTER */}

              <select
                value={typeFilter}
                onChange={(e) =>
                  setTypeFilter(
                    e.target.value
                  )
                }
                className="md:w-52 px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >

                <option value="all">
                  All Job Types
                </option>

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

            <p className="text-sm text-gray-500 mt-3">

              Showing{" "}

              <span className="font-semibold text-gray-700">
                {filteredJobs.length}
              </span>{" "}

              of{" "}

              <span className="font-semibold text-gray-700">
                {jobs.length}
              </span>{" "}

              jobs

            </p>

          </div>


          {/* =================================================
              ERROR
          ================================================= */}

          {error && (

            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6">
              {error}
            </div>

          )}


          {/* =================================================
              LOADING
          ================================================= */}

          {loading ? (

            <div className="bg-white rounded-2xl shadow-md p-12 text-center">

              <FaSyncAlt className="animate-spin text-blue-600 text-3xl mx-auto mb-4" />

              <p className="text-gray-500">
                Loading jobs...
              </p>

            </div>

          ) : filteredJobs.length === 0 ? (

            /* =================================================
               NO JOBS
            ================================================= */

            <div className="bg-white rounded-2xl shadow-md p-12 text-center">

              <FaBriefcase className="text-gray-300 text-5xl mx-auto mb-4" />

              <h3 className="text-xl font-semibold text-gray-700">
                No jobs found
              </h3>

              <p className="text-gray-500 mt-2">
                Try changing your search or filter.
              </p>

            </div>

          ) : (

            /* =================================================
               JOB TABLE
            ================================================= */

            <div className="bg-white rounded-2xl shadow-md overflow-hidden">

              <div className="overflow-x-auto">

                <table className="w-full">

                  <thead className="bg-gray-50 border-b">

                    <tr>

                      <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Job
                      </th>

                      <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Location
                      </th>

                      <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Type
                      </th>

                      <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Recruiter
                      </th>

                      <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Posted
                      </th>

                      <th className="text-center px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Action
                      </th>

                    </tr>

                  </thead>


                  <tbody className="divide-y divide-gray-100">

                    {filteredJobs.map(
                      (job) => (

                        <tr
                          key={job._id}
                          className="hover:bg-gray-50 transition"
                        >

                          {/* JOB */}

                          <td className="px-6 py-5">

                            <div>

                              <p className="font-bold text-gray-800">
                                {job.jobTitle}
                              </p>

                              <p className="text-blue-600 font-semibold mt-1">
                                {job.company}
                              </p>

                              {job.skills &&
                                job.skills.length >
                                  0 && (

                                  <div className="flex flex-wrap gap-1 mt-2">

                                    {job.skills
                                      .slice(0, 4)
                                      .map(
                                        (
                                          skill,
                                          index
                                        ) => (
                                          <span
                                            key={
                                              index
                                            }
                                            className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs"
                                          >
                                            {skill}
                                          </span>
                                        )
                                      )}

                                    {job.skills
                                      .length >
                                      4 && (
                                      <span className="text-xs text-gray-400 px-1 py-1">
                                        +
                                        {job.skills
                                          .length -
                                          4}{" "}
                                        more
                                      </span>
                                    )}

                                  </div>

                                )}

                            </div>

                          </td>


                          {/* LOCATION */}

                          <td className="px-6 py-5">

                            <div className="flex items-center gap-2 text-sm text-gray-600">

                              <FaMapMarkerAlt className="text-gray-400" />

                              {job.location ||
                                "Not specified"}

                            </div>

                          </td>


                          {/* TYPE */}

                          <td className="px-6 py-5">

                            <span
                              className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getJobTypeStyle(
                                job.jobType
                              )}`}
                            >
                              {job.jobType ||
                                "Full-time"}
                            </span>

                          </td>


                          {/* RECRUITER */}

                          <td className="px-6 py-5">

                            {job.postedBy ? (

                              <div>

                                <p className="font-semibold text-gray-700 flex items-center gap-2">

                                  <FaUserTie className="text-gray-400" />

                                  {job.postedBy
                                    .name ||
                                    "Unknown"}

                                </p>

                                <p className="text-xs text-gray-500 mt-1">
                                  {
                                    job.postedBy
                                      .email
                                  }
                                </p>

                              </div>

                            ) : (

                              <span className="text-gray-400 text-sm">
                                Unknown recruiter
                              </span>

                            )}

                          </td>


                          {/* DATE */}

                          <td className="px-6 py-5">

                            <div className="flex items-center gap-2 text-sm text-gray-500">

                              <FaCalendarAlt />

                              {formatDate(
                                job.createdAt
                              )}

                            </div>

                          </td>


                          {/* ACTION */}

                          <td className="px-6 py-5">

                            <div className="flex items-center justify-center gap-2">

                              {job.applyLink && (

                                <a
                                  href={
                                    job.applyLink
                                  }
                                  target="_blank"
                                  rel="noreferrer"
                                  title="Open application link"
                                  className="w-9 h-9 flex items-center justify-center rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition"
                                >
                                  <FaExternalLinkAlt />
                                </a>

                              )}

                              <button
                                onClick={() =>
                                  handleDelete(
                                    job
                                  )
                                }
                                title="Delete job"
                                className="w-9 h-9 flex items-center justify-center rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition"
                              >
                                <FaTrash />
                              </button>

                            </div>

                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              </div>

            </div>

          )}

        </main>

      </div>

    </div>
  );
}

export default AdminJobs;