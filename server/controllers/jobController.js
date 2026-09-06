const Job = require("../models/Job");
const Bookmark = require("../models/Bookmark");

// =====================================================
// CHECK RECRUITER
// =====================================================

const checkRecruiter = (req, res) => {
  if (req.user.role !== "recruiter") {
    res.status(403).json({
      success: false,
      message: "Only recruiters can perform this action.",
    });

    return false;
  }

  return true;
};

// =====================================================
// GET ALL JOBS
// =====================================================

const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find()
      .sort({ createdAt: -1 })
      .lean();

    const bookmarks = await Bookmark.find({
      user: req.user._id,
    }).select("job");

    const bookmarkedJobIds = new Set(
      bookmarks.map((bookmark) =>
        bookmark.job.toString()
      )
    );

    const jobsWithBookmark = jobs.map((job) => ({
      ...job,

      bookmarked: bookmarkedJobIds.has(
        job._id.toString()
      ),
    }));

    return res.status(200).json({
      success: true,
      jobs: jobsWithBookmark,
    });
  } catch (err) {
    console.error("Get Jobs Error:", err);

    return res.status(500).json({
      success: false,
      message: "Failed to load jobs.",
    });
  }
};

// =====================================================
// CREATE JOB
// =====================================================

const createJob = async (req, res) => {
  try {
    if (!checkRecruiter(req, res)) {
      return;
    }

    const {
      company,
      companyWebsite,
      jobTitle,
      location,
      jobType,
      description,
      skills,
      applyLink,
    } = req.body;

    if (!company || !jobTitle) {
      return res.status(400).json({
        success: false,
        message: "Company and job title are required.",
      });
    }

    const job = await Job.create({
      company,
      companyWebsite: companyWebsite || "",
      jobTitle,
      location,
      jobType,
      description,

      skills: Array.isArray(skills)
        ? skills
        : [],

      applyLink: applyLink || "",
      postedBy: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: "Job posted successfully.",
      job,
    });

  } catch (err) {
    console.error("Create Job Error:", err);

    return res.status(500).json({
      success: false,
      message: "Failed to create job.",
    });
  }
};

// =====================================================
// GET MY JOBS - RECRUITER
// =====================================================

const getMyJobs = async (req, res) => {
  try {
    if (!checkRecruiter(req, res)) {
      return;
    }

    const jobs = await Job.find({
      postedBy: req.user._id,
    })
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      jobs,
    });
  } catch (err) {
    console.error("Get My Jobs Error:", err);

    return res.status(500).json({
      success: false,
      message: "Failed to load your jobs.",
    });
  }
};

// =====================================================
// DELETE MY JOB - RECRUITER
// =====================================================

const deleteJob = async (req, res) => {
  try {
    if (!checkRecruiter(req, res)) {
      return;
    }

    const { id } = req.params;

    const job = await Job.findOne({
      _id: id,
      postedBy: req.user._id,
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message:
          "Job not found or you are not the owner.",
      });
    }

    await Job.findByIdAndDelete(id);

    // Also remove bookmarks for this job
    await Bookmark.deleteMany({
      job: id,
    });

    return res.status(200).json({
      success: true,
      message: "Job deleted successfully.",
    });
  } catch (err) {
    console.error("Delete Job Error:", err);

    return res.status(500).json({
      success: false,
      message: "Failed to delete job.",
    });
  }
};

// =====================================================
// BOOKMARK JOB
// =====================================================

const bookmarkJob = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found.",
      });
    }

    const existingBookmark =
      await Bookmark.findOne({
        user: req.user._id,
        job: id,
      });

    if (existingBookmark) {
      return res.status(400).json({
        success: false,
        message: "Job already bookmarked.",
      });
    }

    await Bookmark.create({
      user: req.user._id,
      job: id,
    });

    return res.status(201).json({
      success: true,
      message: "Job bookmarked successfully.",
    });
  } catch (err) {
    console.error("Bookmark Job Error:", err);

    return res.status(500).json({
      success: false,
      message: "Failed to bookmark job.",
    });
  }
};

// =====================================================
// REMOVE BOOKMARK
// =====================================================

const removeBookmark = async (req, res) => {
  try {
    const { id } = req.params;

    await Bookmark.findOneAndDelete({
      user: req.user._id,
      job: id,
    });

    return res.status(200).json({
      success: true,
      message: "Bookmark removed.",
    });
  } catch (err) {
    console.error("Remove Bookmark Error:", err);

    return res.status(500).json({
      success: false,
      message: "Failed to remove bookmark.",
    });
  }
};

// =====================================================
// GET SAVED JOBS
// =====================================================

const getBookmarkedJobs = async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({
      user: req.user._id,
    })
      .populate("job")
      .sort({ createdAt: -1 });

    const jobs = bookmarks
      .filter((bookmark) => bookmark.job)
      .map((bookmark) => ({
        ...bookmark.job.toObject(),
        bookmarked: true,
        bookmarkedAt: bookmark.createdAt,
      }));

    return res.status(200).json({
      success: true,
      jobs,
    });
  } catch (err) {
    console.error(
      "Get Bookmarked Jobs Error:",
      err
    );

    return res.status(500).json({
      success: false,
      message: "Failed to load saved jobs.",
    });
  }
};

// =====================================================
// ADMIN - GET ALL JOBS
// =====================================================

const getAllJobsForAdmin = async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate(
        "postedBy",
        "name email role"
      )
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (err) {
    console.error(
      "Admin Get Jobs Error:",
      err
    );

    return res.status(500).json({
      success: false,
      message: "Failed to load admin jobs.",
    });
  }
};

// =====================================================
// ADMIN - DELETE ANY JOB
// =====================================================

const deleteJobByAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found.",
      });
    }

    // Delete job
    await Job.findByIdAndDelete(id);

    // Remove bookmarks related to the deleted job
    await Bookmark.deleteMany({
      job: id,
    });

    return res.status(200).json({
      success: true,
      message: "Job deleted successfully by admin.",
    });
  } catch (err) {
    console.error(
      "Admin Delete Job Error:",
      err
    );

    return res.status(500).json({
      success: false,
      message: "Failed to delete job.",
    });
  }
};

// =====================================================
// EXPORT
// =====================================================

module.exports = {
  getJobs,
  createJob,
  getMyJobs,
  deleteJob,
  bookmarkJob,
  removeBookmark,
  getBookmarkedJobs,

  // Admin
  getAllJobsForAdmin,
  deleteJobByAdmin,
};