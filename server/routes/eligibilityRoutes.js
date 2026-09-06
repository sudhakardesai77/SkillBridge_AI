const express = require("express");
const router = express.Router();

const { checkEligibility } = require("../controllers/eligibilityController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, checkEligibility);

module.exports = router;