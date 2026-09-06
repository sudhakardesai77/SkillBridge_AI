import { useEffect, useState } from "react";
import {
  FaUsers,
  FaUserGraduate,
  FaUserTie,
  FaSearch,
  FaSyncAlt,
  FaEnvelope,
  FaUniversity,
  FaCodeBranch,
  FaCalendarAlt,
} from "react-icons/fa";

import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";
import API from "../api/axios";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  // ======================================================
  // LOAD USERS
  // ======================================================

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await API.get("/admin/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setUsers(response.data.users || []);
        setFilteredUsers(response.data.users || []);
      }
    } catch (error) {
      console.error("Admin Users Error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load users."
      );
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // INITIAL LOAD
  // ======================================================

  useEffect(() => {
    loadUsers();
  }, []);

  // ======================================================
  // SEARCH + FILTER
  // ======================================================

  useEffect(() => {
    let result = [...users];

    // Search
    if (search.trim()) {
      const searchText =
        search.toLowerCase();

      result = result.filter((user) => {
        return (
          user.name
            ?.toLowerCase()
            .includes(searchText) ||
          user.email
            ?.toLowerCase()
            .includes(searchText) ||
          user.college
            ?.toLowerCase()
            .includes(searchText) ||
          user.branch
            ?.toLowerCase()
            .includes(searchText)
        );
      });
    }

    // Role filter
    if (roleFilter !== "all") {
      result = result.filter(
        (user) =>
          user.role === roleFilter
      );
    }

    setFilteredUsers(result);
  }, [search, roleFilter, users]);

  // ======================================================
  // COUNTS
  // ======================================================

  const totalUsers = users.length;

  const totalStudents = users.filter(
    (user) => user.role === "student"
  ).length;

  const totalRecruiters = users.filter(
    (user) => user.role === "recruiter"
  ).length;

  // ======================================================
  // FORMAT DATE
  // ======================================================

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // ======================================================
  // ROLE BADGE
  // ======================================================

  const getRoleBadge = (role) => {
    if (role === "admin") {
      return (
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
          Admin
        </span>
      );
    }

    if (role === "recruiter") {
      return (
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700">
          <FaUserTie />
          Recruiter
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
        <FaUserGraduate />
        Student
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">

      {/* ==================================================
          SIDEBAR
      ================================================== */}

      <Sidebar />

      {/* ==================================================
          MAIN CONTENT
      ================================================== */}

      <div className="flex-1 flex flex-col min-w-0">

        <Navbar />

        <main className="p-6 md:p-8">

          {/* ==================================================
              HEADER
          ================================================== */}

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                User Management
              </h1>

              <p className="text-gray-500 mt-1">
                View and manage SkillBridge AI users
              </p>
            </div>

            <button
              onClick={loadUsers}
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

          {/* ==================================================
              SUMMARY CARDS
          ================================================== */}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">

            {/* Total Users */}

            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-gray-500 text-sm font-medium">
                    Total Users
                  </p>

                  <h2 className="text-3xl font-bold text-gray-800 mt-2">
                    {totalUsers}
                  </h2>
                </div>

                <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-xl">
                  <FaUsers />
                </div>

              </div>

            </div>

            {/* Students */}

            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-gray-500 text-sm font-medium">
                    Students
                  </p>

                  <h2 className="text-3xl font-bold text-gray-800 mt-2">
                    {totalStudents}
                  </h2>
                </div>

                <div className="w-12 h-12 rounded-xl bg-green-100 text-green-600 flex items-center justify-center text-xl">
                  <FaUserGraduate />
                </div>

              </div>

            </div>

            {/* Recruiters */}

            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-gray-500 text-sm font-medium">
                    Recruiters
                  </p>

                  <h2 className="text-3xl font-bold text-gray-800 mt-2">
                    {totalRecruiters}
                  </h2>
                </div>

                <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center text-xl">
                  <FaUserTie />
                </div>

              </div>

            </div>

          </div>

          {/* ==================================================
              SEARCH + FILTER
          ================================================== */}

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6">

            <div className="flex flex-col md:flex-row gap-4">

              {/* Search */}

              <div className="relative flex-1">

                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                <input
                  type="text"
                  placeholder="Search by name, email, college or branch..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />

              </div>

              {/* Role Filter */}

              <select
                value={roleFilter}
                onChange={(e) =>
                  setRoleFilter(e.target.value)
                }
                className="md:w-52 px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="all">
                  All Roles
                </option>

                <option value="student">
                  Students
                </option>

                <option value="recruiter">
                  Recruiters
                </option>

                <option value="admin">
                  Admins
                </option>
              </select>

            </div>

            <p className="text-sm text-gray-500 mt-3">
              Showing{" "}
              <span className="font-semibold text-gray-700">
                {filteredUsers.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-700">
                {users.length}
              </span>{" "}
              users
            </p>

          </div>

          {/* ==================================================
              ERROR
          ================================================== */}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6">
              {error}
            </div>
          )}

          {/* ==================================================
              LOADING
          ================================================== */}

          {loading ? (
            <div className="bg-white rounded-2xl shadow-sm p-12 text-center">

              <FaSyncAlt className="animate-spin text-blue-600 text-3xl mx-auto mb-4" />

              <p className="text-gray-500">
                Loading users...
              </p>

            </div>
          ) : filteredUsers.length === 0 ? (

            /* ==================================================
               NO USERS
            ================================================== */

            <div className="bg-white rounded-2xl shadow-sm p-12 text-center">

              <FaUsers className="text-gray-300 text-5xl mx-auto mb-4" />

              <h3 className="text-xl font-semibold text-gray-700">
                No users found
              </h3>

              <p className="text-gray-500 mt-2">
                Try changing your search or filter.
              </p>

            </div>

          ) : (

            /* ==================================================
               USER TABLE
            ================================================== */

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

              <div className="overflow-x-auto">

                <table className="w-full">

                  <thead className="bg-gray-50 border-b border-gray-200">

                    <tr>

                      <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        User
                      </th>

                      <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Role
                      </th>

                      <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Education
                      </th>

                      <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        CGPA
                      </th>

                      <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Joined
                      </th>

                    </tr>

                  </thead>

                  <tbody className="divide-y divide-gray-100">

                    {filteredUsers.map(
                      (user) => (

                        <tr
                          key={user._id}
                          className="hover:bg-gray-50 transition"
                        >

                          {/* USER */}

                          <td className="px-6 py-5">

                            <div className="flex items-center gap-4">

                              <div className="w-11 h-11 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                                {user.name
                                  ?.charAt(0)
                                  ?.toUpperCase() ||
                                  "U"}
                              </div>

                              <div>

                                <p className="font-semibold text-gray-800">
                                  {user.name ||
                                    "Unknown User"}
                                </p>

                                <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                                  <FaEnvelope className="text-xs" />
                                  {user.email}
                                </p>

                              </div>

                            </div>

                          </td>

                          {/* ROLE */}

                          <td className="px-6 py-5">
                            {getRoleBadge(
                              user.role
                            )}
                          </td>

                          {/* EDUCATION */}

                          <td className="px-6 py-5">

                            {user.role ===
                            "student" ? (
                              <div className="space-y-1">

                                <p className="text-sm text-gray-700 flex items-center gap-2">
                                  <FaUniversity className="text-gray-400" />
                                  {user.college ||
                                    "Not specified"}
                                </p>

                                <p className="text-sm text-gray-500 flex items-center gap-2">
                                  <FaCodeBranch className="text-gray-400" />
                                  {user.branch ||
                                    "Not specified"}
                                </p>

                              </div>
                            ) : (
                              <span className="text-sm text-gray-400">
                                Not applicable
                              </span>
                            )}

                          </td>

                          {/* CGPA */}

                          <td className="px-6 py-5">

                            {user.role ===
                            "student" ? (
                              <span className="font-semibold text-gray-700">
                                {user.cgpa
                                  ? user.cgpa.toFixed
                                    ? user.cgpa.toFixed(2)
                                    : user.cgpa
                                  : "N/A"}
                              </span>
                            ) : (
                              <span className="text-gray-400">
                                —
                              </span>
                            )}

                          </td>

                          {/* JOINED */}

                          <td className="px-6 py-5">

                            <div className="flex items-center gap-2 text-sm text-gray-500">

                              <FaCalendarAlt />

                              {formatDate(
                                user.createdAt
                              )}

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

export default AdminUsers;