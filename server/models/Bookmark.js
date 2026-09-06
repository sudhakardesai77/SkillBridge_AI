const mongoose = require("mongoose");

const bookmarkSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent the same user from bookmarking the same job twice
bookmarkSchema.index(
  { user: 1, job: 1 },
  { unique: true }
);

module.exports = mongoose.model(
  "Bookmark",
  bookmarkSchema
);