const axios = require("axios");
const FormData = require("form-data");
const User = require("../models/User");

const analyzeATS = async (req, res) => {
  try {
    // Find logged-in user
    const user = await User.findById(req.user._id);

    if (!user || !user.resume?.url) {
      return res.status(400).json({
        success: false,
        message: "Please upload your resume first.",
      });
    }

    // Download resume from Cloudinary
    const resumeResponse = await axios.get(user.resume.url, {
      responseType: "arraybuffer",
    });

    // Create FormData for Python API
    const formData = new FormData();

    formData.append("resume", Buffer.from(resumeResponse.data), {
      filename: "resume.pdf",
      contentType: "application/pdf",
    });

    // Send resume to Python service
    const pythonResponse = await axios.post(
      "http://127.0.0.1:8000/ats",
      formData,
      {
        headers: formData.getHeaders(),
      }
    );

    return res.status(200).json(pythonResponse.data);

  } catch (err) {
    console.error("ATS Error:", err.message);

    return res.status(500).json({
      success: false,
      message: "Failed to analyze ATS score.",
    });
  }
};

module.exports = {
  analyzeATS,
};