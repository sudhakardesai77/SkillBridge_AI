import { getProfile } from "./profileApi";
import { analyzeResume } from "./atsApi";
import { getEligibility } from "./eligibilityApi";
import API from "./axios";

// =====================================================
// SAFE NUMBER
// =====================================================

const safeNumber = (value, fallback = 0) => {

  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : fallback;

};


// =====================================================
// LIMIT PERCENTAGE
// =====================================================

const percentage = (value) => {

  return Math.min(
    100,
    Math.max(
      0,
      Math.round(
        safeNumber(value)
      )
    )
  );

};


// =====================================================
// DASHBOARD DATA
// =====================================================

export const getDashboardData = async () => {

  const token =
    localStorage.getItem("token");


  // =====================================================
  // LOAD PROFILE FIRST
  // =====================================================

  const profile =
    await getProfile();


  const user =
    profile?.data?.user || {};


  // =====================================================
  // RESUME DATA
  // =====================================================

  const resumeData =
    user?.resumeData || null;


  const hasResume =
    Boolean(
      user?.resume?.url
    );


  // =====================================================
  // DEFAULT VALUES
  // =====================================================

  let atsScore = 0;

  let eligibleCompanies = 0;

  let interviewStats = {

    totalInterviews: 0,

    averageScore: 0,

  };


  let codingStats = {

    total: 0,

    solved: 0,

    unsolved: 0,

    easy: 0,

    medium: 0,

    hard: 0,

    progress: 0,

  };


  // =====================================================
  // ATS
  // =====================================================

  if (hasResume) {

    try {

      const ats =
        await analyzeResume();


      atsScore =
        percentage(
          ats?.ats_score || 0
        );

    } catch (error) {

      console.error(
        "Dashboard ATS Error:",
        error
      );

      atsScore = 0;

    }

  }


  // =====================================================
  // ELIGIBILITY
  // =====================================================

  if (hasResume) {

    try {

      const eligibility =
        await getEligibility();


      eligibleCompanies =
        (
          eligibility?.companies ||
          []
        ).filter(
          (company) =>
            company?.eligible
        ).length;

    } catch (error) {

      console.error(
        "Dashboard Eligibility Error:",
        error
      );

      eligibleCompanies = 0;

    }

  }


  // =====================================================
  // INTERVIEW STATS
  // =====================================================

  try {

    const response =
      await API.get(
        "/interview/stats",
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );


    interviewStats =
      response?.data?.data || {

        totalInterviews: 0,

        averageScore: 0,

      };

  } catch (error) {

    console.error(
      "Dashboard Interview Stats Error:",
      error
    );

  }


  // =====================================================
  // CODING STATS
  // =====================================================

  try {

    const response =
      await API.get(
        "/coding/stats",
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );


    codingStats =
      response?.data?.data || {

        total: 0,

        solved: 0,

        unsolved: 0,

        easy: 0,

        medium: 0,

        hard: 0,

        progress: 0,

      };

  } catch (error) {

    console.error(
      "Dashboard Coding Stats Error:",
      error
    );

  }


  // =====================================================
  // PROFILE COMPLETION
  // =====================================================

  let profileCompletion = 0;


  if (user.name) {

    profileCompletion += 10;

  }


  if (user.college) {

    profileCompletion += 10;

  }


  if (user.branch) {

    profileCompletion += 10;

  }


  if (
    user.cgpa &&
    Number(user.cgpa) > 0
  ) {

    profileCompletion += 10;

  }


  if (
    Array.isArray(user.skills) &&
    user.skills.length > 0
  ) {

    profileCompletion += 20;

  }


  if (user.github) {

    profileCompletion += 10;

  }


  if (user.linkedin) {

    profileCompletion += 10;

  }


  if (user.leetcode) {

    profileCompletion += 10;

  }


  if (user.resume?.url) {

    profileCompletion += 10;

  }


  profileCompletion =
    percentage(
      profileCompletion
    );


  // =====================================================
  // INTERVIEW SCORE
  // =====================================================

  const averageInterviewScore =
    safeNumber(
      interviewStats?.averageScore,
      0
    );


  const interviewPercentage =
    percentage(
      averageInterviewScore * 10
    );


  // =====================================================
  // CODING PROGRESS
  // =====================================================

  const codingProgress =
    percentage(
      codingStats?.progress || 0
    );


  // =====================================================
  // ROADMAP PROGRESS
  // =====================================================

  let roadmapProgress = 0;

  let roadmapCompany =
    localStorage.getItem(
      "roadmapCompany"
    ) || "Amazon";


  let roadmapData = null;

  let completedWeeks = [];


  try {

    roadmapData =
      JSON.parse(
        localStorage.getItem(
          "roadmapData"
        ) || "null"
      );


    completedWeeks =
      JSON.parse(
        localStorage.getItem(
          `roadmap-${roadmapCompany}`
        ) || "[]"
      );


    const totalWeeks =
      safeNumber(
        roadmapData?.estimatedWeeks,
        0
      );


    if (
      totalWeeks > 0 &&
      Array.isArray(completedWeeks)
    ) {

      roadmapProgress =
        percentage(
          (
            completedWeeks.length /
            totalWeeks
          ) * 100
        );

    }

  } catch (error) {

    console.error(
      "Dashboard Roadmap Error:",
      error
    );

    roadmapProgress = 0;

    completedWeeks = [];

  }


  // =====================================================
  // PLACEMENT READINESS
  // =====================================================
  //
  // Resume / ATS       = 25%
  // Profile            = 15%
  // Coding             = 25%
  // Interviews         = 20%
  // Roadmap            = 15%
  //
  // Total              = 100%
  // =====================================================

  const placementReadiness =
    percentage(

      (atsScore * 0.25) +

      (profileCompletion * 0.15) +

      (codingProgress * 0.25) +

      (interviewPercentage * 0.20) +

      (roadmapProgress * 0.15)

    );


  // =====================================================
  // READINESS COMPONENTS
  // =====================================================

  const readinessComponents = {

    resume:
      percentage(atsScore),

    profile:
      percentage(profileCompletion),

    coding:
      percentage(codingProgress),

    interviews:
      percentage(interviewPercentage),

    roadmap:
      percentage(roadmapProgress),

  };


  // =====================================================
  // READINESS STATUS
  // =====================================================

  let readinessStatus =
    "Needs Improvement";


  if (
    placementReadiness >= 80
  ) {

    readinessStatus =
      "Placement Ready";

  } else if (
    placementReadiness >= 60
  ) {

    readinessStatus =
      "Almost Ready";

  } else if (
    placementReadiness >= 40
  ) {

    readinessStatus =
      "Getting Ready";

  }


  // =====================================================
  // FIND WEAKEST AREA
  // =====================================================

  const focusAreas = [

    {
      name: "Resume / ATS",
      score: atsScore,
    },

    {
      name: "Profile",
      score: profileCompletion,
    },

    {
      name: "Coding",
      score: codingProgress,
    },

    {
      name: "Interviews",
      score: interviewPercentage,
    },

    {
      name: "Roadmap",
      score: roadmapProgress,
    },

  ];


  const weakestArea =
    focusAreas.reduce(
      (lowest, current) =>
        current.score <
        lowest.score
          ? current
          : lowest
    );


  // =====================================================
  // PERSONALIZED ACTION PLAN
  // =====================================================

  let actionPlan;


  switch (
    weakestArea.name
  ) {

    // ---------------------------------------------------
    // RESUME
    // ---------------------------------------------------

    case "Resume / ATS":

      actionPlan = {

        area: "Resume / ATS",

        icon: "📄",

        title:
          "Improve Your Resume",

        description:
          "Your ATS score is currently your weakest area. Improve your resume structure, keywords, skills and project descriptions to increase your chances of getting shortlisted.",

        currentScore:
          weakestArea.score,

        targetScore: 80,

        improvementNeeded:
          Math.max(
            0,
            80 -
            weakestArea.score
          ),

        action:
          "Improve Resume →",

        link:
          "/resume",

      };

      break;


    // ---------------------------------------------------
    // PROFILE
    // ---------------------------------------------------

    case "Profile":

      actionPlan = {

        area: "Profile",

        icon: "👤",

        title:
          "Complete Your Profile",

        description:
          "Your profile is incomplete. Add your academic details, professional links and coding profiles to improve your placement readiness.",

        currentScore:
          weakestArea.score,

        targetScore: 90,

        improvementNeeded:
          Math.max(
            0,
            90 -
            weakestArea.score
          ),

        action:
          "Complete Profile →",

        link:
          "/profile",

      };

      break;


    // ---------------------------------------------------
    // CODING
    // ---------------------------------------------------

    case "Coding":

      actionPlan = {

        area: "Coding",

        icon: "💻",

        title:
          "Practice More Coding",

        description:
          "Coding is currently your weakest preparation area. Solve more DSA problems and focus on Medium-level problems to improve your coding readiness.",

        currentScore:
          weakestArea.score,

        targetScore: 80,

        improvementNeeded:
          Math.max(
            0,
            80 -
            weakestArea.score
          ),

        action:
          "Practice Coding →",

        link:
          "/coding-tracker",

      };

      break;


    // ---------------------------------------------------
    // INTERVIEWS
    // ---------------------------------------------------

    case "Interviews":

      actionPlan = {

        area: "Interviews",

        icon: "🎤",

        title:
          "Practice Mock Interviews",

        description:
          "Your interview performance needs improvement. Practice more mock interviews and review your answers to improve your technical and communication skills.",

        currentScore:
          weakestArea.score,

        targetScore: 80,

        improvementNeeded:
          Math.max(
            0,
            80 -
            weakestArea.score
          ),

        action:
          "Practice Interviews →",

        link:
          "/mock-interview",

      };

      break;


    // ---------------------------------------------------
    // ROADMAP
    // ---------------------------------------------------

    case "Roadmap":

      actionPlan = {

        area: "Roadmap",

        icon: "🗺️",

        title:
          "Continue Your Learning Roadmap",

        description:
          "Your learning roadmap has the lowest progress. Continue completing the recommended learning weeks and skills to improve your technical preparation.",

        currentScore:
          weakestArea.score,

        targetScore: 80,

        improvementNeeded:
          Math.max(
            0,
            80 -
            weakestArea.score
          ),

        action:
          "Continue Roadmap →",

        link:
          "/roadmap",

      };

      break;


    // ---------------------------------------------------
    // DEFAULT
    // ---------------------------------------------------

    default:

      actionPlan = {

        area:
          weakestArea.name,

        icon: "🚀",

        title:
          "Keep Improving",

        description:
          "Continue working on your placement preparation to improve your overall readiness.",

        currentScore:
          weakestArea.score,

        targetScore: 80,

        improvementNeeded:
          Math.max(
            0,
            80 -
            weakestArea.score
          ),

        action:
          "Continue Preparation →",

        link:
          "/coding-tracker",

      };

  }


  // =====================================================
  // CAREER PROGRESS
  // =====================================================

  const careerProgress =
    percentage(

      (
        atsScore +
        profileCompletion +
        placementReadiness +
        roadmapProgress
      ) / 4

    );


  // =====================================================
  // RETURN
  // =====================================================

  return {

    // ---------------------------------------------------
    // USER
    // ---------------------------------------------------

    user,

    // ---------------------------------------------------
    // RESUME
    // ---------------------------------------------------

    resumeData,

    atsScore,

    // ---------------------------------------------------
    // COMPANIES
    // ---------------------------------------------------

    eligibleCompanies,

    // ---------------------------------------------------
    // PROFILE
    // ---------------------------------------------------

    profileCompletion,

    // ---------------------------------------------------
    // PLACEMENT READINESS
    // ---------------------------------------------------

    placementReadiness,

    readinessComponents,

    readinessStatus,

    focusArea:
      weakestArea.name,

    focusAreaScore:
      weakestArea.score,

    actionPlan,

    // ---------------------------------------------------
    // INTERVIEW
    // ---------------------------------------------------

    interviewStats,

    interviewPercentage,

    // ---------------------------------------------------
    // CODING
    // ---------------------------------------------------

    codingStats,

    codingProgress,

    // ---------------------------------------------------
    // ROADMAP
    // ---------------------------------------------------

    roadmapCompany,

    roadmapData,

    completedWeeks,

    roadmapProgress,

    // ---------------------------------------------------
    // CAREER
    // ---------------------------------------------------

    careerProgress,

  };

};