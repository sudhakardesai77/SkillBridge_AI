const express = require("express");

const router = express.Router();

const {
  generateRoadmap,
  getRoadmapProgress,
  toggleWeekCompletion,
} = require(
  "../controllers/roadmapController"
);

const {
  protect,
} = require(
  "../middleware/authMiddleware"
);


// ==========================================
// GENERATE AI ROADMAP
// POST /api/roadmap
// ==========================================

router.post(
  "/",
  protect,
  generateRoadmap
);


// ==========================================
// GET ROADMAP PROGRESS
// GET /api/roadmap/progress
// ==========================================

router.get(
  "/progress",
  protect,
  getRoadmapProgress
);


// ==========================================
// COMPLETE / UNCOMPLETE WEEK
// PATCH /api/roadmap/progress/:week
// ==========================================

router.patch(
  "/progress/:week",
  protect,
  toggleWeekCompletion
);


module.exports = router;