const mongoose = require("mongoose");
require("dotenv").config();

const Job = require("./models/Job");

const jobs = [
  {
    company: "Amazon",
    jobTitle: "Software Development Engineer",
    location: "Bangalore, India",
    jobType: "Full-time",
    description:
      "Build scalable software systems and solve complex engineering problems.",
    skills: [
      "Java",
      "DSA",
      "DBMS",
      "Operating Systems",
      "Computer Networks",
    ],
    applyLink: "https://www.amazon.jobs/",
  },

  {
    company: "Microsoft",
    jobTitle: "Software Engineer Intern",
    location: "Hyderabad, India",
    jobType: "Internship",
    description:
      "Work with engineering teams to develop and improve software products.",
    skills: [
      "Java",
      "Python",
      "DSA",
      "Problem Solving",
    ],
    applyLink: "https://careers.microsoft.com/",
  },

  {
    company: "Infosys",
    jobTitle: "Systems Engineer",
    location: "Pune, India",
    jobType: "Full-time",
    description:
      "Develop software solutions and work with enterprise technologies.",
    skills: [
      "Java",
      "SQL",
      "DBMS",
      "Python",
    ],
    applyLink: "https://www.infosys.com/careers/",
  },

  {
    company: "TCS",
    jobTitle: "Graduate Engineer Trainee",
    location: "Chennai, India",
    jobType: "Full-time",
    description:
      "Join a technology team and work on software development projects.",
    skills: [
      "Java",
      "Python",
      "SQL",
      "DBMS",
      "DSA",
    ],
    applyLink: "https://www.tcs.com/careers",
  },

  {
    company: "Google",
    jobTitle: "Software Engineering Intern",
    location: "Bangalore, India",
    jobType: "Internship",
    description:
      "Work on challenging technical projects with experienced engineers.",
    skills: [
      "C++",
      "Java",
      "DSA",
      "Algorithms",
      "Problem Solving",
    ],
    applyLink: "https://www.google.com/about/careers/",
  },
];

const seedJobs = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected");

    await Job.deleteMany({});

    await Job.insertMany(jobs);

    console.log("✅ Sample jobs added successfully");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seed Error:", error);
    process.exit(1);
  }
};

seedJobs();