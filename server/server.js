const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const connectDB = require("./config/db");

// =====================================================
// ROUTES
// =====================================================

const authRoutes = require("./routes/authRoutes");
const codingRoutes = require("./routes/codingRoutes");
const atsRoutes = require("./routes/atsRoutes");
const eligibilityRoutes = require("./routes/eligibilityRoutes");
const skillGapRoutes = require("./routes/skillGapRoutes");
const roadmapRoutes = require("./routes/roadmapRoutes");
const interviewRoutes = require("./routes/interviewRoutes");
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const adminRoutes = require("./routes/adminRoutes");
const companyRoutes = require("./routes/companyRoutes");
const roadmapProgressRoutes = require(
  "./routes/roadmapProgressRoutes"
);

// =====================================================
// DATABASE
// =====================================================

connectDB();

// =====================================================
// EXPRESS APP
// =====================================================

const app = express();

// =====================================================
// MIDDLEWARE
// =====================================================

app.use(cors());

app.use(
  express.json({
    limit: "10mb",
  })
);

app.use(morgan("dev"));

// =====================================================
// API ROUTES
// =====================================================

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/coding",
  codingRoutes
);

app.use(
  "/api/ats",
  atsRoutes
);

app.use(
  "/api/eligibility",
  eligibilityRoutes
);

app.use(
  "/api/skill-gap",
  skillGapRoutes
);

app.use(
  "/api/roadmap",
  roadmapRoutes
);

app.use(
  "/api/interview",
  interviewRoutes
);

app.use(
  "/api/jobs",
  jobRoutes
);

app.use(
  "/api/applications",
  applicationRoutes
);

app.use(
  "/api/admin",
  adminRoutes
);
app.use(
  "/api/roadmap-progress",
  roadmapProgressRoutes
);

// =====================================================
// COMPANY ROUTES
// =====================================================

app.use(
  "/api/companies",
  companyRoutes
);


// =====================================================
// TEST ROUTE
// =====================================================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message:
      "🚀 Welcome to SkillBridge AI Backend",
  });
});

// =====================================================
// 404
// =====================================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found.",
  });
});

// =====================================================
// ERROR HANDLER
// =====================================================

app.use(
  (error, req, res, next) => {
    console.error(
      "Server Error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message:
        "Internal server error.",
    });
  }
);

// =====================================================
// START SERVER
// =====================================================

const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `🚀 Server running on http://localhost:${PORT}`
  );
});