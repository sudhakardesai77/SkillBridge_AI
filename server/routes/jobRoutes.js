const express = require("express");

const router = express.Router();

const {
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
} = require("../controllers/jobController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

const {
  recruiterOnly,
} = require("../middleware/roleMiddleware");

// =====================================================
// GET ALL JOBS
// =====================================================

router.get(
  "/",
  protect,
  getJobs
);

// =====================================================
// CREATE JOB - RECRUITER
// =====================================================

router.post(
  "/",
  protect,
  recruiterOnly,
  createJob
);

// =====================================================
// GET MY JOBS - RECRUITER
// =====================================================

router.get(
  "/my-jobs",
  protect,
  getMyJobs
);

// =====================================================
// GET SAVED JOBS
// =====================================================

router.get(
  "/bookmarks",
  protect,
  getBookmarkedJobs
);

// =====================================================
// ADMIN - GET ALL JOBS
// =====================================================

router.get(
  "/admin/all",
  protect,
  authorize("admin"),
  getAllJobsForAdmin
);

// =====================================================
// ADMIN - DELETE ANY JOB
// =====================================================

router.delete(
  "/admin/:id",
  protect,
  authorize("admin"),
  deleteJobByAdmin
);

// =====================================================
// DELETE MY JOB - RECRUITER
// =====================================================

router.delete(
  "/:id",
  protect,
  recruiterOnly,
  deleteJob
);

// =====================================================
// BOOKMARK JOB
// =====================================================

router.post(
  "/:id/bookmark",
  protect,
  bookmarkJob
);

// =====================================================
// REMOVE BOOKMARK
// =====================================================

router.delete(
  "/:id/bookmark",
  protect,
  removeBookmark
);

module.exports = router;