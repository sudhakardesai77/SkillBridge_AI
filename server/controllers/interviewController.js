const crypto = require("crypto");

const Interview = require("../models/Interview");
const User = require("../models/User");

const {
  evaluateAnswer,
  generateInterviewQuestions,
} = require("../services/geminiService");

// ==================================================
// GENERATE INTERVIEW QUESTIONS
// ==================================================

const generateQuestions = async (req, res) => {
  try {
    const {
      company,
      role,
      interviewType,
      questionCount,
    } = req.body;

    if (!company) {
      return res.status(400).json({
        success: false,
        message: "Company is required",
      });
    }

    const count = Number(questionCount);

    if (
      Number.isNaN(count) ||
      count < 5 ||
      count > 30
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Question count must be between 5 and 30",
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const currentSkills =
      Array.isArray(user.skills)
        ? user.skills
        : Array.isArray(user.profile?.skills)
        ? user.profile.skills
        : [];

    const result =
      await generateInterviewQuestions({
        company,
        role:
          role ||
          "Software Engineer",
        interviewType:
          interviewType ||
          "Mixed",
        questionCount: count,
        currentSkills,
      });

    const sessionId =
      crypto.randomUUID();

    return res.status(200).json({
      success: true,
      message:
        "Interview questions generated successfully",
      data: {
        sessionId,
        company,
        role:
          role ||
          "Software Engineer",
        interviewType:
          interviewType ||
          "Mixed",
        totalQuestions:
          result.questions.length,
        questions:
          result.questions,
      },
    });
  } catch (error) {
    console.error(
      "Generate interview questions error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to generate interview questions",
    });
  }
};

// ==================================================
// EVALUATE WITH GEMINI
// ==================================================

const evaluateInterview = async (req, res) => {
  try {
    const {
      sessionId,
      company,
      role,
      interviewType,
      questionNumber,
      totalQuestions,
      topic,
      question,
      answer,
    } = req.body;

    if (!company || !question || !answer) {
      return res.status(400).json({
        success: false,
        message:
          "Company, question and answer are required",
      });
    }

    const aiResult =
      await evaluateAnswer(
        question,
        answer
      );

    const interview =
      await Interview.create({
        user: req.user._id,

        sessionId:
          sessionId || "",

        company,

        role:
          role ||
          "Software Engineer",

        interviewType:
          interviewType ||
          "Mixed",

        questionNumber:
          Number(questionNumber) || 1,

        totalQuestions:
          Number(totalQuestions) || 1,

        topic:
          topic || "",

        question,

        answer,

        score:
          aiResult.score,

        feedback: [
          ...(Array.isArray(
            aiResult.strengths
          )
            ? aiResult.strengths
            : []),

          ...(Array.isArray(
            aiResult.weaknesses
          )
            ? aiResult.weaknesses
            : []),
        ],

        improvedAnswer:
          aiResult.improvedAnswer || "",
      });

    return res.status(200).json({
      success: true,
      message:
        "Interview answer evaluated successfully",

      data: {
        interview,
        evaluation: aiResult,
      },
    });
  } catch (error) {
    console.error(
      "Gemini evaluation error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to evaluate interview",
    });
  }
};

// ==================================================
// SAVE INTERVIEW MANUALLY
// ==================================================

const saveInterview = async (req, res) => {
  try {
    const {
      sessionId,
      company,
      role,
      interviewType,
      questionNumber,
      totalQuestions,
      topic,
      question,
      answer,
      score,
      feedback,
      improvedAnswer,
    } = req.body;

    if (!company || !question || !answer) {
      return res.status(400).json({
        success: false,
        message:
          "Company, question and answer are required",
      });
    }

    const interview =
      await Interview.create({
        user: req.user._id,

        sessionId:
          sessionId || "",

        company,

        role:
          role ||
          "Software Engineer",

        interviewType:
          interviewType ||
          "Mixed",

        questionNumber:
          Number(questionNumber) || 1,

        totalQuestions:
          Number(totalQuestions) || 1,

        topic:
          topic || "",

        question,

        answer,

        score:
          Number(score) || 0,

        feedback:
          Array.isArray(feedback)
            ? feedback
            : [],

        improvedAnswer:
          improvedAnswer || "",
      });

    return res.status(201).json({
      success: true,
      message:
        "Interview saved successfully",
      data: interview,
    });
  } catch (error) {
    console.error(
      "Save interview error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Internal Server Error",
    });
  }
};

// ==================================================
// GET HISTORY
// ==================================================

const getInterviewHistory = async (
  req,
  res
) => {
  try {
    const history =
      await Interview.find({
        user: req.user._id,
      }).sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      data: history,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message:
        "Internal Server Error",
    });
  }
};

// ==================================================
// GET STATS
// ==================================================

const getInterviewStats = async (
  req,
  res
) => {
  try {
    const interviews =
      await Interview.find({
        user: req.user._id,
      });

    if (interviews.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          totalInterviews: 0,
          averageScore: 0,
        },
      });
    }

    const totalScore =
      interviews.reduce(
        (sum, item) =>
          sum + Number(item.score || 0),
        0
      );

    const averageScore =
      Number(
        (
          totalScore /
          interviews.length
        ).toFixed(1)
      );

    return res.status(200).json({
      success: true,
      data: {
        totalInterviews:
          interviews.length,
        averageScore,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message:
        "Internal Server Error",
    });
  }
};

// ==================================================
// EXPORT
// ==================================================

module.exports = {
  generateQuestions,
  evaluateInterview,
  saveInterview,
  getInterviewHistory,
  getInterviewStats,
};