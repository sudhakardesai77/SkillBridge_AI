const express = require("express");

const router = express.Router();

const {
  generateQuestions,
  evaluateInterview,
  saveInterview,
  getInterviewHistory,
  getInterviewStats,
} = require("../controllers/interviewController");

const {
  protect,
} = require("../middleware/authMiddleware");

// ==================================================
// GENERATE AI INTERVIEW QUESTIONS
// ==================================================

router.post(
  "/generate",
  protect,
  generateQuestions
);

// ==================================================
// AI ANSWER EVALUATION
// ==================================================

router.post(
  "/evaluate",
  protect,
  evaluateInterview
);

// ==================================================
// SAVE INTERVIEW
// ==================================================

router.post(
  "/save",
  protect,
  saveInterview
);

// ==================================================
// INTERVIEW HISTORY
// ==================================================

router.get(
  "/history",
  protect,
  getInterviewHistory
);

// ==================================================
// INTERVIEW STATS
// ==================================================

router.get(
  "/stats",
  protect,
  getInterviewStats
);

module.exports = router;