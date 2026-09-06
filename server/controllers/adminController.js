const User = require("../models/User");
const Job = require("../models/Job");
const Application = require("../models/Application");

// =====================================================
// ADMIN DASHBOARD STATS
// =====================================================

const getAdminStats = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({
      role: "student",
    });

    const totalRecruiters = await User.countDocuments({
      role: "recruiter",
    });

    const totalJobs = await Job.countDocuments();

    const totalApplications =
      await Application.countDocuments();

    const applied = await Application.countDocuments({
      status: "Applied",
    });

    const shortlisted = await Application.countDocuments({
      status: "Shortlisted",
    });

    const selected = await Application.countDocuments({
      status: "Selected",
    });

    const rejected = await Application.countDocuments({
      status: "Rejected",
    });

    const recentJobs = await Job.find()
      .populate("postedBy", "name email")
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    const recentApplications =
      await Application.find()
        .populate(
          "applicant",
          "name email college branch"
        )
        .populate(
          "job",
          "company jobTitle location jobType"
        )
        .sort({ createdAt: -1 })
        .limit(10)
        .lean();

    return res.status(200).json({
      success: true,
      stats: {
        totalStudents,
        totalRecruiters,
        totalJobs,
        totalApplications,
        applicationsByStatus: {
          applied,
          shortlisted,
          selected,
          rejected,
        },
      },
      recentJobs,
      recentApplications,
    });
  } catch (error) {
    console.error(
      "Admin Stats Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to load admin statistics.",
    });
  }
};

// =====================================================
// ADMIN USERS
// =====================================================

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password -__v")
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error(
      "Get All Users Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to load users.",
    });
  }
};

// =====================================================
// ADMIN ANALYTICS
// =====================================================

const getAdminAnalytics = async (req, res) => {
  try {
    // ---------------------------------------------
    // USER COUNTS
    // ---------------------------------------------

    const totalStudents = await User.countDocuments({
      role: "student",
    });

    const totalRecruiters = await User.countDocuments({
      role: "recruiter",
    });

    const totalAdmins = await User.countDocuments({
      role: "admin",
    });

    // ---------------------------------------------
    // JOB COUNTS
    // ---------------------------------------------

    const totalJobs = await Job.countDocuments();

    const fullTimeJobs = await Job.countDocuments({
      jobType: "Full-time",
    });

    const internshipJobs = await Job.countDocuments({
      jobType: "Internship",
    });

    const partTimeJobs = await Job.countDocuments({
      jobType: "Part-time",
    });

    // ---------------------------------------------
    // APPLICATION COUNTS
    // ---------------------------------------------

    const totalApplications =
      await Application.countDocuments();

    const applied = await Application.countDocuments({
      status: "Applied",
    });

    const shortlisted =
      await Application.countDocuments({
        status: "Shortlisted",
      });

    const selected = await Application.countDocuments({
      status: "Selected",
    });

    const rejected = await Application.countDocuments({
      status: "Rejected",
    });

    // ---------------------------------------------
    // SELECTION RATE
    // ---------------------------------------------

    const selectionRate =
      totalApplications > 0
        ? Number(
            (
              (selected / totalApplications) *
              100
            ).toFixed(1)
          )
        : 0;

    // ---------------------------------------------
    // APPLICATION STATUS
    // ---------------------------------------------

    const applicationStatus = [
      {
        name: "Applied",
        value: applied,
      },
      {
        name: "Shortlisted",
        value: shortlisted,
      },
      {
        name: "Selected",
        value: selected,
      },
      {
        name: "Rejected",
        value: rejected,
      },
    ];

    // ---------------------------------------------
    // JOB TYPES
    // ---------------------------------------------

    const jobTypes = [
      {
        name: "Full-time",
        value: fullTimeJobs,
      },
      {
        name: "Internship",
        value: internshipJobs,
      },
      {
        name: "Part-time",
        value: partTimeJobs,
      },
    ];

    // ---------------------------------------------
    // USERS BY ROLE
    // ---------------------------------------------

    const usersByRole = [
      {
        name: "Students",
        value: totalStudents,
      },
      {
        name: "Recruiters",
        value: totalRecruiters,
      },
      {
        name: "Admins",
        value: totalAdmins,
      },
    ];

    // ---------------------------------------------
    // TOP COMPANIES BY APPLICATIONS
    // ---------------------------------------------

    const companyApplications =
      await Application.aggregate([
        {
          $lookup: {
            from: "jobs",
            localField: "job",
            foreignField: "_id",
            as: "jobData",
          },
        },
        {
          $unwind: {
            path: "$jobData",
            preserveNullAndEmptyArrays: false,
          },
        },
        {
          $group: {
            _id: "$jobData.company",
            applications: {
              $sum: 1,
            },
          },
        },
        {
          $sort: {
            applications: -1,
          },
        },
        {
          $limit: 8,
        },
      ]);

    const topCompanies =
      companyApplications.map((item) => ({
        company: item._id || "Unknown",
        applications: item.applications,
      }));

    // ---------------------------------------------
    // TOP RECRUITERS BY JOBS
    // ---------------------------------------------

    const recruiterJobs =
      await Job.aggregate([
        {
          $match: {
            postedBy: {
              $ne: null,
            },
          },
        },
        {
          $group: {
            _id: "$postedBy",
            jobs: {
              $sum: 1,
            },
          },
        },
        {
          $sort: {
            jobs: -1,
          },
        },
        {
          $limit: 8,
        },
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "_id",
            as: "recruiter",
          },
        },
        {
          $unwind: {
            path: "$recruiter",
            preserveNullAndEmptyArrays: true,
          },
        },
      ]);

    const topRecruiters =
      recruiterJobs.map((item) => ({
        name:
          item.recruiter?.name ||
          "Unknown Recruiter",
        email:
          item.recruiter?.email || "",
        jobs: item.jobs,
      }));

    // ---------------------------------------------
    // APPLICATIONS BY MONTH
    // ---------------------------------------------

    const monthlyApplications =
      await Application.aggregate([
        {
          $match: {
            createdAt: {
              $exists: true,
            },
          },
        },
        {
          $group: {
            _id: {
              year: {
                $year: "$createdAt",
              },
              month: {
                $month: "$createdAt",
              },
            },
            applications: {
              $sum: 1,
            },
          },
        },
        {
          $sort: {
            "_id.year": 1,
            "_id.month": 1,
          },
        },
        {
          $limit: 12,
        },
      ]);

    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const applicationsOverTime =
      monthlyApplications.map((item) => ({
        month:
          monthNames[item._id.month - 1],
        year: item._id.year,
        applications: item.applications,
      }));

    // ---------------------------------------------
    // RECENT ACTIVITY
    // ---------------------------------------------

    const recentJobs = await Job.find()
      .populate("postedBy", "name email")
      .sort({
        createdAt: -1,
      })
      .limit(5)
      .lean();

    const recentApplications =
      await Application.find()
        .populate(
          "applicant",
          "name email college"
        )
        .populate(
          "job",
          "company jobTitle jobType"
        )
        .sort({
          createdAt: -1,
        })
        .limit(5)
        .lean();

    // ---------------------------------------------
    // FINAL RESPONSE
    // ---------------------------------------------

    return res.status(200).json({
      success: true,

      overview: {
        totalStudents,
        totalRecruiters,
        totalAdmins,
        totalJobs,
        totalApplications,
        selectionRate,
      },

      applicationStatus,

      jobTypes,

      usersByRole,

      topCompanies,

      topRecruiters,

      applicationsOverTime,

      recentJobs,

      recentApplications,
    });
  } catch (error) {
    console.error(
      "Admin Analytics Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to load admin analytics.",
    });
  }
};

module.exports = {
  getAdminStats,
  getAllUsers,
  getAdminAnalytics,
};