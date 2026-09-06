import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";

import { generateInterviewQuestions } from "../api/interviewApi";

function MockInterview() {
  const navigate = useNavigate();

  const [company, setCompany] =
    useState("Amazon");

  const [role, setRole] =
    useState("Software Engineer");

  const [interviewType, setInterviewType] =
    useState("Mixed");

  const [questionCount, setQuestionCount] =
    useState(10);

  const [loading, setLoading] =
    useState(false);

  const handleStartInterview =
    async () => {
      try {
        setLoading(true);

        const res =
          await generateInterviewQuestions({
            company,
            role,
            interviewType,
            questionCount:
              Number(questionCount),
          });

        const data =
          res?.data;

        if (
          !data ||
          !Array.isArray(
            data.questions
          ) ||
          data.questions.length === 0
        ) {
          throw new Error(
            "No interview questions were generated."
          );
        }

        // Store generated interview temporarily
        sessionStorage.setItem(
          "mockInterview",
          JSON.stringify({
            sessionId:
              data.sessionId,

            company:
              data.company,

            role:
              data.role,

            interviewType:
              data.interviewType,

            totalQuestions:
              data.totalQuestions,

            questions:
              data.questions,
          })
        );

        navigate(
          `/interview/session?company=${encodeURIComponent(
            data.company
          )}`
        );
      } catch (error) {
        console.error(
          "Interview generation error:",
          error
        );

        alert(
          error?.response?.data?.message ||
            error.message ||
            "Failed to generate interview."
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="flex bg-slate-100 min-h-screen">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <div className="p-10 max-w-5xl mx-auto">

          {/* HEADER */}

          <div className="mb-10">
            <h1 className="text-4xl font-bold">
              AI Mock Interview
            </h1>

            <p className="text-gray-500 mt-2">
              Practice realistic interviews with
              AI-generated questions personalized
              for your target company and role.
            </p>
          </div>

          {/* SETUP CARD */}

          <div className="bg-white rounded-2xl shadow-md p-8">

            <h2 className="text-2xl font-bold mb-6">
              Configure Your Interview
            </h2>

            {/* COMPANY */}

            <div className="mb-6">
              <label className="block font-semibold mb-2">
                Company
              </label>

              <select
                value={company}
                onChange={(e) =>
                  setCompany(e.target.value)
                }
                className="w-full border border-gray-300 rounded-xl px-4 py-3"
              >
                <option value="Amazon">
                  Amazon
                </option>

                <option value="Microsoft">
                  Microsoft
                </option>

                <option value="Google">
                  Google
                </option>

                <option value="Infosys">
                  Infosys
                </option>

                <option value="TCS Digital">
                  TCS Digital
                </option>

                <option value="Accenture">
                  Accenture
                </option>

                <option value="Wipro">
                  Wipro
                </option>

                <option value="Other">
                  Other
                </option>
              </select>
            </div>

            {/* ROLE */}

            <div className="mb-6">
              <label className="block font-semibold mb-2">
                Target Role
              </label>

              <select
                value={role}
                onChange={(e) =>
                  setRole(e.target.value)
                }
                className="w-full border border-gray-300 rounded-xl px-4 py-3"
              >
                <option value="Software Engineer">
                  Software Engineer
                </option>

                <option value="Software Developer">
                  Software Developer
                </option>

                <option value="Full Stack Developer">
                  Full Stack Developer
                </option>

                <option value="Backend Developer">
                  Backend Developer
                </option>

                <option value="Frontend Developer">
                  Frontend Developer
                </option>

                <option value="Data Analyst">
                  Data Analyst
                </option>

                <option value="Data Scientist">
                  Data Scientist
                </option>

                <option value="Machine Learning Engineer">
                  Machine Learning Engineer
                </option>
              </select>
            </div>

            {/* INTERVIEW TYPE */}

            <div className="mb-6">
              <label className="block font-semibold mb-2">
                Interview Type
              </label>

              <select
                value={interviewType}
                onChange={(e) =>
                  setInterviewType(
                    e.target.value
                  )
                }
                className="w-full border border-gray-300 rounded-xl px-4 py-3"
              >
                <option value="Mixed">
                  Mixed — Technical + HR
                </option>

                <option value="Technical">
                  Technical
                </option>

                <option value="HR">
                  HR / Behavioral
                </option>
              </select>
            </div>

            {/* QUESTION COUNT */}

            <div className="mb-8">
              <label className="block font-semibold mb-2">
                Number of Questions
              </label>

              <select
                value={questionCount}
                onChange={(e) =>
                  setQuestionCount(
                    Number(e.target.value)
                  )
                }
                className="w-full border border-gray-300 rounded-xl px-4 py-3"
              >
                <option value={5}>
                  5 Questions
                </option>

                <option value={10}>
                  10 Questions
                </option>

                <option value={15}>
                  15 Questions
                </option>

                <option value={20}>
                  20 Questions
                </option>

                <option value={30}>
                  30 Questions
                </option>
              </select>
            </div>

            {/* INFO */}

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-8">
              <p className="font-semibold text-blue-800">
                🤖 AI-Powered Interview
              </p>

              <p className="text-blue-700 text-sm mt-2">
                Gemini will generate a fresh set of{" "}
                <strong>
                  {questionCount} questions
                </strong>{" "}
                based on your company, role,
                interview type and resume skills.
              </p>
            </div>

            {/* START */}

            <button
              onClick={
                handleStartInterview
              }
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-4 rounded-xl disabled:opacity-50"
            >
              {loading
                ? "🤖 Generating Interview..."
                : "🚀 Start AI Mock Interview"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MockInterview;