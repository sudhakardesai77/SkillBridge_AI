import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";
import API from "../api/axios";

function AdminApplications() {
  const [applications, setApplications] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const loadApplications = async () => {
    try {
      setError("");

      const res = await API.get("/applications/admin/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setApplications(res.data.applications || []);
    } catch (err) {
      console.error("Admin Applications Error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load applications."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const filteredApplications = useMemo(() => {
    return applications.filter((application) => {
      const applicant = application.applicant || {};
      const job = application.job || {};
      const recruiter = job.postedBy || {};

      const searchText = `
        ${applicant.name || ""}
        ${applicant.email || ""}
        ${job.company || ""}
        ${job.jobTitle || ""}
        ${recruiter.name || ""}
        ${recruiter.email || ""}
      `.toLowerCase();

      const matchesSearch = searchText.includes(
        search.toLowerCase()
      );

      const matchesStatus =
        statusFilter === "All" ||
        application.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [applications, search, statusFilter]);

  const counts = useMemo(() => {
    return {
      total: applications.length,
      applied: applications.filter(
        (app) => app.status === "Applied"
      ).length,
      shortlisted: applications.filter(
        (app) => app.status === "Shortlisted"
      ).length,
      selected: applications.filter(
        (app) => app.status === "Selected"
      ).length,
      rejected: applications.filter(
        (app) => app.status === "Rejected"
      ).length,
    };
  }, [applications]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadApplications();
  };

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Selected":
        return "status selected";

      case "Shortlisted":
        return "status shortlisted";

      case "Rejected":
        return "status rejected";

      default:
        return "status applied";
    }
  };

  return (
    <div className="admin-applications-page">
      <Navbar />

      <div className="admin-layout">
        <Sidebar />

        <main className="admin-main">
          <div className="page-header">
            <div>
              <p className="eyebrow">ADMIN PANEL</p>

              <h1>Applications</h1>

              <p className="subtitle">
                Monitor all student job applications across the
                platform.
              </p>
            </div>

            <button
              className="refresh-btn"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              {refreshing ? "Refreshing..." : "↻ Refresh"}
            </button>
          </div>

          {/* Statistics */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">📋</div>
              <div>
                <span>Total Applications</span>
                <strong>{counts.total}</strong>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">🕐</div>
              <div>
                <span>Applied</span>
                <strong>{counts.applied}</strong>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">⭐</div>
              <div>
                <span>Shortlisted</span>
                <strong>{counts.shortlisted}</strong>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">✓</div>
              <div>
                <span>Selected</span>
                <strong>{counts.selected}</strong>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">✕</div>
              <div>
                <span>Rejected</span>
                <strong>{counts.rejected}</strong>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="filters-card">
            <div className="search-wrapper">
              <span>🔎</span>

              <input
                type="text"
                placeholder="Search student, email, company, job or recruiter..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />
            </div>

            <div className="status-filters">
              {[
                "All",
                "Applied",
                "Shortlisted",
                "Selected",
                "Rejected",
              ].map((status) => (
                <button
                  key={status}
                  className={
                    statusFilter === status
                      ? "filter-btn active"
                      : "filter-btn"
                  }
                  onClick={() =>
                    setStatusFilter(status)
                  }
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="error-box">
              {error}
            </div>
          )}

          {/* Table */}
          <div className="applications-card">
            <div className="table-header">
              <div>
                <h2>All Applications</h2>

                <p>
                  Showing{" "}
                  <strong>
                    {filteredApplications.length}
                  </strong>{" "}
                  of {applications.length} applications
                </p>
              </div>
            </div>

            {loading ? (
              <div className="empty-state">
                <div className="loader"></div>
                <p>Loading applications...</p>
              </div>
            ) : filteredApplications.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📭</div>

                <h3>No applications found</h3>

                <p>
                  Try changing your search or status filter.
                </p>
              </div>
            ) : (
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Job</th>
                      <th>Company</th>
                      <th>Recruiter</th>
                      <th>Applied On</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredApplications.map(
                      (application) => {
                        const applicant =
                          application.applicant || {};

                        const job =
                          application.job || {};

                        const recruiter =
                          job.postedBy || {};

                        return (
                          <tr key={application._id}>
                            {/* Student */}
                            <td>
                              <div className="student-cell">
                                <div className="avatar">
                                  {(
                                    applicant.name ||
                                    "U"
                                  )
                                    .charAt(0)
                                    .toUpperCase()}
                                </div>

                                <div>
                                  <strong>
                                    {applicant.name ||
                                      "Unknown Student"}
                                  </strong>

                                  <span>
                                    {applicant.email ||
                                      "No email"}
                                  </span>

                                  {applicant.college && (
                                    <small>
                                      {
                                        applicant.college
                                      }
                                    </small>
                                  )}
                                </div>
                              </div>
                            </td>

                            {/* Job */}
                            <td>
                              {job.jobTitle ? (
                                <div className="job-cell">
                                  <strong>
                                    {job.jobTitle}
                                  </strong>

                                  <span>
                                    {job.location ||
                                      "Location not specified"}
                                  </span>
                                </div>
                              ) : (
                                <span className="muted">
                                  Job no longer available
                                </span>
                              )}
                            </td>

                            {/* Company */}
                            <td>
                              <strong>
                                {job.company || "—"}
                              </strong>
                            </td>

                            {/* Recruiter */}
                            <td>
                              {recruiter.name ? (
                                <div className="recruiter-cell">
                                  <strong>
                                    {recruiter.name}
                                  </strong>

                                  <span>
                                    {recruiter.email ||
                                      "No email"}
                                  </span>
                                </div>
                              ) : (
                                <span className="muted">
                                  —
                                </span>
                              )}
                            </td>

                            {/* Date */}
                            <td>
                              <span className="date-text">
                                {formatDate(
                                  application.createdAt
                                )}
                              </span>
                            </td>

                            {/* Status */}
                            <td>
                              <span
                                className={getStatusClass(
                                  application.status
                                )}
                              >
                                <span className="status-dot"></span>

                                {application.status ||
                                  "Applied"}
                              </span>
                            </td>
                          </tr>
                        );
                      }
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>

      <style>{`
        * {
          box-sizing: border-box;
        }

        .admin-applications-page {
          min-height: 100vh;
          background: #f6f7fb;
        }

        .admin-layout {
          display: flex;
        }

        .admin-main {
          flex: 1;
          min-width: 0;
          padding: 32px;
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 20px;
          margin-bottom: 28px;
        }

        .eyebrow {
          margin: 0 0 7px;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 1.4px;
          color: #6366f1;
        }

        .page-header h1 {
          margin: 0;
          font-size: 32px;
          color: #111827;
        }

        .subtitle {
          margin: 8px 0 0;
          color: #6b7280;
          font-size: 14px;
        }

        .refresh-btn {
          border: 1px solid #e5e7eb;
          background: white;
          color: #374151;
          border-radius: 10px;
          padding: 10px 16px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
        }

        .refresh-btn:hover {
          background: #f9fafb;
        }

        .refresh-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .stats-grid {
          display: grid;
          grid-template-columns:
            repeat(5, minmax(0, 1fr));
          gap: 16px;
          margin-bottom: 22px;
        }

        .stat-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 14px;
          padding: 18px;
          display: flex;
          align-items: center;
          gap: 13px;
        }

        .stat-icon {
          width: 42px;
          height: 42px;
          border-radius: 11px;
          background: #f3f4ff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 19px;
        }

        .stat-card span {
          display: block;
          color: #6b7280;
          font-size: 12px;
          margin-bottom: 4px;
        }

        .stat-card strong {
          color: #111827;
          font-size: 23px;
        }

        .filters-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 14px;
          padding: 18px;
          margin-bottom: 20px;
        }

        .search-wrapper {
          display: flex;
          align-items: center;
          gap: 10px;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          padding: 0 13px;
          height: 44px;
          margin-bottom: 14px;
        }

        .search-wrapper input {
          flex: 1;
          border: none;
          outline: none;
          font-size: 14px;
          color: #111827;
        }

        .search-wrapper input::placeholder {
          color: #9ca3af;
        }

        .status-filters {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .filter-btn {
          border: 1px solid #e5e7eb;
          background: white;
          border-radius: 8px;
          padding: 8px 13px;
          font-size: 13px;
          color: #4b5563;
          cursor: pointer;
        }

        .filter-btn:hover {
          background: #f9fafb;
        }

        .filter-btn.active {
          background: #111827;
          border-color: #111827;
          color: white;
        }

        .applications-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 14px;
          overflow: hidden;
        }

        .table-header {
          padding: 20px 22px;
          border-bottom: 1px solid #eef0f3;
        }

        .table-header h2 {
          margin: 0;
          color: #111827;
          font-size: 18px;
        }

        .table-header p {
          margin: 5px 0 0;
          color: #6b7280;
          font-size: 13px;
        }

        .table-container {
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          min-width: 1050px;
        }

        th {
          text-align: left;
          padding: 13px 18px;
          background: #f9fafb;
          color: #6b7280;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.7px;
          font-weight: 700;
          white-space: nowrap;
        }

        td {
          padding: 16px 18px;
          border-top: 1px solid #f0f1f3;
          vertical-align: middle;
          color: #374151;
          font-size: 13px;
        }

        tbody tr:hover {
          background: #fafafa;
        }

        .student-cell {
          display: flex;
          align-items: center;
          gap: 11px;
          min-width: 220px;
        }

        .avatar {
          width: 38px;
          height: 38px;
          flex-shrink: 0;
          border-radius: 10px;
          background: #eef2ff;
          color: #4f46e5;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 14px;
        }

        .student-cell strong,
        .job-cell strong,
        .recruiter-cell strong {
          display: block;
          color: #111827;
          font-size: 13px;
          margin-bottom: 3px;
        }

        .student-cell span,
        .job-cell span,
        .recruiter-cell span {
          display: block;
          color: #6b7280;
          font-size: 12px;
        }

        .student-cell small {
          display: block;
          color: #9ca3af;
          font-size: 11px;
          margin-top: 3px;
          max-width: 190px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .job-cell {
          min-width: 170px;
        }

        .recruiter-cell {
          min-width: 150px;
        }

        .muted {
          color: #9ca3af;
          font-size: 12px;
        }

        .date-text {
          color: #4b5563;
          white-space: nowrap;
        }

        .status {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          border-radius: 999px;
          padding: 6px 10px;
          font-size: 11px;
          font-weight: 700;
          white-space: nowrap;
        }

        .status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: currentColor;
        }

        .status.applied {
          background: #eff6ff;
          color: #2563eb;
        }

        .status.shortlisted {
          background: #fff7ed;
          color: #ea580c;
        }

        .status.selected {
          background: #ecfdf5;
          color: #059669;
        }

        .status.rejected {
          background: #fef2f2;
          color: #dc2626;
        }

        .error-box {
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #b91c1c;
          padding: 13px 15px;
          border-radius: 10px;
          margin-bottom: 18px;
          font-size: 13px;
        }

        .empty-state {
          min-height: 280px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          color: #6b7280;
          padding: 30px;
        }

        .empty-icon {
          font-size: 35px;
          margin-bottom: 10px;
        }

        .empty-state h3 {
          margin: 0 0 5px;
          color: #374151;
          font-size: 16px;
        }

        .empty-state p {
          margin: 0;
          font-size: 13px;
        }

        .loader {
          width: 28px;
          height: 28px;
          border: 3px solid #e5e7eb;
          border-top-color: #6366f1;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin-bottom: 12px;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 1200px) {
          .stats-grid {
            grid-template-columns:
              repeat(3, minmax(0, 1fr));
          }
        }

        @media (max-width: 768px) {
          .admin-main {
            padding: 20px 14px;
          }

          .page-header {
            flex-direction: column;
          }

          .page-header h1 {
            font-size: 26px;
          }

          .refresh-btn {
            width: 100%;
          }

          .stats-grid {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 480px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }

          .filters-card {
            padding: 13px;
          }
        }
      `}</style>
    </div>
  );
}

export default AdminApplications;