import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";

import QuestionCard from "../components/interview/QuestionCard";
import AnswerBox from "../components/interview/AnswerBox";
import ProgressBar from "../components/interview/ProgressBar";
import Timer from "../components/interview/Timer";
import FeedbackCard from "../components/interview/FeedbackCard";

import {
  evaluateInterview,
} from "../api/interviewApi";

function InterviewSession() {
  const navigate =
    useNavigate();

  const [interview, setInterview] =
    useState(null);

  const [currentQuestion, setCurrentQuestion] =
    useState(0);

  const [answer, setAnswer] =
    useState("");

  const [score, setScore] =
    useState(null);

  const [strengths, setStrengths] =
    useState([]);

  const [weaknesses, setWeaknesses] =
    useState([]);

  const [improvedAnswer, setImprovedAnswer] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [completed, setCompleted] =
    useState(false);

  // ==================================================
  // LOAD GENERATED INTERVIEW
  // ==================================================

  useEffect(() => {
    try {
      const stored =
        sessionStorage.getItem(
          "mockInterview"
        );

      if (!stored) {
        alert(
          "No active interview found. Please start a new interview."
        );

        navigate("/mock-interview");
        return;
      }

      const parsed =
        JSON.parse(stored);

      if (
        !parsed.questions ||
        !Array.isArray(
          parsed.questions
        ) ||
        parsed.questions.length === 0
      ) {
        throw new Error(
          "Invalid interview data."
        );
      }

      setInterview(parsed);
    } catch (error) {
      console.error(error);

      sessionStorage.removeItem(
        "mockInterview"
      );

      alert(
        "Unable to load interview."
      );

      navigate("/mock-interview");
    }
  }, [navigate]);

  // ==================================================
  // RESET EVALUATION
  // ==================================================

  const resetEvaluation = () => {
    setScore(null);
    setStrengths([]);
    setWeaknesses([]);
    setImprovedAnswer("");
  };

  // ==================================================
  // EVALUATE ANSWER
  // ==================================================

  const handleEvaluate =
    async () => {
      if (!answer.trim()) {
        alert(
          "Please write an answer first."
        );
        return;
      }

      if (!interview) {
        return;
      }

      try {
        setLoading(true);

        const question =
          interview.questions[
            currentQuestion
          ];

        const res =
          await evaluateInterview({
            sessionId:
              interview.sessionId,

            company:
              interview.company,

            role:
              interview.role,

            interviewType:
              interview.interviewType,

            questionNumber:
              currentQuestion + 1,

            totalQuestions:
              interview.totalQuestions,

            topic:
              question.topic,

            question:
              question.question,

            answer,
          });

        const evaluation =
          res?.data?.evaluation;

        if (!evaluation) {
          throw new Error(
            "No AI evaluation received."
          );
        }

        setScore(
          evaluation.score
        );

        setStrengths(
          Array.isArray(
            evaluation.strengths
          )
            ? evaluation.strengths
            : []
        );

        setWeaknesses(
          Array.isArray(
            evaluation.weaknesses
          )
            ? evaluation.weaknesses
            : []
        );

        setImprovedAnswer(
          evaluation.improvedAnswer ||
            ""
        );
      } catch (error) {
        console.error(
          "Evaluation error:",
          error
        );

        alert(
          error?.response?.data?.message ||
            "Failed to evaluate answer."
        );
      } finally {
        setLoading(false);
      }
    };

  // ==================================================
  // NEXT QUESTION
  // ==================================================

  const nextQuestion =
    () => {
      if (!interview) {
        return;
      }

      if (
        currentQuestion <
        interview.questions.length - 1
      ) {
        setCurrentQuestion(
          currentQuestion + 1
        );

        setAnswer("");

        resetEvaluation();

        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      } else {
        setCompleted(true);

        sessionStorage.removeItem(
          "mockInterview"
        );
      }
    };

  // ==================================================
  // PREVIOUS QUESTION
  // ==================================================

  const previousQuestion =
    () => {
      if (
        currentQuestion > 0
      ) {
        setCurrentQuestion(
          currentQuestion - 1
        );

        setAnswer("");

        resetEvaluation();

        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }
    };

  // ==================================================
  // LOADING
  // ==================================================

  if (!interview) {
    return (
      <div className="flex bg-slate-100 min-h-screen">
        <Sidebar />

        <div className="flex-1">
          <Navbar />

          <div className="flex justify-center items-center min-h-[70vh]">
            <div className="text-center">
              <div className="text-5xl mb-4">
                🤖
              </div>

              <h2 className="text-2xl font-bold">
                Preparing your interview...
              </h2>

              <p className="text-gray-500 mt-2">
                Loading AI-generated questions
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==================================================
  // COMPLETED
  // ==================================================

  if (completed) {
    return (
      <div className="flex bg-slate-100 min-h-screen">
        <Sidebar />

        <div className="flex-1">
          <Navbar />

          <div className="p-10 max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-md p-10 text-center">

              <div className="text-6xl mb-5">
                🎉
              </div>

              <h1 className="text-4xl font-bold">
                Interview Completed!
              </h1>

              <p className="text-gray-500 mt-3">
                You completed your{" "}
                <strong>
                  {interview.company}
                </strong>{" "}
                {interview.role} mock interview.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">

                <div className="bg-blue-50 rounded-xl p-5">
                  <p className="text-gray-500">
                    Company
                  </p>

                  <p className="font-bold text-lg">
                    {interview.company}
                  </p>
                </div>

                <div className="bg-purple-50 rounded-xl p-5">
                  <p className="text-gray-500">
                    Interview Type
                  </p>

                  <p className="font-bold text-lg">
                    {interview.interviewType}
                  </p>
                </div>

                <div className="bg-green-50 rounded-xl p-5">
                  <p className="text-gray-500">
                    Questions
                  </p>

                  <p className="font-bold text-lg">
                    {interview.totalQuestions}
                  </p>
                </div>

              </div>

              <div className="flex justify-center gap-4 mt-10">

                <button
                  onClick={() =>
                    navigate(
                      "/mock-interview"
                    )
                  }
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl"
                >
                  Start Another Interview
                </button>

                <button
                  onClick={() =>
                    navigate(
                      "/interview-history"
                    )
                  }
                  className="bg-gray-200 hover:bg-gray-300 px-6 py-3 rounded-xl"
                >
                  View Interview History
                </button>

              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==================================================
  // CURRENT QUESTION
  // ==================================================

  const current =
    interview.questions[
      currentQuestion
    ];

  return (
    <div className="flex bg-slate-100 min-h-screen">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <div className="p-10 max-w-5xl mx-auto">

          {/* HEADER */}

          <div className="flex justify-between items-center mb-8">

            <div>
              <h1 className="text-3xl font-bold">
                {interview.company} Mock Interview
              </h1>

              <p className="text-gray-500 mt-1">
                {interview.role} •{" "}
                {interview.interviewType}
              </p>
            </div>

            <Timer />
          </div>

          {/* PROGRESS */}

          <ProgressBar
            current={
              currentQuestion
            }
            total={
              interview.questions.length
            }
          />

          {/* QUESTION NUMBER */}

          <div className="flex justify-between items-center mt-6 mb-4">

            <span className="text-sm font-semibold text-gray-500">
              Question{" "}
              {currentQuestion + 1}{" "}
              of{" "}
              {interview.questions.length}
            </span>

            {current.topic && (
              <span className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm">
                {current.topic}
              </span>
            )}

          </div>

          {/* QUESTION */}

          <QuestionCard
            question={
              current.question
            }
          />

          {/* ANSWER */}

          <AnswerBox
            answer={answer}
            setAnswer={setAnswer}
          />

          {/* EVALUATE */}

          <button
            onClick={
              handleEvaluate
            }
            disabled={loading}
            className="mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl disabled:opacity-50"
          >
            {loading
              ? "🤖 Evaluating..."
              : "🤖 Evaluate with AI"}
          </button>

          {/* FEEDBACK */}

          {score !== null && (
            <FeedbackCard
              score={score}
              strengths={strengths}
              weaknesses={weaknesses}
              improvedAnswer={
                improvedAnswer
              }
            />
          )}

          {/* NAVIGATION */}

          <div className="flex justify-between mt-8">

            <button
              onClick={
                previousQuestion
              }
              disabled={
                currentQuestion === 0
              }
              className="bg-gray-500 text-white px-6 py-3 rounded-lg disabled:opacity-50"
            >
              ← Previous
            </button>

            <button
              onClick={
                nextQuestion
              }
              disabled={
                score === null
              }
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg disabled:opacity-50"
            >
              {currentQuestion ===
              interview.questions.length - 1
                ? "Finish Interview"
                : "Next Question →"}
            </button>

          </div>

          {/* NOTE */}

          {score === null && (
            <p className="text-center text-sm text-gray-400 mt-4">
              Submit your answer for AI evaluation
              before moving to the next question.
            </p>
          )}

        </div>
      </div>
    </div>
  );
}

export default InterviewSession;