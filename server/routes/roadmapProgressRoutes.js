const express = require("express");

const router = express.Router();

const {
  getRoadmapProgress,
  toggleWeekCompletion,
} = require(
  "../controllers/roadmapProgressController"
);

const {
  protect,
} = require("../middleware/authMiddleware");


// GET PROGRESS

router.get(
  "/",
  protect,
  getRoadmapProgress
);


// UPDATE PROGRESS

router.post(
  "/toggle",
  protect,
  toggleWeekCompletion
);


module.exports = router;