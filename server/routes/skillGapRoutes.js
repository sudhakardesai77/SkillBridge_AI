const express = require("express");
const router = express.Router();

const { analyzeSkillGap } = require("../controllers/skillGapController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, analyzeSkillGap);

module.exports = router;