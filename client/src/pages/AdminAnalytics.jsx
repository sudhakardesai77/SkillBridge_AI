import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";
import API from "../api/axios";

function AdminAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const loadAnalytics = async () => {
    try {
      setError("");

      const res = await API.get(
        "/admin/analytics",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setData(res.data);
    } catch (err) {
      console.error(
        "Admin Analytics Error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to load analytics."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  const maxCompanyApplications = useMemo(() => {
    if (!data?.topCompanies?.length) return 1;

    return Math.max(
      ...data.topCompanies.map(
        (item) => item.applications
      )
    );
  }, [data]);

  const maxRecruiterJobs = useMemo(() => {
    if (!data?.topRecruiters?.length) return 1;

    return Math.max(
      ...data.topRecruiters.map(
        (item) => item.jobs
      )
    );
  }, [data]);

  const maxMonthlyApplications = useMemo(() => {
    if (!data?.applicationsOverTime?.length)
      return 1;

    return Math.max(
      ...data.applicationsOverTime.map(
        (item) => item.applications
      )
    );
  }, [data]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadAnalytics();
  };

  if (loading) {
    return (
      <div className="analytics-page">
        <Navbar />

        <div className="analytics-layout">
          <Sidebar />

          <main className="analytics-main">
            <div className="loading-screen">
              <div className="loader"></div>
              <p>Loading analytics...</p>
            </div>
          </main>
        </div>

        <style>{styles}</style>
      </div>
    );
  }

  return (
    <div className="analytics-page">
      <Navbar />

      <div className="analytics-layout">
        <Sidebar />

        <main className="analytics-main">
          {/* Header */}
          <div className="page-header">
            <div>
              <p className="eyebrow">
                ADMIN PANEL
              </p>

              <h1>Analytics</h1>

              <p className="subtitle">
                Understand platform growth, jobs,
                applications and recruitment activity.
              </p>
            </div>

            <button
              className="refresh-btn"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              {refreshing
                ? "Refreshing..."
                : "↻ Refresh"}
            </button>
          </div>

          {error && (
            <div className="error-box">
              {error}
            </div>
          )}

          {data && (
            <>
              {/* Overview */}
              <section className="section">
                <div className="section-heading">
                  <div>
                    <h2>Platform Overview</h2>
                    <p>
                      Current platform activity at a
                      glance.
                    </p>
                  </div>
                </div>

                <div className="overview-grid">
                  <div className="metric-card">
                    <div className="metric-icon">
                      👨‍🎓
                    </div>

                    <div>
                      <span>Students</span>
                      <strong>
                        {data.overview
                          .totalStudents}
                      </strong>
                    </div>
                  </div>

                  <div className="metric-card">
                    <div className="metric-icon">
                      🏢
                    </div>

                    <div>
                      <span>Recruiters</span>
                      <strong>
                        {data.overview
                          .totalRecruiters}
                      </strong>
                    </div>
                  </div>

                  <div className="metric-card">
                    <div className="metric-icon">
                      💼
                    </div>

                    <div>
                      <span>Total Jobs</span>
                      <strong>
                        {data.overview.totalJobs}
                      </strong>
                    </div>
                  </div>

                  <div className="metric-card">
                    <div className="metric-icon">
                      📋
                    </div>

                    <div>
                      <span>Applications</span>
                      <strong>
                        {
                          data.overview
                            .totalApplications
                        }
                      </strong>
                    </div>
                  </div>

                  <div className="metric-card">
                    <div className="metric-icon">
                      🏆
                    </div>

                    <div>
                      <span>Selection Rate</span>
                      <strong>
                        {
                          data.overview
                            .selectionRate
                        }
                        %
                      </strong>
                    </div>
                  </div>
                </div>
              </section>

              {/* Charts */}
              <div className="two-column">
                {/* Application Status */}
                <section className="analytics-card">
                  <div className="card-heading">
                    <div>
                      <h2>
                        Application Status
                      </h2>

                      <p>
                        Current recruitment
                        pipeline.
                      </p>
                    </div>
                  </div>

                  <div className="status-list">
                    {data.applicationStatus.map(
                      (item) => {
                        const total =
                          data.overview
                            .totalApplications;

                        const percentage =
                          total > 0
                            ? Math.round(
                                (item.value /
                                  total) *
                                  100
                              )
                            : 0;

                        return (
                          <div
                            className="status-row"
                            key={item.name}
                          >
                            <div className="status-info">
                              <span>
                                {item.name}
                              </span>

                              <strong>
                                {item.value}
                              </strong>
                            </div>

                            <div className="progress-track">
                              <div
                                className={`progress-bar ${item.name
                                  .toLowerCase()
                                  .replace(
                                    " ",
                                    "-"
                                  )}`}
                                style={{
                                  width: `${percentage}%`,
                                }}
                              ></div>
                            </div>

                            <small>
                              {percentage}%
                            </small>
                          </div>
                        );
                      }
                    )}
                  </div>
                </section>

                {/* Job Types */}
                <section className="analytics-card">
                  <div className="card-heading">
                    <div>
                      <h2>Jobs by Type</h2>

                      <p>
                        Distribution of available
                        jobs.
                      </p>
                    </div>
                  </div>

                  <div className="job-type-list">
                    {data.jobTypes.map(
                      (item) => {
                        const total =
                          data.overview.totalJobs;

                        const percentage =
                          total > 0
                            ? Math.round(
                                (item.value /
                                  total) *
                                  100
                              )
                            : 0;

                        return (
                          <div
                            className="job-type-row"
                            key={item.name}
                          >
                            <div className="job-type-top">
                              <span>
                                {item.name}
                              </span>

                              <strong>
                                {item.value}
                              </strong>
                            </div>

                            <div className="progress-track">
                              <div
                                className="progress-bar job-progress"
                                style={{
                                  width: `${percentage}%`,
                                }}
                              ></div>
                            </div>

                            <small>
                              {percentage}% of jobs
                            </small>
                          </div>
                        );
                      }
                    )}
                  </div>
                </section>
              </div>

              {/* Users */}
              <div className="two-column">
                <section className="analytics-card">
                  <div className="card-heading">
                    <div>
                      <h2>Users by Role</h2>

                      <p>
                        Platform user distribution.
                      </p>
                    </div>
                  </div>

                  <div className="role-list">
                    {data.usersByRole.map(
                      (item) => {
                        const total =
                          data.usersByRole.reduce(
                            (sum, role) =>
                              sum + role.value,
                            0
                          );

                        const percentage =
                          total > 0
                            ? Math.round(
                                (item.value /
                                  total) *
                                  100
                              )
                            : 0;

                        return (
                          <div
                            className="role-row"
                            key={item.name}
                          >
                            <div className="role-label">
                              <span className="role-dot"></span>
                              <span>
                                {item.name}
                              </span>
                            </div>

                            <strong>
                              {item.value}
                            </strong>

                            <span className="role-percent">
                              {percentage}%
                            </span>
                          </div>
                        );
                      }
                    )}
                  </div>
                </section>

                {/* Selection */}
                <section className="analytics-card highlight-card">
                  <div className="highlight-content">
                    <div className="trophy">
                      🏆
                    </div>

                    <p>
                      Overall Selection Rate
                    </p>

                    <h2>
                      {
                        data.overview
                          .selectionRate
                      }
                      %
                    </h2>

                    <span>
                      Percentage of applications
                      that reached Selected status.
                    </span>
                  </div>
                </section>
              </div>

              {/* Applications Over Time */}
              <section className="analytics-card">
                <div className="card-heading">
                  <div>
                    <h2>
                      Applications Over Time
                    </h2>

                    <p>
                      Monthly application activity.
                    </p>
                  </div>
                </div>

                {data.applicationsOverTime
                  .length === 0 ? (
                  <div className="no-data">
                    No application history
                    available yet.
                  </div>
                ) : (
                  <div className="bar-chart">
                    {data.applicationsOverTime.map(
                      (item, index) => {
                        const height =
                          Math.max(
                            (item.applications /
                              maxMonthlyApplications) *
                              170,
                            item.applications > 0
                              ? 8
                              : 2
                          );

                        return (
                          <div
                            className="bar-item"
                            key={`${item.year}-${item.month}-${index}`}
                          >
                            <div className="bar-value">
                              {item.applications}
                            </div>

                            <div
                              className="chart-bar"
                              style={{
                                height: `${height}px`,
                              }}
                            ></div>

                            <span>
                              {item.month}
                            </span>
                          </div>
                        );
                      }
                    )}
                  </div>
                )}
              </section>

              {/* Top Companies + Recruiters */}
              <div className="two-column">
                <section className="analytics-card">
                  <div className="card-heading">
                    <div>
                      <h2>
                        Top Companies
                      </h2>

                      <p>
                        Companies receiving the most
                        applications.
                      </p>
                    </div>
                  </div>

                  {data.topCompanies.length ===
                  0 ? (
                    <div className="no-data">
                      No company application data
                      available.
                    </div>
                  ) : (
                    <div className="ranking-list">
                      {data.topCompanies.map(
                        (item, index) => {
                          const width =
                            (item.applications /
                              maxCompanyApplications) *
                            100;

                          return (
                            <div
                              className="ranking-item"
                              key={`${item.company}-${index}`}
                            >
                              <div className="rank-number">
                                {index + 1}
                              </div>

                              <div className="rank-main">
                                <div className="rank-top">
                                  <strong>
                                    {item.company}
                                  </strong>

                                  <span>
                                    {
                                      item.applications
                                    }{" "}
                                    applications
                                  </span>
                                </div>

                                <div className="progress-track">
                                  <div
                                    className="progress-bar company-progress"
                                    style={{
                                      width: `${width}%`,
                                    }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          );
                        }
                      )}
                    </div>
                  )}
                </section>

                <section className="analytics-card">
                  <div className="card-heading">
                    <div>
                      <h2>
                        Top Recruiters
                      </h2>

                      <p>
                        Recruiters posting the most
                        jobs.
                      </p>
                    </div>
                  </div>

                  {data.topRecruiters.length ===
                  0 ? (
                    <div className="no-data">
                      No recruiter job data
                      available.
                    </div>
                  ) : (
                    <div className="ranking-list">
                      {data.topRecruiters.map(
                        (item, index) => {
                          const width =
                            (item.jobs /
                              maxRecruiterJobs) *
                            100;

                          return (
                            <div
                              className="ranking-item"
                              key={`${item.email}-${index}`}
                            >
                              <div className="rank-number">
                                {index + 1}
                              </div>

                              <div className="rank-main">
                                <div className="rank-top">
                                  <strong>
                                    {item.name}
                                  </strong>

                                  <span>
                                    {item.jobs}{" "}
                                    jobs
                                  </span>
                                </div>

                                <div className="recruiter-email">
                                  {item.email}
                                </div>

                                <div className="progress-track">
                                  <div
                                    className="progress-bar recruiter-progress"
                                    style={{
                                      width: `${width}%`,
                                    }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          );
                        }
                      )}
                    </div>
                  )}
                </section>
              </div>

              {/* Recent Activity */}
              <div className="two-column">
                <section className="analytics-card">
                  <div className="card-heading">
                    <div>
                      <h2>Recent Jobs</h2>

                      <p>
                        Latest jobs added to the
                        platform.
                      </p>
                    </div>
                  </div>

                  {data.recentJobs.length ===
                  0 ? (
                    <div className="no-data">
                      No jobs available.
                    </div>
                  ) : (
                    <div className="activity-list">
                      {data.recentJobs.map(
                        (job) => (
                          <div
                            className="activity-item"
                            key={job._id}
                          >
                            <div className="activity-icon">
                              💼
                            </div>

                            <div>
                              <strong>
                                {job.jobTitle}
                              </strong>

                              <span>
                                {job.company} •{" "}
                                {job.jobType}
                              </span>

                              <small>
                                Posted by{" "}
                                {job.postedBy
                                  ?.name ||
                                  "Unknown"}
                              </small>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  )}
                </section>

                <section className="analytics-card">
                  <div className="card-heading">
                    <div>
                      <h2>
                        Recent Applications
                      </h2>

                      <p>
                        Latest student applications.
                      </p>
                    </div>
                  </div>

                  {data.recentApplications
                    .length === 0 ? (
                    <div className="no-data">
                      No applications available.
                    </div>
                  ) : (
                    <div className="activity-list">
                      {data.recentApplications.map(
                        (application) => (
                          <div
                            className="activity-item"
                            key={application._id}
                          >
                            <div className="activity-icon">
                              📋
                            </div>

                            <div>
                              <strong>
                                {application
                                  .applicant
                                  ?.name ||
                                  "Unknown Student"}
                              </strong>

                              <span>
                                {application.job
                                  ?.jobTitle ||
                                  "Job unavailable"}
                              </span>

                              <small>
                                {application.job
                                  ?.company ||
                                  "Unknown company"}{" "}
                                •{" "}
                                {
                                  application.status
                                }
                              </small>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  )}
                </section>
              </div>
            </>
          )}
        </main>
      </div>

      <style>{styles}</style>
    </div>
  );
}

const styles = `
  * {
    box-sizing: border-box;
  }

  .analytics-page {
    min-height: 100vh;
    background: #f6f7fb;
  }

  .analytics-layout {
    display: flex;
  }

  .analytics-main {
    flex: 1;
    min-width: 0;
    padding: 32px;
  }

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 20px;
    margin-bottom: 30px;
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

  .section {
    margin-bottom: 22px;
  }

  .section-heading {
    margin-bottom: 14px;
  }

  .section-heading h2,
  .card-heading h2 {
    margin: 0;
    color: #111827;
    font-size: 18px;
  }

  .section-heading p,
  .card-heading p {
    margin: 5px 0 0;
    color: #6b7280;
    font-size: 13px;
  }

  .overview-grid {
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 15px;
  }

  .metric-card {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 14px;
    padding: 18px;
    display: flex;
    align-items: center;
    gap: 13px;
  }

  .metric-icon {
    width: 43px;
    height: 43px;
    border-radius: 11px;
    background: #f3f4ff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 19px;
    flex-shrink: 0;
  }

  .metric-card span {
    display: block;
    color: #6b7280;
    font-size: 12px;
    margin-bottom: 4px;
  }

  .metric-card strong {
    color: #111827;
    font-size: 22px;
  }

  .two-column {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 20px;
    margin-bottom: 20px;
  }

  .analytics-card {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 14px;
    padding: 22px;
  }

  .card-heading {
    margin-bottom: 22px;
  }

  .status-row,
  .job-type-row {
    margin-bottom: 18px;
  }

  .status-info,
  .job-type-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 7px;
  }

  .status-info span,
  .job-type-top span {
    color: #374151;
    font-size: 13px;
    font-weight: 600;
  }

  .status-info strong,
  .job-type-top strong {
    color: #111827;
    font-size: 13px;
  }

  .progress-track {
    height: 8px;
    background: #f0f1f4;
    border-radius: 999px;
    overflow: hidden;
  }

  .progress-bar {
    height: 100%;
    border-radius: 999px;
    background: #6366f1;
  }

  .progress-bar.applied {
    background: #3b82f6;
  }

  .progress-bar.shortlisted {
    background: #f59e0b;
  }

  .progress-bar.selected {
    background: #10b981;
  }

  .progress-bar.rejected {
    background: #ef4444;
  }

  .status-row small,
  .job-type-row small {
    display: block;
    margin-top: 5px;
    color: #9ca3af;
    font-size: 11px;
    text-align: right;
  }

  .job-progress {
    background: #6366f1;
  }

  .role-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .role-row {
    display: grid;
    grid-template-columns: 1fr auto auto;
    gap: 15px;
    align-items: center;
    padding-bottom: 14px;
    border-bottom: 1px solid #f0f1f3;
  }

  .role-row:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  .role-label {
    display: flex;
    align-items: center;
    gap: 9px;
    color: #374151;
    font-size: 13px;
    font-weight: 600;
  }

  .role-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #6366f1;
  }

  .role-row strong {
    color: #111827;
  }

  .role-percent {
    color: #9ca3af;
    font-size: 12px;
    min-width: 38px;
    text-align: right;
  }

  .highlight-card {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 210px;
  }

  .highlight-content {
    text-align: center;
  }

  .trophy {
    font-size: 34px;
    margin-bottom: 7px;
  }

  .highlight-content p {
    margin: 0;
    color: #6b7280;
    font-size: 13px;
  }

  .highlight-content h2 {
    margin: 7px 0;
    font-size: 42px;
    color: #111827;
  }

  .highlight-content span {
    display: block;
    max-width: 310px;
    color: #9ca3af;
    font-size: 12px;
    line-height: 1.5;
  }

  .bar-chart {
    height: 240px;
    display: flex;
    align-items: flex-end;
    justify-content: space-around;
    gap: 12px;
    padding: 20px 5px 0;
    border-bottom: 1px solid #e5e7eb;
  }

  .bar-item {
    height: 205px;
    flex: 1;
    max-width: 70px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
  }

  .bar-value {
    color: #374151;
    font-size: 11px;
    font-weight: 700;
    margin-bottom: 5px;
  }

  .chart-bar {
    width: 70%;
    min-height: 2px;
    background: #6366f1;
    border-radius: 7px 7px 0 0;
  }

  .bar-item > span {
    margin-top: 8px;
    color: #9ca3af;
    font-size: 11px;
  }

  .ranking-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .ranking-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
  }

  .rank-number {
    width: 28px;
    height: 28px;
    border-radius: 8px;
    background: #f3f4ff;
    color: #6366f1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 700;
    flex-shrink: 0;
  }

  .rank-main {
    flex: 1;
    min-width: 0;
  }

  .rank-top {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 7px;
  }

  .rank-top strong {
    color: #111827;
    font-size: 13px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .rank-top span {
    color: #6b7280;
    font-size: 11px;
    white-space: nowrap;
  }

  .company-progress {
    background: #6366f1;
  }

  .recruiter-email {
    color: #9ca3af;
    font-size: 11px;
    margin-bottom: 7px;
  }

  .recruiter-progress {
    background: #8b5cf6;
  }

  .activity-list {
    display: flex;
    flex-direction: column;
  }

  .activity-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 13px 0;
    border-bottom: 1px solid #f0f1f3;
  }

  .activity-item:first-child {
    padding-top: 0;
  }

  .activity-item:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  .activity-icon {
    width: 35px;
    height: 35px;
    border-radius: 9px;
    background: #f3f4ff;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .activity-item strong {
    display: block;
    color: #111827;
    font-size: 13px;
    margin-bottom: 3px;
  }

  .activity-item span,
  .activity-item small {
    display: block;
    color: #6b7280;
    font-size: 11px;
    margin-top: 2px;
  }

  .activity-item small {
    color: #9ca3af;
  }

  .no-data {
    min-height: 130px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #9ca3af;
    font-size: 13px;
    text-align: center;
  }

  .error-box {
    background: #fef2f2;
    border: 1px solid #fecaca;
    color: #b91c1c;
    padding: 13px 15px;
    border-radius: 10px;
    margin-bottom: 20px;
    font-size: 13px;
  }

  .loading-screen {
    min-height: 70vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #6b7280;
  }

  .loader {
    width: 30px;
    height: 30px;
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
    .overview-grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }

  @media (max-width: 900px) {
    .two-column {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 768px) {
    .analytics-main {
      padding: 20px 14px;
    }

    .page-header {
      flex-direction: column;
    }

    .refresh-btn {
      width: 100%;
    }

    .overview-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 480px) {
    .overview-grid {
      grid-template-columns: 1fr;
    }

    .analytics-card {
      padding: 17px;
    }

    .rank-top {
      flex-direction: column;
      gap: 3px;
    }
  }
`;

export default AdminAnalytics;