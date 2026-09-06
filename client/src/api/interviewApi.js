import API from "./axios";

// ==================================================
// GENERATE INTERVIEW QUESTIONS
// ==================================================

export const generateInterviewQuestions =
  async ({
    company,
    role,
    interviewType,
    questionCount,
  }) => {
    const token =
      localStorage.getItem("token");

    const res = await API.post(
      "/interview/generate",
      {
        company,
        role,
        interviewType,
        questionCount,
      },
      {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    );

    return res.data;
  };

// ==================================================
// EVALUATE INTERVIEW ANSWER
// ==================================================

export const evaluateInterview =
  async ({
    sessionId,
    company,
    role,
    interviewType,
    questionNumber,
    totalQuestions,
    topic,
    question,
    answer,
  }) => {
    const token =
      localStorage.getItem("token");

    const res = await API.post(
      "/interview/evaluate",
      {
        sessionId,
        company,
        role,
        interviewType,
        questionNumber,
        totalQuestions,
        topic,
        question,
        answer,
      },
      {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    );

    return res.data;
  };

// ==================================================
// SAVE INTERVIEW
// ==================================================

export const saveInterview =
  async (data) => {
    const token =
      localStorage.getItem("token");

    const res = await API.post(
      "/interview/save",
      data,
      {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    );

    return res.data;
  };