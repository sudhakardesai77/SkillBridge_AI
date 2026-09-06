const User = require("../models/User");

const {
  generateRoadmapAI,
} = require("../services/geminiService");


// ==================================================
// GENERATE AI ROADMAP
// ==================================================

const generateRoadmap = async (req, res) => {
  try {
    const {
      company,
      missingSkills,
    } = req.body;

    // ==========================================
    // VALIDATE COMPANY
    // ==========================================

    if (
      !company ||
      typeof company !== "string" ||
      company.trim() === ""
    ) {
      return res.status(400).json({
        success: false,
        message: "Company is required.",
      });
    }

    // ==========================================
    // VALIDATE MISSING SKILLS
    // ==========================================

    if (
      !Array.isArray(missingSkills) ||
      missingSkills.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Missing skills are required to generate a roadmap.",
      });
    }

    // ==========================================
    // FIND USER
    // ==========================================

    const user = await User.findById(
      req.user._id
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // ==========================================
    // GET CURRENT SKILLS
    // ==========================================

    let currentSkills = user.skills || [];

    // Prefer parsed resume skills

    if (
      user.resumeData &&
      Array.isArray(user.resumeData.skills) &&
      user.resumeData.skills.length > 0
    ) {
      currentSkills = user.resumeData.skills;
    }

    // ==========================================
    // CLEAN MISSING SKILLS
    // ==========================================

    const cleanedMissingSkills = [
      ...new Set(
        missingSkills
          .filter(
            (skill) =>
              typeof skill === "string" &&
              skill.trim() !== ""
          )
          .map((skill) => skill.trim())
      ),
    ];

    if (cleanedMissingSkills.length === 0) {
      return res.status(400).json({
        success: false,
        message:
          "No valid missing skills were provided.",
      });
    }

    // ==========================================
    // LOGGING
    // ==========================================

    console.log("\n=================================");
    console.log("AI ROADMAP GENERATION");
    console.log("=================================");
    console.log("Company:", company);
    console.log("Current Skills:", currentSkills);
    console.log(
      "Missing Skills:",
      cleanedMissingSkills
    );
    console.log("=================================\n");

    // ==========================================
    // GENERATE AI ROADMAP
    // ==========================================

    const roadmap = await generateRoadmapAI(
      company.trim(),
      cleanedMissingSkills,
      currentSkills
    );

    // ==========================================
    // VALIDATE ROADMAP
    // ==========================================

    if (!roadmap) {
      return res.status(500).json({
        success: false,
        message:
          "AI failed to generate roadmap data.",
      });
    }

    // ==========================================
    // TOTAL WEEKS
    // ==========================================

    const totalWeeks =
      roadmap.roadmap?.length || 0;

    const selectedCompany =
      company.trim();

    // ==========================================
    // INITIALIZE / UPDATE PROGRESS
    // ==========================================

    // Reset progress only if company changes

    if (
      !user.roadmapProgress ||
      user.roadmapProgress.company !==
        selectedCompany
    ) {
      user.roadmapProgress = {
        company: selectedCompany,
        completedWeeks: [],
        totalWeeks: totalWeeks,
        progressPercentage: 0,
        lastUpdated: new Date(),
      };
    } else {
      // Same company
      // Keep previous completed weeks

      user.roadmapProgress.totalWeeks =
        totalWeeks;

      // Remove invalid week numbers
      user.roadmapProgress.completedWeeks =
        (
          user.roadmapProgress.completedWeeks ||
          []
        )
          .filter(
            (week) =>
              week >= 1 &&
              week <= totalWeeks
          )
          .sort((a, b) => a - b);

      const completedCount =
        user.roadmapProgress.completedWeeks
          .length;

      const percentage =
        totalWeeks > 0
          ? Math.round(
              (completedCount / totalWeeks) *
                100
            )
          : 0;

      user.roadmapProgress.progressPercentage =
        Math.min(percentage, 100);

      user.roadmapProgress.lastUpdated =
        new Date();
    }

    await user.save();

    // ==========================================
    // RESPONSE
    // ==========================================

    return res.status(200).json({
      success: true,

      message:
        "AI roadmap generated successfully.",

      data: roadmap,

      progress: user.roadmapProgress,
    });

  } catch (error) {

    console.error(
      "AI Roadmap Error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to generate AI roadmap.",

      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};


// ==================================================
// GET ROADMAP PROGRESS
// ==================================================

const getRoadmapProgress = async (
  req,
  res
) => {
  try {

    const user = await User.findById(
      req.user._id
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Default progress

    const defaultProgress = {
      company: "",
      completedWeeks: [],
      totalWeeks: 0,
      progressPercentage: 0,
      lastUpdated: null,
    };

    return res.status(200).json({
      success: true,

      data:
        user.roadmapProgress ||
        defaultProgress,
    });

  } catch (error) {

    console.error(
      "Get Roadmap Progress Error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to get roadmap progress.",
    });
  }
};


// ==================================================
// TOGGLE WEEK COMPLETION
// ==================================================

const toggleWeekCompletion = async (
  req,
  res
) => {
  try {

    const weekNumber = Number(
      req.params.week
    );

    // ==========================================
    // VALIDATE WEEK NUMBER
    // ==========================================

    if (
      !Number.isInteger(weekNumber) ||
      weekNumber < 1
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid week number.",
      });
    }

    // ==========================================
    // FIND USER
    // ==========================================

    const user = await User.findById(
      req.user._id
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // ==========================================
    // CHECK ROADMAP EXISTS
    // ==========================================

    if (
      !user.roadmapProgress ||
      !user.roadmapProgress.company ||
      user.roadmapProgress.totalWeeks === 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Please generate a roadmap first.",
      });
    }

    const totalWeeks =
      user.roadmapProgress.totalWeeks;

    // ==========================================
    // CHECK WEEK RANGE
    // ==========================================

    if (weekNumber > totalWeeks) {
      return res.status(400).json({
        success: false,
        message:
          `Week number must be between 1 and ${totalWeeks}.`,
      });
    }

    // ==========================================
    // GET COMPLETED WEEKS
    // ==========================================

    let completedWeeks =
      user.roadmapProgress.completedWeeks ||
      [];

    // ==========================================
    // TOGGLE WEEK
    // ==========================================

    if (completedWeeks.includes(weekNumber)) {

      completedWeeks =
        completedWeeks.filter(
          (week) => week !== weekNumber
        );

    } else {

      completedWeeks.push(
        weekNumber
      );
    }

    // ==========================================
    // REMOVE DUPLICATES AND SORT
    // ==========================================

    completedWeeks = [
      ...new Set(completedWeeks),
    ]
      .filter(
        (week) =>
          week >= 1 &&
          week <= totalWeeks
      )
      .sort((a, b) => a - b);

    user.roadmapProgress.completedWeeks =
      completedWeeks;

    // ==========================================
    // CALCULATE PERCENTAGE
    // ==========================================

    const completedCount =
      completedWeeks.length;

    const percentage =
      totalWeeks > 0
        ? Math.round(
            (completedCount / totalWeeks) *
              100
          )
        : 0;

    user.roadmapProgress.progressPercentage =
      Math.min(
        Math.max(percentage, 0),
        100
      );

    user.roadmapProgress.lastUpdated =
      new Date();

    // ==========================================
    // SAVE
    // ==========================================

    await user.save();

    // ==========================================
    // RESPONSE
    // ==========================================

    return res.status(200).json({
      success: true,

      message:
        "Roadmap progress updated successfully.",

      data: user.roadmapProgress,
    });

  } catch (error) {

    console.error(
      "Toggle Week Error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to update roadmap progress.",
    });
  }
};


// ==================================================
// EXPORTS
// ==================================================

module.exports = {
  generateRoadmap,
  getRoadmapProgress,
  toggleWeekCompletion,
};