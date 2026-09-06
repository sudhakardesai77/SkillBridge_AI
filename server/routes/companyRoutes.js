const express = require("express");

const router = express.Router();

const {
  getCompanies,
  getCompanyByName,
} = require("../controllers/companyController");

const {
  protect,
} = require("../middleware/authMiddleware");

// =====================================================
// GET ALL COMPANIES
// =====================================================

router.get(
  "/",
  protect,
  getCompanies
);

// =====================================================
// GET COMPANY BY NAME
// =====================================================

router.get(
  "/:name",
  protect,
  getCompanyByName
);

module.exports = router;