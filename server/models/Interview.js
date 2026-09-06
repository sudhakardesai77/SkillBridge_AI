const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Unique ID for one complete mock interview session
    sessionId: {
      type: String,
      default: "",
      index: true,
    },

    company: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      default: "Software Engineer",
    },

    interviewType: {
      type: String,
      default: "Mixed",
    },

    questionNumber: {
      type: Number,
      default: 1,
    },

    totalQuestions: {
      type: Number,
      default: 1,
    },

    topic: {
      type: String,
      default: "",
    },

    question: {
      type: String,
      required: true,
    },

    answer: {
      type: String,
      required: true,
    },

    score: {
      type: Number,
      default: 0,
      min: 0,
      max: 10,
    },

    feedback: {
      type: [String],
      default: [],
    },

    improvedAnswer: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Interview", interviewSchema);