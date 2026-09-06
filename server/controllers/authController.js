const axios = require("axios");
const FormData = require("form-data");

const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");

const SALT_ROUNDS = 10;

// =====================================================
// FORMAT USER RESPONSE
// =====================================================

const formatUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  college: user.college,
  branch: user.branch,
  cgpa: user.cgpa,
  skills: user.skills,
  linkedin: user.linkedin,
  github: user.github,
  leetcode: user.leetcode,
  resume: user.resume,
  resumeData: user.resumeData || null,
});

// =====================================================
// REGISTER
// =====================================================

const register = async (req, res) => {
  try {
    const name = req.body.name?.trim();
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password;
    const requestedRole = req.body.role;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 6 characters long",
      });
    }

    const role =
      requestedRole === "recruiter"
        ? "recruiter"
        : "student";

    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      SALT_ROUNDS
    );

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    console.log("====================================");
    console.log("New User Registered");
    console.log("Name:", user.name);
    console.log("Email:", user.email);
    console.log("Role:", user.role);
    console.log("====================================");

    return res.status(201).json({
      success: true,
      message: "User Registered Successfully",
      data: {
        user: formatUser(user),
      },
    });
  } catch (error) {
    console.error("Register Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// =====================================================
// LOGIN
// =====================================================

const login = async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Email and password are required",
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email",
      });
    }

    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return res.status(200).json({
      success: true,
      message: "Login Successful",
      data: {
        token,
        user: formatUser(user),
      },
    });
  } catch (error) {
    console.error("Login Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// =====================================================
// GET PROFILE
// =====================================================

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        user: formatUser(user),
      },
    });
  } catch (error) {
    console.error(
      "Get Profile Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to get profile",
    });
  }
};

// =====================================================
// UPDATE PROFILE
// =====================================================

const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(
      req.user._id
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const {
      name,
      college,
      branch,
      cgpa,
      skills,
      linkedin,
      github,
      leetcode,
    } = req.body;

    user.name = name || user.name;
    user.college = college || user.college;
    user.branch = branch || user.branch;
    user.cgpa = cgpa ?? user.cgpa;
    user.skills = skills || user.skills;
    user.linkedin = linkedin || user.linkedin;
    user.github = github || user.github;
    user.leetcode = leetcode || user.leetcode;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile Updated Successfully",
      data: {
        user: formatUser(user),
      },
    });
  } catch (error) {
    console.error(
      "Update Profile Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// UPLOAD / REPLACE RESUME
// =====================================================

const uploadResume = async (req, res) => {
  let newCloudinaryPublicId = null;

  try {
    const user = await User.findById(
      req.user._id
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    // -------------------------------------------------
    // VALIDATE PDF
    // -------------------------------------------------

    if (
      req.file.mimetype !==
      "application/pdf"
    ) {
      return res.status(400).json({
        success: false,
        message: "Only PDF files are allowed",
      });
    }

    // -------------------------------------------------
    // SAVE OLD RESUME INFORMATION
    // -------------------------------------------------

    const oldResumePublicId =
      user.resume?.publicId || "";

    // -------------------------------------------------
    // 1. UPLOAD NEW RESUME TO CLOUDINARY
    // -------------------------------------------------

    console.log(
      "Uploading new resume to Cloudinary..."
    );

    const result = await new Promise(
      (resolve, reject) => {
        const uploadStream =
          cloudinary.uploader.upload_stream(
            {
              folder:
                "SkillBridgeAI/Resumes",
              resource_type: "raw",
            },
            (error, result) => {
              if (error) {
                return reject(error);
              }

              resolve(result);
            }
          );

        streamifier
          .createReadStream(
            req.file.buffer
          )
          .pipe(uploadStream);
      }
    );

    newCloudinaryPublicId =
      result.public_id;

    console.log(
      "New resume uploaded:",
      result.secure_url
    );

    // -------------------------------------------------
    // 2. SEND NEW RESUME TO PYTHON PARSER
    // -------------------------------------------------

    console.log(
      "Parsing new resume..."
    );

    const formData = new FormData();

    formData.append(
      "resume",
      req.file.buffer,
      {
        filename:
          req.file.originalname,
        contentType:
          req.file.mimetype,
      }
    );

    const pythonResponse =
      await axios.post(
        "http://127.0.0.1:8000/parse",
        formData,
        {
          headers:
            formData.getHeaders(),
          timeout: 120000,
        }
      );

    const parsedResume =
      pythonResponse.data.data;

    if (!parsedResume) {
      throw new Error(
        "Resume parsing failed"
      );
    }

    console.log(
      "Resume parsed successfully"
    );

    // -------------------------------------------------
    // 3. UPDATE DATABASE WITH NEW RESUME
    // -------------------------------------------------

    user.resume = {
      url: result.secure_url,
      publicId: result.public_id,
      uploadedAt: new Date(),
    };

    user.skills =
      parsedResume.skills || [];

    user.resumeData = {
      ...parsedResume,
      originalFileName:
        req.file.originalname,
      uploadedAt: new Date(),
    };

    await user.save();

    console.log(
      "New resume saved to database"
    );

    // -------------------------------------------------
    // 4. DELETE OLD RESUME
    // -------------------------------------------------

    if (
      oldResumePublicId &&
      oldResumePublicId !==
        newCloudinaryPublicId
    ) {
      try {
        console.log(
          "Deleting old resume:",
          oldResumePublicId
        );

        await cloudinary.uploader.destroy(
          oldResumePublicId,
          {
            resource_type: "raw",
          }
        );

        console.log(
          "Old resume deleted successfully"
        );
      } catch (cloudinaryError) {
        // Do not fail the complete upload because
        // the new resume is already working.
        console.error(
          "Old Resume Delete Error:",
          cloudinaryError
        );
      }
    }

    // -------------------------------------------------
    // 5. RESPONSE
    // -------------------------------------------------

    return res.status(200).json({
      success: true,
      message:
        oldResumePublicId
          ? "Resume replaced successfully"
          : "Resume uploaded successfully",

      data: {
        resume: user.resume,
        parsedResume: user.resumeData,
        skills: user.skills,
      },
    });
  } catch (err) {
    console.error(
      "Upload Resume Error:",
      err
    );

    // -------------------------------------------------
    // CLEANUP NEW CLOUDINARY FILE IF SOMETHING FAILED
    // -------------------------------------------------

    if (newCloudinaryPublicId) {
      try {
        await cloudinary.uploader.destroy(
          newCloudinaryPublicId,
          {
            resource_type: "raw",
          }
        );

        console.log(
          "Cleaned up failed new resume upload"
        );
      } catch (cleanupError) {
        console.error(
          "New Resume Cleanup Error:",
          cleanupError
        );
      }
    }

    return res.status(500).json({
      success: false,
      message:
        err.response?.data?.message ||
        err.message ||
        "Failed to upload resume",
    });
  }
};

// =====================================================
// DELETE RESUME
// =====================================================

const deleteResume = async (req, res) => {
  try {
    const user = await User.findById(
      req.user._id
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // -------------------------------------------------
    // CHECK WHETHER RESUME EXISTS
    // -------------------------------------------------

    if (
      !user.resume?.publicId &&
      !user.resume?.url
    ) {
      return res.status(404).json({
        success: false,
        message: "No resume found",
      });
    }

    // -------------------------------------------------
    // DELETE FROM CLOUDINARY
    // -------------------------------------------------

    if (user.resume?.publicId) {
      try {
        await cloudinary.uploader.destroy(
          user.resume.publicId,
          {
            resource_type: "raw",
          }
        );
      } catch (cloudinaryError) {
        console.error(
          "Cloudinary Resume Delete Error:",
          cloudinaryError
        );

        return res.status(500).json({
          success: false,
          message:
            "Failed to delete resume from storage",
        });
      }
    }

    // -------------------------------------------------
    // CLEAR RESUME
    // -------------------------------------------------

    user.resume = {
      url: "",
      publicId: "",
      uploadedAt: null,
    };

    // -------------------------------------------------
    // CLEAR RESUME-DERIVED DATA
    // -------------------------------------------------

    user.resumeData = null;

    user.skills = [];

    await user.save();

    return res.status(200).json({
      success: true,
      message:
        "Resume deleted successfully",
      data: {
        resume: user.resume,
        resumeData: null,
        skills: [],
      },
    });
  } catch (error) {
    console.error(
      "Delete Resume Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to delete resume",
    });
  }
};

// =====================================================
// EXPORT
// =====================================================

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  uploadResume,
  deleteResume,
};