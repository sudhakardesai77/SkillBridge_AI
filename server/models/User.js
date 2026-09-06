const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // =====================================================
    // ACCOUNT INFORMATION
    // =====================================================

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["student", "recruiter", "admin"],
      default: "student",
    },

    // =====================================================
    // USER PROFILE INFORMATION
    // =====================================================

    college: {
      type: String,
      default: "",
    },

    branch: {
      type: String,
      default: "",
    },

    cgpa: {
      type: Number,
      default: 0,
    },

    skills: {
      type: [String],
      default: [],
    },

    linkedin: {
      type: String,
      default: "",
    },

    github: {
      type: String,
      default: "",
    },

    leetcode: {
      type: String,
      default: "",
    },

    // =====================================================
    // UPLOADED RESUME
    // =====================================================

    resume: {
      url: {
        type: String,
        default: "",
      },

      publicId: {
        type: String,
        default: "",
      },

      uploadedAt: {
        type: Date,
        default: null,
      },
    },

    // =====================================================
    // PARSED RESUME DATA
    // =====================================================

    resumeData: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },

    // =====================================================
    // ROADMAP PROGRESS
    // =====================================================

    roadmapProgress: {
      company: {
        type: String,
        default: "",
      },

      completedWeeks: {
        type: [Number],
        default: [],
      },

      totalWeeks: {
        type: Number,
        default: 0,
      },

      progressPercentage: {
        type: Number,
        default: 0,
      },

      lastUpdated: {
        type: Date,
        default: null,
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);