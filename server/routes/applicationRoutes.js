const express = require("express");

const router = express.Router();

const {
  applyForJob,
  getMyApplications,
  getJobApplicants,
  updateApplicationStatus,
  cancelApplication,

  // Admin
  getAllApplicationsForAdmin,
} = require("../controllers/applicationController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

// =====================================================
// STUDENT
// =====================================================

// Apply for a job
router.post(
  "/:jobId",
  protect,
  applyForJob
);

// Cancel application
router.delete(
  "/:jobId",
  protect,
  cancelApplication
);

// Get my applications
router.get(
  "/my-applications",
  protect,
  getMyApplications
);

// =====================================================
// RECRUITER
// =====================================================

// Get applicants for a job
router.get(
  "/job/:jobId",
  protect,
  getJobApplicants
);

// Update applicant status
router.put(
  "/:applicationId/status",
  protect,
  updateApplicationStatus
);

// =====================================================
// ADMIN
// =====================================================

// Get all applications
router.get(
  "/admin/all",
  protect,
  authorize("admin"),
  getAllApplicationsForAdmin
);

module.exports = router;