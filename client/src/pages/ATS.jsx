import { useEffect, useState } from "react";

import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import Card from "../components/ui/Card";

import { analyzeResume } from "../api/atsApi";

import {
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

function ATS() {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const fetchATS = async () => {
      try {
        const data = await analyzeResume();
        console.log("ATS Response:", data);
        setResult(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchATS();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <div className="p-8">
          <h1 className="text-3xl font-bold mb-2">
            ATS Resume Analysis
          </h1>

          <p className="text-gray-500 mb-8">
            AI analysis of your uploaded resume.
          </p>

          {loading ? (
            <LoadingSpinner />
          ) : (
            <>
              {/* ATS Score */}

              <Card>
                <h2 className="text-xl font-semibold text-center">
                  ATS Score
                </h2>

                <div className="flex justify-center mt-8">
                  <div className="w-44 h-44 rounded-full border-[12px] border-blue-600 flex items-center justify-center">

                    <h1 className="text-5xl font-bold text-blue-600">
                      {result?.ats_score ?? 0}%
                    </h1>

                  </div>
                </div>
              </Card>

              {/* Strengths */}

              <Card className="mt-8">
                <h2 className="text-2xl font-bold text-green-600 mb-6">
                  ✅ Strengths
                </h2>

                {result?.strengths?.length > 0 ? (
                  result.strengths.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 mb-3"
                    >
                      <FaCheckCircle className="text-green-600" />

                      <span>{item}</span>
                    </div>
                  ))
                ) : (
                  <p>No strengths found.</p>
                )}
              </Card>

              {/* Missing Keywords */}

              <Card className="mt-8">
                <h2 className="text-2xl font-bold text-red-600 mb-6">
                  ❌ Missing Keywords
                </h2>

                {result?.missing?.length > 0 ? (
                  result.missing.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 mb-3"
                    >
                      <FaTimesCircle className="text-red-600" />

                      <span>{item}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-green-600 font-semibold">
                    🎉 No missing keywords found.
                  </p>
                )}
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ATS;