const CodingProblem =
  require("../models/CodingProblem");

const User =
  require("../models/User");

const Job =
  require("../models/Job");

const Application =
  require("../models/Application");

const {
  generateCodingRecommendations,
} = require("../services/geminiService");


// =====================================================
// ADD PROBLEM
// =====================================================

const addProblem = async (req, res) => {

  try {

    const {
      title,
      platform,
      difficulty,
      link,
      jobId,
    } = req.body;


    // -----------------------------------------------
    // VALIDATION
    // -----------------------------------------------

    if (
      !title ||
      !difficulty
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Title and difficulty are required",

      });
    }


    // -----------------------------------------------
    // OPTIONAL JOB
    // -----------------------------------------------

    let selectedJob = null;


    if (jobId) {

      selectedJob =
        await Job.findById(
          jobId
        );


      if (!selectedJob) {

        return res.status(404).json({

          success: false,

          message:
            "Job not found",

        });
      }


      // Make sure the student actually
      // applied to this job.

      const application =
        await Application.findOne({

          applicant:
            req.user._id,

          job:
            jobId,

        });


      if (!application) {

        return res.status(403).json({

          success: false,

          message:
            "You have not applied for this job.",

        });
      }

    }


    // -----------------------------------------------
    // CREATE
    // -----------------------------------------------

    const problem =
      await CodingProblem.create({

        user:
          req.user._id,

        job:
          jobId || null,

        title:
          title.trim(),

        platform:
          platform || "LeetCode",

        difficulty,

        link:
          link || "",

        solved:
          false,

      });


    return res.status(201).json({

      success: true,

      message:
        "Problem added successfully",

      data:
        problem,

    });

  } catch (error) {

    console.error(
      "Add Problem Error:",
      error
    );


    return res.status(500).json({

      success: false,

      message:
        "Failed to add problem",

    });
  }
};


// =====================================================
// ADD AI RECOMMENDATION TO TRACKER
// =====================================================

const addAIProblemToTracker =
  async (req, res) => {

    try {

      const {
        title,
        platform,
        difficulty,
        link,
        jobId,
      } = req.body;


      // -----------------------------------------------
      // VALIDATION
      // -----------------------------------------------

      if (
        !title ||
        !difficulty
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Problem title and difficulty are required.",

        });
      }


      if (!jobId) {

        return res.status(400).json({

          success: false,

          message:
            "Job information is required.",

        });
      }


      // -----------------------------------------------
      // VERIFY JOB
      // -----------------------------------------------

      const job =
        await Job.findById(
          jobId
        );


      if (!job) {

        return res.status(404).json({

          success: false,

          message:
            "Job not found.",

        });
      }


      // -----------------------------------------------
      // VERIFY APPLICATION
      // -----------------------------------------------

      const application =
        await Application.findOne({

          applicant:
            req.user._id,

          job:
            jobId,

        });


      if (!application) {

        return res.status(403).json({

          success: false,

          message:
            "You have not applied for this job.",

        });
      }


      // -----------------------------------------------
      // CHECK DUPLICATE
      // -----------------------------------------------

      const existingProblem =
        await CodingProblem.findOne({

          user:
            req.user._id,

          $or: [

            {
              link:
                link || "__NO_LINK__",
            },

            {
              title:
                title.trim(),
            },

          ],

        });


      if (existingProblem) {

        return res.status(200).json({

          success: true,

          alreadyAdded:
            true,

          message:
            "This problem is already in your tracker.",

          data:
            existingProblem,

        });
      }


      // -----------------------------------------------
      // CREATE
      // -----------------------------------------------

      const problem =
        await CodingProblem.create({

          user:
            req.user._id,

          job:
            jobId,

          title:
            title.trim(),

          platform:
            platform ||
            "LeetCode",

          difficulty:
            difficulty.trim(),

          link:
            link || "",

          solved:
            false,

        });


      return res.status(201).json({

        success: true,

        alreadyAdded:
          false,

        message:
          "Problem added to your tracker.",

        data:
          problem,

      });

    } catch (error) {

      console.error(
        "Add AI Problem To Tracker Error:",
        error
      );


      return res.status(500).json({

        success: false,

        message:
          "Failed to add AI problem to tracker.",

      });
    }
  };


// =====================================================
// GET PROBLEMS
// =====================================================

const getProblems = async (
  req,
  res
) => {

  try {

    const problems =
      await CodingProblem.find({

        user:
          req.user._id,

      })

        .populate(
          "job",
          "jobTitle company location"
        )

        .sort({

          createdAt:
            -1,

        });


    return res.status(200).json({

      success: true,

      data:
        problems,

    });

  } catch (error) {

    console.error(
      "Get Problems Error:",
      error
    );


    return res.status(500).json({

      success: false,

      message:
        "Failed to get coding problems",

    });
  }
};


// =====================================================
// TOGGLE SOLVED
// =====================================================

const toggleSolved = async (
  req,
  res
) => {

  try {

    const problem =
      await CodingProblem.findOne({

        _id:
          req.params.id,

        user:
          req.user._id,

      });


    if (!problem) {

      return res.status(404).json({

        success: false,

        message:
          "Problem not found",

      });
    }


    problem.solved =
      !problem.solved;


    await problem.save();


    return res.status(200).json({

      success: true,

      message:
        "Problem status updated",

      data:
        problem,

    });

  } catch (error) {

    console.error(
      "Toggle Problem Error:",
      error
    );


    return res.status(500).json({

      success: false,

      message:
        "Failed to update problem",

    });
  }
};


// =====================================================
// DELETE PROBLEM
// =====================================================

const deleteProblem = async (
  req,
  res
) => {

  try {

    const problem =
      await CodingProblem.findOneAndDelete({

        _id:
          req.params.id,

        user:
          req.user._id,

      });


    if (!problem) {

      return res.status(404).json({

        success: false,

        message:
          "Problem not found",

      });
    }


    return res.status(200).json({

      success: true,

      message:
        "Problem deleted successfully",

    });

  } catch (error) {

    console.error(
      "Delete Problem Error:",
      error
    );


    return res.status(500).json({

      success: false,

      message:
        "Failed to delete problem",

    });
  }
};


// =====================================================
// CODING STATISTICS
// =====================================================

const getCodingStats = async (
  req,
  res
) => {

  try {

    const problems =
      await CodingProblem.find({

        user:
          req.user._id,

      });


    const total =
      problems.length;


    const solved =
      problems.filter(
        (problem) =>
          problem.solved
      ).length;


    const unsolved =
      total - solved;


    const easy =
      problems.filter(
        (problem) =>
          problem.difficulty ===
          "Easy"
      ).length;


    const medium =
      problems.filter(
        (problem) =>
          problem.difficulty ===
          "Medium"
      ).length;


    const hard =
      problems.filter(
        (problem) =>
          problem.difficulty ===
          "Hard"
      ).length;


    const solvedEasy =
      problems.filter(
        (problem) =>
          problem.difficulty ===
            "Easy" &&
          problem.solved
      ).length;


    const solvedMedium =
      problems.filter(
        (problem) =>
          problem.difficulty ===
            "Medium" &&
          problem.solved
      ).length;


    const solvedHard =
      problems.filter(
        (problem) =>
          problem.difficulty ===
            "Hard" &&
          problem.solved
      ).length;


    const progress =
      total > 0

        ? Math.round(
            (solved / total) *
              100
          )

        : 0;


    return res.status(200).json({

      success: true,

      data: {

        total,

        solved,

        unsolved,

        progress,

        easy,

        medium,

        hard,

        solvedEasy,

        solvedMedium,

        solvedHard,

      },

    });

  } catch (error) {

    console.error(
      "Coding Stats Error:",
      error
    );


    return res.status(500).json({

      success: false,

      message:
        "Failed to get coding statistics",

    });
  }
};


// =====================================================
// GET STUDENT'S APPLIED JOBS
// =====================================================

const getAppliedJobsForCoding =
  async (req, res) => {

    try {

      const applications =
        await Application.find({

          applicant:
            req.user._id,

        })

          .populate("job")

          .sort({

            createdAt:
              -1,

          });


      const appliedJobs =
        applications

          .filter(
            (application) =>
              application.job
          )

          .map(
            (application) => ({

              applicationId:
                application._id,

              status:
                application.status,

              appliedAt:
                application.createdAt,

              job:
                application.job,

            })
          );


      return res.status(200).json({

        success: true,

        data:
          appliedJobs,

      });

    } catch (error) {

      console.error(
        "Get Applied Jobs For Coding Error:",
        error
      );


      return res.status(500).json({

        success: false,

        message:
          "Failed to load applied jobs",

      });
    }
  };


// =====================================================
// AI CODING RECOMMENDATIONS
// =====================================================

const getCodingRecommendations =
  async (req, res) => {

    try {

      // -----------------------------------------------
      // USER
      // -----------------------------------------------

      const user =
        await User.findById(
          req.user._id
        ).select(
          "skills resumeData"
        );


      if (!user) {

        return res.status(404).json({

          success: false,

          message:
            "User not found",

        });
      }


      // -----------------------------------------------
      // RESUME SKILLS
      // -----------------------------------------------

      let currentSkills =
        Array.isArray(
          user.skills
        )
          ? user.skills
          : [];


      if (
        user.resumeData &&
        Array.isArray(
          user.resumeData.skills
        )
      ) {

        currentSkills =
          user.resumeData.skills;

      }


      // -----------------------------------------------
      // REQUEST DATA
      // -----------------------------------------------

      const {
        jobId,
        platform,
        difficulty,
        problemCount,
      } = req.body;


      if (!jobId) {

        return res.status(400).json({

          success: false,

          message:
            "Please select a job you have applied for.",

        });
      }


      // -----------------------------------------------
      // VERIFY APPLICATION
      // -----------------------------------------------

      const application =
        await Application.findOne({

          job:
            jobId,

          applicant:
            req.user._id,

        });


      if (!application) {

        return res.status(403).json({

          success: false,

          message:
            "You have not applied for this job.",

        });
      }


      // -----------------------------------------------
      // GET JOB
      // -----------------------------------------------

      const job =
        await Job.findById(
          jobId
        );


      if (!job) {

        return res.status(404).json({

          success: false,

          message:
            "Job not found.",

        });
      }


      // -----------------------------------------------
      // PLATFORM
      // -----------------------------------------------

      const selectedPlatform =
        String(
          platform ||
          "LeetCode"
        ).trim();


      const validPlatforms = [

        "LeetCode",

        "CodeChef",

        "Codeforces",

        "GeeksforGeeks",

        "HackerRank",

      ];


      if (
        !validPlatforms.includes(
          selectedPlatform
        )
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Invalid coding platform.",

        });
      }


      // -----------------------------------------------
      // DIFFICULTY
      // -----------------------------------------------

      const selectedDifficulty =
        String(
          difficulty ||
          "Medium"
        ).trim();


      const validDifficulties = [

        "Easy",

        "Medium",

        "Hard",

      ];


      if (
        !validDifficulties.includes(
          selectedDifficulty
        )
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Invalid difficulty.",

        });
      }


      // -----------------------------------------------
      // NUMBER OF PROBLEMS
      // -----------------------------------------------

      const count =
        Number(
          problemCount ||
          20
        );


      if (
        !Number.isInteger(count) ||
        count < 1 ||
        count > 50
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Problem count must be between 1 and 50.",

        });
      }


      // -----------------------------------------------
      // RESUME VALIDATION
      // -----------------------------------------------

      if (
        currentSkills.length === 0
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Please upload a resume with skills first.",

        });
      }


      // -----------------------------------------------
      // JOB INFORMATION
      // -----------------------------------------------

      const jobTitle =
        job.jobTitle ||
        "Software Engineer";


      const company =
        job.company ||
        "Target Company";


      const jobDescription =
        job.description ||
        "";


      const jobSkills =
        Array.isArray(
          job.skills
        )
          ? job.skills
          : [];


      // =================================================
      // EXISTING TRACKED PROBLEMS
      // =================================================

      const existingProblems =
        await CodingProblem.find({

          user:
            req.user._id,

        })

          .select(
            "title platform difficulty link"
          )

          .lean();


      // -----------------------------------------------
      // LOG
      // -----------------------------------------------

      console.log(
        "===================================="
      );

      console.log(
        "AI CODING GENERATION"
      );

      console.log(
        "User:",
        user.email
      );

      console.log(
        "Company:",
        company
      );

      console.log(
        "Job:",
        jobTitle
      );

      console.log(
        "Job Skills:",
        jobSkills
      );

      console.log(
        "Resume Skills:",
        currentSkills
      );

      console.log(
        "Platform:",
        selectedPlatform
      );

      console.log(
        "Difficulty:",
        selectedDifficulty
      );

      console.log(
        "Count:",
        count
      );

      console.log(
        "Existing Tracked Problems:",
        existingProblems.length
      );

      console.log(
        "===================================="
      );


      // -----------------------------------------------
      // GEMINI
      // -----------------------------------------------

      const recommendations =
        await generateCodingRecommendations(

          currentSkills,

          jobTitle,

          selectedPlatform,

          selectedDifficulty,

          count,

          company,

          jobDescription,

          jobSkills,

          existingProblems

        );


      // -----------------------------------------------
      // RESPONSE
      // -----------------------------------------------

      return res.status(200).json({

        success: true,

        data: {

          jobId,

          company,

          jobTitle,

          jobDescription,

          jobSkills,

          platform:
            selectedPlatform,

          difficulty:
            selectedDifficulty,

          problemCount:
            count,

          problems:
            recommendations.problems,

        },

      });

    } catch (error) {

      console.error(
        "Coding Recommendation Error:",
        error
      );


      return res.status(500).json({

        success: false,

        message:
          error.message ||
          "Failed to generate coding recommendations.",

      });
    }
  };


// =====================================================
// EXPORT
// =====================================================

module.exports = {

  addProblem,

  addAIProblemToTracker,

  getProblems,

  toggleSolved,

  deleteProblem,

  getCodingStats,

  getAppliedJobsForCoding,

  getCodingRecommendations,

};