import { useEffect, useState } from "react";

import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";

import API from "../api/axios";

function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAdminStats = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const res = await API.get("/admin/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Admin Stats:", res.data);

      setData(res.data);
    } catch (err) {
      console.error("Admin Dashboard Error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load admin dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-100">
        <h1 className="text-3xl font-bold text-blue-600">
          Loading Admin Dashboard...
        </h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-100">
        <div className="bg-white rounded-2xl shadow-md p-8 text-center">
          <h1 className="text-2xl font-bold text-red-600">
            Access Error
          </h1>

          <p className="text-gray-600 mt-3">
            {error}
          </p>

          <button
            onClick={loadAdminStats}
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const stats = data?.stats || {};

  const status =
    stats.applicationsByStatus || {
      applied: 0,
      shortlisted: 0,
      selected: 0,
      rejected: 0,
    };

  const recentJobs = data?.recentJobs || [];
  const recentApplications =
    data?.recentApplications || [];

  const totalStatusApplications =
    status.applied +
    status.shortlisted +
    status.selected +
    status.rejected;

  const getStatusStyle = (applicationStatus) => {
    switch (applicationStatus) {
      case "Selected":
        return "bg-green-100 text-green-700";

      case "Shortlisted":
        return "bg-yellow-100 text-yellow-700";

      case "Rejected":
        return "bg-red-100 text-red-700";

      case "Applied":
      default:
        return "bg-blue-100 text-blue-700";
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <main className="p-8 max-w-7xl mx-auto">

          {/* HEADER */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                Admin Dashboard
              </h1>

              <p className="text-gray-500 mt-2">
                Monitor students, recruiters, jobs,
                and placement activity.
              </p>
            </div>

            <button
              onClick={loadAdminStats}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold transition"
            >
              🔄 Refresh Data
            </button>
          </div>

          {/* STAT CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

            {/* STUDENTS */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-500 font-medium">
                    Total Students
                  </p>

                  <h2 className="text-4xl font-bold mt-2">
                    {stats.totalStudents || 0}
                  </h2>
                </div>

                <div className="text-4xl">
                  🎓
                </div>
              </div>

              <p className="text-blue-600 text-sm mt-4 font-semibold">
                Registered students
              </p>
            </div>

            {/* RECRUITERS */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-500 font-medium">
                    Total Recruiters
                  </p>

                  <h2 className="text-4xl font-bold mt-2">
                    {stats.totalRecruiters || 0}
                  </h2>
                </div>

                <div className="text-4xl">
                  👨‍💼
                </div>
              </div>

              <p className="text-purple-600 text-sm mt-4 font-semibold">
                Registered recruiters
              </p>
            </div>

            {/* JOBS */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-500 font-medium">
                    Total Jobs
                  </p>

                  <h2 className="text-4xl font-bold mt-2">
                    {stats.totalJobs || 0}
                  </h2>
                </div>

                <div className="text-4xl">
                  💼
                </div>
              </div>

              <p className="text-green-600 text-sm mt-4 font-semibold">
                Jobs & internships
              </p>
            </div>

            {/* APPLICATIONS */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-500 font-medium">
                    Applications
                  </p>

                  <h2 className="text-4xl font-bold mt-2">
                    {stats.totalApplications || 0}
                  </h2>
                </div>

                <div className="text-4xl">
                  📝
                </div>
              </div>

              <p className="text-orange-600 text-sm mt-4 font-semibold">
                Total applications
              </p>
            </div>
          </div>

          {/* APPLICATION STATUS */}
          <div className="mt-8 bg-white rounded-2xl shadow-md p-6">

            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold">
                  Application Statistics
                </h2>

                <p className="text-gray-500 mt-1">
                  Current status of all job applications.
                </p>
              </div>

              <div className="text-3xl">
                📊
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

              {/* APPLIED */}
              <div className="border rounded-xl p-5">
                <p className="text-gray-500">
                  Applied
                </p>

                <h3 className="text-3xl font-bold text-blue-600 mt-2">
                  {status.applied}
                </h3>

                <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{
                      width:
                        totalStatusApplications > 0
                          ? `${(
                              (status.applied /
                                totalStatusApplications) *
                              100
                            ).toFixed(0)}%`
                          : "0%",
                    }}
                  />
                </div>
              </div>

              {/* SHORTLISTED */}
              <div className="border rounded-xl p-5">
                <p className="text-gray-500">
                  Shortlisted
                </p>

                <h3 className="text-3xl font-bold text-yellow-600 mt-2">
                  {status.shortlisted}
                </h3>

                <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                  <div
                    className="bg-yellow-500 h-2 rounded-full"
                    style={{
                      width:
                        totalStatusApplications > 0
                          ? `${(
                              (status.shortlisted /
                                totalStatusApplications) *
                              100
                            ).toFixed(0)}%`
                          : "0%",
                    }}
                  />
                </div>
              </div>

              {/* SELECTED */}
              <div className="border rounded-xl p-5">
                <p className="text-gray-500">
                  Selected
                </p>

                <h3 className="text-3xl font-bold text-green-600 mt-2">
                  {status.selected}
                </h3>

                <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{
                      width:
                        totalStatusApplications > 0
                          ? `${(
                              (status.selected /
                                totalStatusApplications) *
                              100
                            ).toFixed(0)}%`
                          : "0%",
                    }}
                  />
                </div>
              </div>

              {/* REJECTED */}
              <div className="border rounded-xl p-5">
                <p className="text-gray-500">
                  Rejected
                </p>

                <h3 className="text-3xl font-bold text-red-600 mt-2">
                  {status.rejected}
                </h3>

                <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                  <div
                    className="bg-red-500 h-2 rounded-full"
                    style={{
                      width:
                        totalStatusApplications > 0
                          ? `${(
                              (status.rejected /
                                totalStatusApplications) *
                              100
                            ).toFixed(0)}%`
                          : "0%",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* RECENT JOBS */}
          <div className="mt-8 bg-white rounded-2xl shadow-md p-6">

            <div className="mb-6">
              <h2 className="text-2xl font-bold">
                Recent Jobs
              </h2>

              <p className="text-gray-500 mt-1">
                Latest jobs posted on SkillBridge AI.
              </p>
            </div>

            {recentJobs.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No jobs available.
              </div>
            ) : (
              <div className="space-y-4">
                {recentJobs.map((job) => (
                  <div
                    key={job._id}
                    className="border rounded-xl p-5 flex flex-col md:flex-row md:justify-between md:items-center gap-4"
                  >
                    <div>
                      <h3 className="text-lg font-bold">
                        {job.jobTitle}
                      </h3>

                      <p className="text-blue-600 font-semibold mt-1">
                        {job.company}
                      </p>

                      <div className="flex flex-wrap gap-2 mt-3">
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                          📍 {job.location}
                        </span>

                        <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
                          💼 {job.jobType}
                        </span>
                      </div>
                    </div>

                    <div className="text-sm text-gray-500 md:text-right">
                      <p>
                        Posted by
                      </p>

                      <p className="font-semibold text-gray-700">
                        {job.postedBy?.name ||
                          "Unknown"}
                      </p>

                      <p className="mt-1">
                        {job.createdAt
                          ? new Date(
                              job.createdAt
                            ).toLocaleDateString()
                          : ""}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RECENT APPLICATIONS */}
          <div className="mt-8 bg-white rounded-2xl shadow-md p-6">

            <div className="mb-6">
              <h2 className="text-2xl font-bold">
                Recent Applications
              </h2>

              <p className="text-gray-500 mt-1">
                Latest student job applications.
              </p>
            </div>

            {recentApplications.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No applications available.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-left">
                      <th className="pb-4 pr-4">
                        Applicant
                      </th>

                      <th className="pb-4 pr-4">
                        Job
                      </th>

                      <th className="pb-4 pr-4">
                        Company
                      </th>

                      <th className="pb-4 pr-4">
                        Status
                      </th>

                      <th className="pb-4">
                        Date
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {recentApplications.map(
                      (application) => (
                        <tr
                          key={application._id}
                          className="border-b last:border-b-0"
                        >
                          <td className="py-4 pr-4">
                            <p className="font-semibold">
                              {application.applicant
                                ?.name ||
                                "Unknown"}
                            </p>

                            <p className="text-sm text-gray-500">
                              {application.applicant
                                ?.email || ""}
                            </p>
                          </td>

                          <td className="py-4 pr-4">
                            {application.job
                              ?.jobTitle || (
                              <span className="text-red-500">
                                Job Deleted
                              </span>
                            )}
                          </td>

                          <td className="py-4 pr-4">
                            {application.job
                              ?.company || "-"}
                          </td>

                          <td className="py-4 pr-4">
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusStyle(
                                application.status
                              )}`}
                            >
                              {application.status}
                            </span>
                          </td>

                          <td className="py-4 text-sm text-gray-500">
                            {application.createdAt
                              ? new Date(
                                  application.createdAt
                                ).toLocaleDateString()
                              : ""}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;