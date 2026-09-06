const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    icon: {
      type: String,
      default: "building",
    },

    location: {
      type: String,
      default: "India",
    },

    package: {
      type: String,
      default: "Varies by role",
    },

    minCGPA: {
      type: Number,
      default: 0,
    },

    skills: {
      type: [String],
      default: [],
    },

    rounds: {
      type: [String],
      default: [],
    },

    resources: {
      type: [String],
      default: [],
    },

    roles: {
      type: [String],
      default: [],
    },

    description: {
      type: String,
      default: "",
    },

    website: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Company", companySchema);