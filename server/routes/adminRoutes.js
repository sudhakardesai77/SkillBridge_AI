const express = require("express");

const router = express.Router();

const {
  getAdminStats,
  getAllUsers,
  getAdminAnalytics,
} = require("../controllers/adminController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

// Dashboard statistics
router.get(
  "/stats",
  protect,
  authorize("admin"),
  getAdminStats
);

// All users
router.get(
  "/users",
  protect,
  authorize("admin"),
  getAllUsers
);

// Analytics
router.get(
  "/analytics",
  protect,
  authorize("admin"),
  getAdminAnalytics
);

module.exports = router;