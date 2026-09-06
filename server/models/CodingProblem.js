const mongoose = require("mongoose");

const codingProblemSchema = new mongoose.Schema(
  {
    // ==================================================
    // USER
    // ==================================================

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },


    // ==================================================
    // JOB
    // ==================================================

    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      default: null,
    },


    // ==================================================
    // TITLE
    // ==================================================

    title: {
      type: String,
      required: true,
      trim: true,
    },


    // ==================================================
    // PLATFORM
    // ==================================================

    platform: {
      type: String,
      enum: [
        "LeetCode",
        "CodeChef",
        "Codeforces",
        "GeeksforGeeks",
        "HackerRank",
        "Other",
      ],
      default: "LeetCode",
    },


    // ==================================================
    // DIFFICULTY
    // ==================================================

    difficulty: {
      type: String,
      enum: [
        "Easy",
        "Medium",
        "Hard",
      ],
      required: true,
    },


    // ==================================================
    // LINK
    // ==================================================

    link: {
      type: String,
      trim: true,
    },


    // ==================================================
    // SOLVED
    // ==================================================

    solved: {
      type: Boolean,
      default: false,
    },
  },

  {
    timestamps: true,
  }
);


module.exports =
  mongoose.model(
    "CodingProblem",
    codingProblemSchema
  );