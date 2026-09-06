import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";

import DashboardChart from "../components/dashboard/DashboardChart";
import ProfileCard from "../components/dashboard/ProfileCard";
import QuickActions from "../components/dashboard/QuickActions";
import StatCard from "../components/dashboard/StatCard";

import RecentActivity from "../components/common/RecentActivity";

import { getDashboardData } from "../api/dashboardApi";


function Dashboard() {

  const [dashboard, setDashboard] =
    useState(null);

  const [error, setError] =
    useState("");


  // =====================================================
  // LOAD DASHBOARD
  // =====================================================

  useEffect(() => {

    const loadDashboard = async () => {

      try {

        setError("");

        const data =
          await getDashboardData();

        console.log(
          "Dashboard Data:",
          data
        );

        setDashboard(data);

      } catch (err) {

        console.error(
          "Dashboard Error:",
          err
        );

        setError(
          "Failed to load dashboard."
        );

      }

    };


    loadDashboard();

  }, []);


  // =====================================================
  // LOADING
  // =====================================================

  if (!dashboard && !error) {

    return (

      <div className="flex justify-center items-center min-h-screen bg-slate-100">

        <h1 className="text-3xl font-bold text-blue-600">
          Loading Dashboard...
        </h1>

      </div>

    );

  }


  // =====================================================
  // ERROR
  // =====================================================

  if (error) {

    return (

      <div className="flex min-h-screen bg-slate-100">

        <Sidebar />

        <div className="flex-1">

          <Navbar />

          <div className="flex justify-center items-center min-h-[80vh]">

            <div className="bg-white rounded-2xl shadow p-8 text-center">

              <h1 className="text-3xl font-bold text-red-600">
                Dashboard Error
              </h1>

              <p className="text-gray-600 mt-3">
                {error}
              </p>

              <button
                onClick={() => window.location.reload()}
                className="mt-5 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold"
              >
                Try Again
              </button>

            </div>

          </div>

        </div>

      </div>

    );

  }


  // =====================================================
  // DASHBOARD DATA
  // =====================================================

  const {
    user,
    resumeData,
    atsScore,
    eligibleCompanies,
    profileCompletion,
    placementReadiness,
    readinessComponents,
    readinessStatus,
    focusArea,
    focusAreaScore,
    actionPlan,
    interviewStats,
    codingStats,
    roadmapProgress: apiRoadmapProgress,
  } = dashboard;


  // =====================================================
  // RESUME SKILLS
  // =====================================================

  const resumeSkills =
    resumeData?.skills ||
    user?.skills ||
    [];


  // =====================================================
  // MISSING SKILLS
  // =====================================================

  let missingSkills = [];

  try {

    missingSkills =
      JSON.parse(
        localStorage.getItem(
          "missingSkills"
        ) || "[]"
      );

  } catch {

    missingSkills = [];

  }


  // =====================================================
  // ROADMAP
  // =====================================================

  const roadmapCompany =
    localStorage.getItem(
      "roadmapCompany"
    ) || "Amazon";


  let roadmapData = null;

  try {

    roadmapData =
      JSON.parse(
        localStorage.getItem(
          "roadmapData"
        ) || "null"
      );

  } catch {

    roadmapData = null;

  }


  const totalWeeks =
    Number(
      roadmapData?.estimatedWeeks ||
      0
    );


  let completedWeeks = [];

  try {

    completedWeeks =
      JSON.parse(
        localStorage.getItem(
          `roadmap-${roadmapCompany}`
        ) || "[]"
      );

  } catch {

    completedWeeks = [];

  }


  const calculatedRoadmapProgress =
    totalWeeks > 0
      ? Math.min(
          100,
          Math.round(
            (
              completedWeeks.length /
              totalWeeks
            ) *
            100
          )
        )
      : 0;


  const roadmapProgress =
    apiRoadmapProgress ??
    calculatedRoadmapProgress;


  // =====================================================
  // CAREER PROGRESS
  // =====================================================

  const careerProgress =
    Math.min(
      100,
      Math.max(
        0,
        Math.round(
          (
            Number(atsScore || 0) +
            Number(profileCompletion || 0) +
            Number(placementReadiness || 0) +
            Number(roadmapProgress || 0)
          ) / 4
        )
      )
    );


  // =====================================================
  // READINESS COMPONENTS
  // =====================================================

  const readiness = {

    resume:
      readinessComponents?.resume ??
      atsScore ??
      0,

    profile:
      readinessComponents?.profile ??
      profileCompletion ??
      0,

    coding:
      readinessComponents?.coding ??
      codingStats?.progress ??
      0,

    interviews:
      readinessComponents?.interviews ??
      Math.round(
        Number(
          interviewStats?.averageScore ||
          0
        ) * 10
      ),

    roadmap:
      readinessComponents?.roadmap ??
      roadmapProgress ??
      0,

  };


  // =====================================================
  // ACTION PLAN FALLBACK
  // =====================================================
  //
  // Normally this comes from dashboardApi.js.
  // This fallback prevents the UI from breaking if
  // an older API response is temporarily cached.
  // =====================================================

  const finalActionPlan =
    actionPlan || {

      area:
        focusArea ||
        "Preparation",

      icon:
        "🚀",

      title:
        "Keep Improving",

      description:
        "Continue improving your resume, coding, interviews and technical skills to increase your placement readiness.",

      currentScore:
        Number(
          focusAreaScore || 0
        ),

      targetScore:
        80,

      improvementNeeded:
        Math.max(
          0,
          80 -
          Number(
            focusAreaScore || 0
          )
        ),

      action:
        "Continue Preparation →",

      link:
        "/coding-tracker",

    };


  // =====================================================
  // ACTION PLAN VALUES
  // =====================================================

  const actionCurrentScore =
    Math.round(
      Number(
        finalActionPlan.currentScore ??
        focusAreaScore ??
        0
      )
    );


  const actionTargetScore =
    Math.round(
      Number(
        finalActionPlan.targetScore ??
        80
      )
    );


  const actionImprovementNeeded =
    Math.max(
      0,
      Math.round(
        Number(
          finalActionPlan.improvementNeeded ??
          (
            actionTargetScore -
            actionCurrentScore
          )
        )
      )
    );


  // =====================================================
  // RESUME PROFILE
  // =====================================================

  const resumeProfile = resumeData

    ? {

        name:
          resumeData.name ||
          "Name Not Detected",

        email:
          resumeData.email ||
          "Email Not Detected",

        college:
          resumeData.college ||
          "College Not Detected",

        branch:
          resumeData.branch ||
          "Branch Not Detected",

        cgpa:
          resumeData.cgpa ||
          "",

        skills:
          Array.isArray(
            resumeData.skills
          )
            ? resumeData.skills
            : [],

        linkedin:
          resumeData.linkedin ||
          "",

        github:
          resumeData.github ||
          "",

        leetcode:
          resumeData.leetcode ||
          "",

        resume:
          user?.resume,

      }

    : {

        name:
          "No Resume Uploaded",

        email: "",

        college: "",

        branch: "",

        cgpa: "",

        skills: [],

        linkedin: "",

        github: "",

        leetcode: "",

        resume:
          user?.resume,

      };


  // =====================================================
  // READINESS BAR COMPONENT
  // =====================================================

  const ReadinessBar = ({
    label,
    value,
  }) => {

    const safeValue =
      Math.min(
        100,
        Math.max(
          0,
          Number(value || 0)
        )
      );


    return (

      <div className="mb-5">

        <div className="flex justify-between items-center mb-2">

          <span className="font-semibold text-gray-700">
            {label}
          </span>

          <span className="font-bold text-blue-600">
            {safeValue}%
          </span>

        </div>


        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">

          <div
            className="h-3 bg-blue-600 rounded-full transition-all duration-700"
            style={{
              width:
                `${safeValue}%`,
            }}
          />

        </div>

      </div>

    );

  };


  // =====================================================
  // RENDER
  // =====================================================

  return (

    <div className="flex min-h-screen bg-slate-100">

      <Sidebar />


      <div className="flex-1">

        <Navbar />


        <div className="p-8 max-w-7xl mx-auto">


          {/* =================================================
              HEADER
          ================================================= */}

          <h1 className="text-4xl font-bold">
            Welcome Back 👋
          </h1>


          <p className="text-gray-500 mt-2">
            Here's your latest placement preparation summary.
          </p>


          {/* =================================================
              PLACEMENT READINESS
          ================================================= */}

          <div className="bg-white rounded-3xl shadow-md p-8 mt-8">

            <div className="flex flex-col lg:flex-row gap-8">


              {/* =================================================
                  SCORE
              ================================================= */}

              <div className="lg:w-1/3 flex flex-col items-center justify-center text-center">

                <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                  🎯 Placement Readiness
                </div>


                <div className="mt-4">

                  <span className="text-7xl font-bold text-blue-600">
                    {placementReadiness}%
                  </span>

                </div>


                <div className="mt-3">

                  <span
                    className={`px-5 py-2 rounded-full font-bold ${
                      placementReadiness >= 80
                        ? "bg-green-100 text-green-700"
                        : placementReadiness >= 60
                        ? "bg-blue-100 text-blue-700"
                        : placementReadiness >= 40
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {readinessStatus ||
                      "Getting Ready"}
                  </span>

                </div>


                {/* QUICK STATUS */}

                <p className="text-gray-500 text-sm mt-5 max-w-xs">

                  {placementReadiness >= 80

                    ? "Excellent! You are showing strong placement preparation."

                    : placementReadiness >= 60

                    ? "You are close. A little more focused preparation can make a big difference."

                    : placementReadiness >= 40

                    ? "You are building your preparation. Keep improving consistently."

                    : "Start with the recommended action below and build your preparation step by step."

                  }

                </p>

              </div>


              {/* =================================================
                  BREAKDOWN
              ================================================= */}

              <div className="flex-1">

                <h2 className="text-2xl font-bold mb-6">
                  Preparation Breakdown
                </h2>


                <ReadinessBar
                  label="Resume / ATS"
                  value={
                    readiness.resume
                  }
                />


                <ReadinessBar
                  label="Profile"
                  value={
                    readiness.profile
                  }
                />


                <ReadinessBar
                  label="Coding"
                  value={
                    readiness.coding
                  }
                />


                <ReadinessBar
                  label="Interviews"
                  value={
                    readiness.interviews
                  }
                />


                <ReadinessBar
                  label="Learning Roadmap"
                  value={
                    readiness.roadmap
                  }
                />

              </div>

            </div>


            {/* =================================================
                RECOMMENDED FOCUS
            ================================================= */}

            <div className="mt-6 bg-blue-50 border border-blue-100 rounded-2xl p-5">

              <div className="flex items-start gap-4">

                <div className="text-3xl">
                  💡
                </div>


                <div className="flex-1">

                  <h3 className="font-bold text-lg text-gray-800">
                    Recommended Focus
                  </h3>


                  <p className="text-gray-600 mt-1">

                    Your current weakest area is{" "}

                    <span className="font-bold text-blue-600">
                      {focusArea ||
                        finalActionPlan.area ||
                        "your preparation"}
                    </span>

                    {" "}at{" "}

                    <span className="font-bold">
                      {Math.round(
                        focusAreaScore ??
                        finalActionPlan.currentScore ??
                        0
                      )}%
                    </span>

                    . Focus on improving this area
                    to increase your placement readiness.

                  </p>


                  <Link
                    to={
                      finalActionPlan.link
                    }
                    className="inline-block mt-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition"
                  >
                    {finalActionPlan.action ||
                      "Start Improving →"}
                  </Link>

                </div>

              </div>

            </div>


            {/* =================================================
                PERSONALIZED ACTION PLAN
            ================================================= */}

            <div className="mt-6 border border-gray-200 rounded-2xl p-6 bg-gray-50">

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">


                {/* ACTION INFORMATION */}

                <div className="flex items-start gap-4">

                  <div className="text-4xl flex-shrink-0">
                    {finalActionPlan.icon}
                  </div>


                  <div>

                    <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
                      Personalized Action Plan
                    </p>


                    <h3 className="text-2xl font-bold text-gray-800 mt-1">
                      {finalActionPlan.title}
                    </h3>


                    <p className="text-gray-600 mt-2 max-w-3xl">
                      {finalActionPlan.description}
                    </p>


                    {/* SCORE INFORMATION */}

                    <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm mt-4">

                      <span className="text-gray-600">

                        Current score:{" "}

                        <span className="font-bold text-gray-800">
                          {actionCurrentScore}%
                        </span>

                      </span>


                      <span className="text-gray-600">

                        Target:{" "}

                        <span className="font-bold text-blue-600">
                          {actionTargetScore}%
                        </span>

                      </span>


                      {actionImprovementNeeded > 0 && (

                        <span className="text-gray-600">

                          Improvement needed:{" "}

                          <span className="font-bold text-red-600">
                            {actionImprovementNeeded}%
                          </span>

                        </span>

                      )}

                    </div>


                    {actionImprovementNeeded <= 0 && (

                      <p className="text-sm text-green-600 font-semibold mt-3">
                        ✅ You have reached the recommended target for this area.
                      </p>

                    )}

                  </div>

                </div>


                {/* ACTION BUTTON */}

                <div className="flex-shrink-0">

                  <Link
                    to={
                      finalActionPlan.link
                    }
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition shadow-sm"
                  >
                    {finalActionPlan.action ||
                      "Continue →"}
                  </Link>

                </div>

              </div>

            </div>

          </div>


          {/* =================================================
              STATISTICS
          ================================================= */}

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-8">

            <StatCard
              title="ATS Score"
              value={`${atsScore}%`}
              color="#2563EB"
            />


            <StatCard
              title="Eligible Companies"
              value={
                eligibleCompanies
              }
              color="#9333EA"
            />


            <StatCard
              title="Resume Skills"
              value={
                resumeSkills.length
              }
              color="#16A34A"
            />


            <StatCard
              title="Missing Skills"
              value={
                missingSkills.length
              }
              color="#DC2626"
            />


            <StatCard
              title="Resume"
              value={
                user?.resume?.url
                  ? "Uploaded"
                  : "Pending"
              }
              color="#F97316"
            />


            <StatCard
              title="Roadmap Progress"
              value={`${roadmapProgress}%`}
              color="#0EA5E9"
            />


            <StatCard
              title="Placement Readiness"
              value={`${placementReadiness}%`}
              color="#10B981"
            />


            <StatCard
              title="Career Progress"
              value={`${careerProgress}%`}
              color="#0891B2"
            />

          </div>


          {/* =================================================
              INTERVIEW STATS
          ================================================= */}

          {interviewStats && (

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">

              <StatCard
                title="Mock Interviews"
                value={
                  interviewStats.totalInterviews ||
                  0
                }
                color="#7C3AED"
              />


              <StatCard
                title="Average Interview Score"
                value={`${interviewStats.averageScore || 0}/10`}
                color="#EA580C"
              />

            </div>

          )}


          {/* =================================================
              CODING STATS
          ================================================= */}

          {codingStats && (

            <div className="mt-8">

              <div className="flex justify-between items-center mb-4">

                <div>

                  <h2 className="text-2xl font-bold">
                    Coding Progress
                  </h2>

                  <p className="text-gray-500 mt-1">
                    Track your DSA and coding practice.
                  </p>

                </div>


                <Link
                  to="/coding-tracker"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold transition"
                >
                  💻 Open Coding Tracker
                </Link>

              </div>


              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                <StatCard
                  title="Problems Solved"
                  value={
                    codingStats.solved ||
                    0
                  }
                  color="#16A34A"
                />


                <StatCard
                  title="Total Problems"
                  value={
                    codingStats.total ||
                    0
                  }
                  color="#2563EB"
                />


                <StatCard
                  title="Coding Progress"
                  value={`${codingStats.progress || 0}%`}
                  color="#7C3AED"
                />

              </div>


              <div className="bg-white rounded-2xl shadow-md p-6 mt-6">

                <div className="flex justify-between items-center">

                  <h3 className="text-xl font-bold">
                    Coding Progress
                  </h3>


                  <span className="font-bold text-blue-600">
                    {codingStats.progress || 0}%
                  </span>

                </div>


                <div className="w-full h-4 bg-gray-200 rounded-full mt-5 overflow-hidden">

                  <div
                    className="h-4 bg-blue-600 rounded-full transition-all duration-700"
                    style={{
                      width: `${Math.min(
                        100,
                        Math.max(
                          0,
                          codingStats.progress || 0
                        )
                      )}%`,
                    }}
                  />

                </div>


                <div className="flex justify-between text-sm text-gray-500 mt-4">

                  <span>
                    Easy:{" "}
                    {codingStats.easy || 0}
                  </span>


                  <span>
                    Medium:{" "}
                    {codingStats.medium || 0}
                  </span>


                  <span>
                    Hard:{" "}
                    {codingStats.hard || 0}
                  </span>

                </div>

              </div>

            </div>

          )}


          {/* =================================================
              RESUME PROFILE
          ================================================= */}

          <div className="mt-8">

            <div className="bg-white rounded-2xl shadow-md p-6 mb-6">

              <h2 className="text-2xl font-bold">
                Resume Profile
              </h2>

              <p className="text-gray-500 mt-1">
                Information extracted from your uploaded resume.
              </p>

            </div>


            <ProfileCard
              user={resumeProfile}
            />

          </div>


          {/* =================================================
              ACCOUNT INFORMATION
          ================================================= */}

          <div className="bg-white rounded-2xl shadow-md p-6 mt-8">

            <h2 className="text-2xl font-bold">
              SkillBridge Account
            </h2>

            <p className="text-gray-500 mt-1">
              Your actual login account information.
            </p>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

              <div>

                <p className="text-sm text-gray-500">
                  Account Name
                </p>

                <p className="font-semibold text-lg">
                  {user?.name ||
                    "Not available"}
                </p>

              </div>


              <div>

                <p className="text-sm text-gray-500">
                  Account Email
                </p>

                <p className="font-semibold text-lg">
                  {user?.email ||
                    "Not available"}
                </p>

              </div>

            </div>

          </div>


          {/* =================================================
              PROFILE COMPLETION
          ================================================= */}

          <div className="bg-white rounded-2xl shadow-md p-8 mt-8">

            <div className="flex justify-between items-center">

              <h2 className="text-2xl font-bold">
                Profile Completion
              </h2>


              <span className="text-xl font-bold text-blue-600">
                {profileCompletion}%
              </span>

            </div>


            <div className="w-full h-4 bg-gray-200 rounded-full mt-6 overflow-hidden">

              <div
                className="h-4 bg-blue-600 rounded-full transition-all duration-700"
                style={{
                  width: `${Math.min(
                    100,
                    Math.max(
                      0,
                      profileCompletion
                    )
                  )}%`,
                }}
              />

            </div>

          </div>


          {/* =================================================
              ROADMAP PROGRESS
          ================================================= */}

          <div className="bg-white rounded-2xl shadow-md p-8 mt-8">

            <div className="flex justify-between items-center">

              <div>

                <h2 className="text-2xl font-bold">
                  Learning Roadmap
                </h2>


                <p className="text-gray-500 mt-1">

                  {roadmapData
                    ? `${roadmapCompany} Roadmap`
                    : "No roadmap generated yet"}

                </p>

              </div>


              <span className="text-2xl font-bold text-blue-600">
                {roadmapProgress}%
              </span>

            </div>


            <div className="w-full h-5 bg-gray-200 rounded-full mt-6 overflow-hidden">

              <div
                className="h-5 bg-blue-500 rounded-full transition-all duration-700"
                style={{
                  width: `${Math.min(
                    100,
                    Math.max(
                      0,
                      roadmapProgress
                    )
                  )}%`,
                }}
              />

            </div>


            {roadmapData && (

              <p className="text-gray-500 mt-3">

                {completedWeeks.length} of{" "}
                {totalWeeks} weeks completed

              </p>

            )}

          </div>


          {/* =================================================
              MISSING SKILLS
          ================================================= */}

          {missingSkills.length > 0 && (

            <div className="bg-white rounded-2xl shadow-md p-8 mt-8">

              <h2 className="text-2xl font-bold">
                Skills You Need to Learn
              </h2>


              <div className="flex flex-wrap gap-3 mt-5">

                {missingSkills.map(
                  (skill) => (

                    <span
                      key={skill}
                      className="bg-red-100 text-red-700 px-4 py-2 rounded-full font-semibold"
                    >
                      {skill}
                    </span>

                  )
                )}

              </div>

            </div>

          )}


          {/* =================================================
              CAREER PROGRESS
          ================================================= */}

          <div className="bg-white rounded-2xl shadow-md p-8 mt-8">

            <div className="flex justify-between items-center">

              <h2 className="text-2xl font-bold">
                Career Progress
              </h2>


              <span className="text-2xl font-bold text-green-600">
                {careerProgress}%
              </span>

            </div>


            <div className="w-full h-5 bg-gray-200 rounded-full mt-6 overflow-hidden">

              <div
                className="h-5 bg-green-500 rounded-full transition-all duration-700"
                style={{
                  width: `${careerProgress}%`,
                }}
              />

            </div>

          </div>


          {/* =================================================
              QUICK ACTIONS
          ================================================= */}

          <div className="mt-8">

            <QuickActions />

          </div>


          {/* =================================================
              CHART + ACTIVITY
          ================================================= */}

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">

            <DashboardChart
              atsScore={atsScore}
              profileCompletion={
                profileCompletion
              }
              placementReadiness={
                placementReadiness
              }
            />


            <RecentActivity />

          </div>

        </div>

      </div>

    </div>

  );

}


export default Dashboard;