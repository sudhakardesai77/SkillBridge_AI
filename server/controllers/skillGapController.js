const User = require("../models/User");
const Company = require("../models/Company");

// =====================================================
// ANALYZE SKILL GAP
// =====================================================

const analyzeSkillGap = async (
  req,
  res
) => {
  try {
    const { company } =
      req.body;

    // =====================================================
    // VALIDATE COMPANY
    // =====================================================

    if (
      !company ||
      typeof company !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Company name is required.",
      });
    }

    // =====================================================
    // FIND USER
    // =====================================================

    const user =
      await User.findById(
        req.user._id
      );

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "User not found.",
      });
    }

    // =====================================================
    // FIND COMPANY
    // =====================================================

    const companyName =
      company.trim();

    const companyData =
      await Company.findOne({
        name: {
          $regex: `^${companyName.replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
          )}$`,
          $options: "i",
        },
      }).lean();

    if (!companyData) {
      console.log(
        "Company not found:",
        companyName
      );

      return res.status(404).json({
        success: false,
        message:
          `Company "${companyName}" was not found in the company database.`,
      });
    }

    // =====================================================
    // GET STUDENT SKILLS
    // =====================================================

    const resumeData =
      user.resumeData || null;

    let studentSkills =
      Array.isArray(user.skills)
        ? user.skills
        : [];

    if (
      resumeData &&
      Array.isArray(
        resumeData.skills
      )
    ) {
      studentSkills =
        resumeData.skills;
    }

    // =====================================================
    // NORMALIZE STUDENT SKILLS
    // =====================================================

    const studentSkillSet =
      new Set(
        studentSkills
          .filter(
            (skill) =>
              typeof skill === "string"
          )
          .map((skill) =>
            skill
              .trim()
              .toLowerCase()
          )
      );

    // =====================================================
    // COMPARE SKILLS
    // =====================================================

    const matchedSkills = [];
    const missingSkills = [];
    const recommendations = [];

    const requiredSkills =
      companyData.skills || [];

    for (
      const skill of requiredSkills
    ) {
      const normalizedSkill =
        skill
          .trim()
          .toLowerCase();

      if (
        studentSkillSet.has(
          normalizedSkill
        )
      ) {
        matchedSkills.push(
          skill
        );
      } else {
        missingSkills.push(
          skill
        );

        recommendations.push({
          skill,

          priority:
            missingSkills.length <= 2
              ? "High"
              : "Medium",

          reason:
            `${companyData.name} requires this skill.`,
        });
      }
    }

    // =====================================================
    // MATCH PERCENTAGE
    // =====================================================

    const totalSkills =
      requiredSkills.length;

    const skillMatch =
      totalSkills === 0
        ? 100
        : Math.round(
            (matchedSkills.length /
              totalSkills) *
              100
          );

    // =====================================================
    // RESPONSE
    // =====================================================

    return res.status(200).json({
      success: true,

      company:
        companyData.name,

      skillMatch,

      matchedSkills,

      missingSkills,

      recommendations,

      companyDetails: {
        minCGPA:
          companyData.minCGPA,

        package:
          companyData.package,

        location:
          companyData.location,

        roles:
          companyData.roles || [],

        skills:
          companyData.skills || [],
      },
    });
  } catch (error) {
    console.error(
      "Skill Gap Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to analyze skill gap.",
      error:
        process.env.NODE_ENV ===
        "development"
          ? error.message
          : undefined,
    });
  }
};

module.exports = {
  analyzeSkillGap,
};