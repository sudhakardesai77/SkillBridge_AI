const RoadmapProgress = require(
  "../models/RoadmapProgress"
);


// =============================================
// GET ROADMAP PROGRESS
// =============================================

const getRoadmapProgress = async (req, res) => {
  try {
    const { company } = req.query;

    if (!company) {
      return res.status(400).json({
        success: false,
        message: "Company is required",
      });
    }

    const progress =
      await RoadmapProgress.findOne({
        user: req.user._id,
        company,
      });

    return res.status(200).json({
      success: true,
      data: {
        completedWeeks:
          progress?.completedWeeks || [],
      },
    });

  } catch (error) {

    console.error(
      "Get Roadmap Progress Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to get roadmap progress",
    });

  }
};


// =============================================
// TOGGLE WEEK COMPLETION
// =============================================

const toggleWeekCompletion = async (req, res) => {
  try {
    const { company, week } = req.body;

    if (!company || !week) {
      return res.status(400).json({
        success: false,
        message:
          "Company and week are required",
      });
    }

    let progress =
      await RoadmapProgress.findOne({
        user: req.user._id,
        company,
      });

    // Create progress if it doesn't exist

    if (!progress) {

      progress =
        await RoadmapProgress.create({
          user: req.user._id,
          company,
          completedWeeks: [],
        });

    }

    const weekNumber = Number(week);

    const alreadyCompleted =
      progress.completedWeeks.includes(
        weekNumber
      );


    // Remove completed week

    if (alreadyCompleted) {

      progress.completedWeeks =
        progress.completedWeeks.filter(
          (item) => item !== weekNumber
        );

    }

    // Add completed week

    else {

      progress.completedWeeks.push(
        weekNumber
      );

    }


    await progress.save();


    return res.status(200).json({
      success: true,

      data: {
        completedWeeks:
          progress.completedWeeks,
      },

    });

  } catch (error) {

    console.error(
      "Toggle Progress Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to update roadmap progress",
    });

  }
};


module.exports = {
  getRoadmapProgress,
  toggleWeekCompletion,
};