const express = require("express");

const router = express.Router();

const upload = require("../middleware/uploadMiddleware");

const {
  register,
  login,
  getProfile,
  updateProfile,
  uploadResume,
  deleteResume,
} = require("../controllers/authController");

const {
  protect,
} = require("../middleware/authMiddleware");

router.post(
  "/register",
  register
);

router.post(
  "/login",
  login
);

router.get(
  "/profile",
  protect,
  getProfile
);

router.put(
  "/profile",
  protect,
  updateProfile
);

// Upload / replace resume
router.post(
  "/resume",
  protect,
  upload.single("resume"),
  uploadResume
);

// Delete resume
router.delete(
  "/resume",
  protect,
  deleteResume
);

module.exports = router;