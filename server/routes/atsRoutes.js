const express = require("express");
const router = express.Router();

const { analyzeATS } = require("../controllers/atsController");
const { protect } = require("../middleware/authMiddleware");

router.get("/analyze", protect, analyzeATS);

module.exports = router;