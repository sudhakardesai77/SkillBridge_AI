const Company = require("../models/Company");

// =====================================================
// GET ALL COMPANIES
// =====================================================

const getCompanies = async (req, res) => {
  try {
    const companies = await Company.find({})
      .sort({ name: 1 })
      .lean();

    return res.status(200).json({
      success: true,
      companies,
    });
  } catch (error) {
    console.error(
      "Get Companies Error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch companies.",
    });
  }
};

// =====================================================
// GET SINGLE COMPANY
// =====================================================

const getCompanyByName = async (req, res) => {
  try {
    const companyName = decodeURIComponent(
      req.params.name
    );

    const company = await Company.findOne({
      name: {
        $regex: `^${companyName}$`,
        $options: "i",
      },
    }).lean();

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found.",
      });
    }

    return res.status(200).json({
      success: true,
      company,
    });
  } catch (error) {
    console.error(
      "Get Company Error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch company.",
    });
  }
};

module.exports = {
  getCompanies,
  getCompanyByName,
};