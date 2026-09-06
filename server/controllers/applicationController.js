const Application = require("../models/Application");
const Job = require("../models/Job");

// =====================================================
// STUDENT - APPLY FOR JOB
// =====================================================

const applyForJob = async (req, res) => {
  try {
    // Only students can apply for jobs
    if (req.user.role !== "student") {
      return res.status(403).json({
        success: false,
        message: "Only students can apply for jobs.",
      });
    }

    const { jobId } = req.params;

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found.",
      });
    }

    const existingApplication =
      await Application.findOne({
        job: jobId,
        applicant: req.user._id,
      });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message:
          "You have already applied for this job.",
      });
    }

    const application = await Application.create({
      job: jobId,
      applicant: req.user._id,
      status: "Applied",
    });

    return res.status(201).json({
      success: true,
      message:
        "Application submitted successfully.",
      application,
    });
  } catch (err) {
    console.error("Apply Job Error:", err);

    return res.status(500).json({
      success: false,
      message: "Failed to apply for job.",
    });
  }
};

// =====================================================
// STUDENT - GET MY APPLICATIONS
// =====================================================

const getMyApplications = async (req, res) => {
  try {
    const applications =
      await Application.find({
        applicant: req.user._id,
      })
        .populate("job")
        .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      applications,
    });
  } catch (err) {
    console.error(
      "Get My Applications Error:",
      err
    );

    return res.status(500).json({
      success: false,
      message: "Failed to load applications.",
    });
  }
};

// =====================================================
// RECRUITER - GET APPLICANTS FOR MY JOB
// =====================================================

const getJobApplicants = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found.",
      });
    }

    // Only the recruiter who posted the job
    // can view applicants
    if (
      !job.postedBy ||
      job.postedBy.toString() !==
        req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You are not allowed to view these applicants.",
      });
    }

    const applications =
      await Application.find({
        job: jobId,
      })
        .populate(
          "applicant",
          "name email college branch cgpa skills linkedin github leetcode resume role"
        )
        .populate(
          "job",
          "company jobTitle location jobType"
        )
        .sort({ createdAt: -1 });

    // Only students should appear as applicants
    const studentApplications =
      applications.filter(
        (application) =>
          application.applicant &&
          application.applicant.role ===
            "student"
      );

    return res.status(200).json({
      success: true,
      job,
      applicants: studentApplications,
    });
  } catch (err) {
    console.error(
      "Get Applicants Error:",
      err
    );

    return res.status(500).json({
      success: false,
      message: "Failed to load applicants.",
    });
  }
};

// =====================================================
// RECRUITER - UPDATE APPLICATION STATUS
// =====================================================

const updateApplicationStatus = async (
  req,
  res
) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "Applied",
      "Shortlisted",
      "Rejected",
      "Selected",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid application status.",
      });
    }

    const application =
      await Application.findById(
        applicationId
      ).populate("job");

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found.",
      });
    }

    if (
      !application.job ||
      !application.job.postedBy ||
      application.job.postedBy.toString() !==
        req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You are not allowed to update this application.",
      });
    }

    application.status = status;

    await application.save();

    return res.status(200).json({
      success: true,
      message:
        "Application status updated successfully.",
      application,
    });
  } catch (err) {
    console.error(
      "Update Application Status Error:",
      err
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to update application status.",
    });
  }
};

// =====================================================
// STUDENT - CANCEL / WITHDRAW APPLICATION
// =====================================================

const cancelApplication = async (
  req,
  res
) => {
  try {
    const { jobId } = req.params;

    const application =
      await Application.findOne({
        job: jobId,
        applicant: req.user._id,
      });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found.",
      });
    }

    await Application.findByIdAndDelete(
      application._id
    );

    return res.status(200).json({
      success: true,
      message:
        "Application cancelled successfully.",
    });
  } catch (err) {
    console.error(
      "Cancel Application Error:",
      err
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to cancel application.",
    });
  }
};

// =====================================================
// ADMIN - GET ALL APPLICATIONS
// =====================================================

const getAllApplicationsForAdmin = async (
  req,
  res
) => {
  try {
    const applications =
      await Application.find()
        .populate(
          "applicant",
          "name email college branch cgpa skills role"
        )
        .populate({
          path: "job",
          select:
            "company jobTitle location jobType postedBy",
          populate: {
            path: "postedBy",
            select: "name email role",
          },
        })
        .sort({ createdAt: -1 })
        .lean();

    return res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (err) {
    console.error(
      "Admin Get Applications Error:",
      err
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to load admin applications.",
    });
  }
};

// =====================================================
// EXPORT
// =====================================================

module.exports = {
  applyForJob,
  getMyApplications,
  getJobApplicants,
  updateApplicationStatus,
  cancelApplication,

  // Admin
  getAllApplicationsForAdmin,
};