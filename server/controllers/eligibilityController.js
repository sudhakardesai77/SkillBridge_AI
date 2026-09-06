const User = require("../models/User");
const Company = require("../models/Company");

// =====================================================
// CHECK ELIGIBILITY
// =====================================================

const checkEligibility = async (req, res) => {
  try {
    // =====================================================
    // FIND USER
    // =====================================================

    const user = await User.findById(
      req.user._id
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // =====================================================
    // GET RESUME DATA
    // =====================================================

    const resumeData =
      user.resumeData || null;

    // =====================================================
    // DEFAULT PROFILE DATA
    // =====================================================

    let cgpa =
      Number(user.cgpa) || 0;

    let skills =
      Array.isArray(user.skills)
        ? user.skills
        : [];

    // =====================================================
    // USE RESUME DATA FIRST
    // =====================================================

    if (resumeData) {
      if (
        resumeData.cgpa !== undefined &&
        resumeData.cgpa !== null &&
        resumeData.cgpa !== ""
      ) {
        const parsedCgpa =
          Number(resumeData.cgpa);

        if (
          Number.isFinite(parsedCgpa)
        ) {
          cgpa = parsedCgpa;
        }
      }

      if (
        Array.isArray(
          resumeData.skills
        )
      ) {
        skills =
          resumeData.skills;
      }
    }

    // =====================================================
    // VALIDATION
    // =====================================================

    if (
      !resumeData &&
      !user.resume?.url &&
      cgpa === 0 &&
      skills.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Please upload a resume or complete your profile first.",
      });
    }

    // =====================================================
    // LOAD ALL COMPANIES
    // =====================================================

    const companies =
      await Company.find({})
        .sort({ name: 1 })
        .lean();

    // =====================================================
    // NORMALIZE STUDENT SKILLS
    // =====================================================

    const studentSkillSet =
      new Set(
        skills
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
    // CHECK EVERY COMPANY
    // =====================================================

    const results =
      companies.map(
        (company) => {
          const matchedSkills = [];
          const missingSkills = [];

          for (
            const skill of company.skills || []
          ) {
            if (
              studentSkillSet.has(
                skill
                  .trim()
                  .toLowerCase()
              )
            ) {
              matchedSkills.push(
                skill
              );
            } else {
              missingSkills.push(
                skill
              );
            }
          }

          const requiredSkills =
            company.skills?.length || 0;

          const matchPercentage =
            requiredSkills === 0
              ? 100
              : Math.round(
                  (matchedSkills.length /
                    requiredSkills) *
                    100
                );

          const cgpaEligible =
            cgpa >=
            Number(
              company.minCGPA || 0
            );

          const eligible =
            cgpaEligible &&
            missingSkills.length === 0;

          return {
            company:
              company.name,

            eligible,

            cgpaRequired:
              company.minCGPA,

            cgpaEligible,

            matchedSkills,

            missingSkills,

            matchPercentage,

            location:
              company.location,

            package:
              company.package,

            roles:
              company.roles || [],
          };
        }
      );

    // =====================================================
    // RESPONSE
    // =====================================================

    return res.status(200).json({
      success: true,

      cgpa,

      skills,

      totalCompanies:
        results.length,

      eligibleCompanies:
        results.filter(
          (company) =>
            company.eligible
        ).length,

      companies:
        results,
    });
  } catch (error) {
    console.error(
      "Eligibility Error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to check eligibility.",
    });
  }
};

module.exports = {
  checkEligibility,
};