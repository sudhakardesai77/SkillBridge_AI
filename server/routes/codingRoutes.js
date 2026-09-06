const express = require("express");

const router = express.Router();

const {
  addProblem,
  addAIProblemToTracker,
  getProblems,
  toggleSolved,
  deleteProblem,
  getCodingStats,
  getAppliedJobsForCoding,
  getCodingRecommendations,
} = require("../controllers/codingController");

const {
  protect,
} = require("../middleware/authMiddleware");


// =====================================================
// AI / JOB ROUTES
// =====================================================

router.get(
  "/applied-jobs",
  protect,
  getAppliedJobsForCoding
);


router.post(
  "/recommendations",
  protect,
  getCodingRecommendations
);


router.post(
  "/recommendations/add",
  protect,
  addAIProblemToTracker
);


// =====================================================
// CODING TRACKER
// =====================================================

router.post(
  "/",
  protect,
  addProblem
);


router.get(
  "/",
  protect,
  getProblems
);


router.get(
  "/stats",
  protect,
  getCodingStats
);


router.put(
  "/:id/toggle",
  protect,
  toggleSolved
);


router.delete(
  "/:id",
  protect,
  deleteProblem
);


module.exports = router;