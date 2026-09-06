import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";
import CompanySelector from "../components/common/CompanySelector";

import { getSkillGap } from "../api/skillGapApi";

function SkillGap() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const company = searchParams.get("company");

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =====================================================
  // LOAD SKILL GAP
  // =====================================================

  useEffect(() => {
    if (!company) return;

    const loadSkillGap = async () => {
      setLoading(true);
      setError("");
      setResult(null);

      try {
        console.log("Selected Company:", company);

        // =================================================
        // GET RESUME DATA
        // =================================================

        let resumeData = {};

        try {
          resumeData = JSON.parse(
            localStorage.getItem("parsedResume") || "{}"
          );
        } catch (error) {
          console.error("Resume parsing error:", error);
        }

        // =================================================
        // GET SKILLS
        // =================================================

        let skills = [];

        if (Array.isArray(resumeData?.skills)) {
          skills = resumeData.skills;
        }

        // If no resume skills, try profile skills
        if (skills.length === 0) {
          try {
            const userData = JSON.parse(
              localStorage.getItem("user") || "{}"
            );

            if (Array.isArray(userData?.skills)) {
              skills = userData.skills;
            }
          } catch (error) {
            console.error(
              "User data parsing error:",
              error
            );
          }
        }

        console.log(
          "Skills sent to Skill Gap:",
          skills
        );

        // =================================================
        // CALL API
        // =================================================

        const response = await getSkillGap(
          company,
          skills
        );

        console.log(
          "FULL SKILL GAP RESPONSE:",
          response
        );

        // =================================================
        // HANDLE BOTH RESPONSE FORMATS
        // =================================================

        let skillGapData = null;

        // Format 1:
        // {
        //   success: true,
        //   data: {...}
        // }

        if (
          response &&
          response.success === true &&
          response.data
        ) {
          skillGapData = response.data;
        }

        // Format 2:
        // {
        //   company: "...",
        //   skillMatch: 50,
        //   matchedSkills: [],
        //   missingSkills: []
        // }

        else if (
          response &&
          response.company
        ) {
          skillGapData = response;
        }

        // =================================================
        // VALIDATE RESULT
        // =================================================

        if (!skillGapData) {
          console.error(
            "Invalid Skill Gap Response:",
            response
          );

          setError(
            "Unable to load Skill Gap. Invalid server response."
          );

          return;
        }

        // =================================================
        // SAVE RESULT
        // =================================================

        setResult(skillGapData);

        // Save company
        localStorage.setItem(
          "selectedCompany",
          skillGapData.company || company
        );

        // Save missing skills
        localStorage.setItem(
          "missingSkills",
          JSON.stringify(
            skillGapData.missingSkills || []
          )
        );

        console.log(
          "Skill Gap Loaded Successfully:",
          skillGapData
        );

      } catch (err) {

        console.error(
          "SKILL GAP ERROR:",
          err
        );

        console.error(
          "SERVER RESPONSE:",
          err.response?.data
        );

        const message =
          err.response?.data?.message ||
          err.response?.data?.detail ||
          err.message ||
          "Server Error";

        setError(message);

      } finally {
        setLoading(false);
      }
    };

    loadSkillGap();

  }, [company]);


  // =====================================================
  // COMPANY SELECTOR PAGE
  // =====================================================

  if (!company) {
    return (
      <div className="flex min-h-screen bg-slate-100">

        <Sidebar />

        <div className="flex-1 min-w-0">

          <Navbar />

          <main className="p-6 md:p-8 max-w-7xl mx-auto">

            <div className="mb-8">

              <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                Select a Company
              </h1>

              <p className="text-gray-500 mt-2">
                Select a company to analyze your skill gap.
              </p>

            </div>

            <CompanySelector
              onSelect={(selectedCompany) => {

                localStorage.setItem(
                  "selectedCompany",
                  selectedCompany
                );

                navigate(
                  `/skill-gap?company=${encodeURIComponent(
                    selectedCompany
                  )}`
                );

              }}
            />

          </main>

        </div>

      </div>
    );
  }


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="flex min-h-screen bg-slate-100">

        <Sidebar />

        <div className="flex-1 min-w-0">

          <Navbar />

          <main className="flex flex-col justify-center items-center min-h-[80vh]">

            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mb-5"></div>

            <h1 className="text-2xl font-bold text-blue-600">
              Loading Skill Gap...
            </h1>

          </main>

        </div>

      </div>
    );
  }


  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <div className="flex min-h-screen bg-slate-100">

        <Sidebar />

        <div className="flex-1 min-w-0">

          <Navbar />

          <main className="flex justify-center items-center min-h-[80vh] px-6">

            <div className="bg-white shadow-lg rounded-2xl p-8 text-center max-w-lg">

              <h1 className="text-2xl font-bold text-red-600 mb-4">
                ⚠️ Skill Gap Error
              </h1>

              <p className="text-gray-600 mb-6">
                {error}
              </p>

              <button
                onClick={() => navigate("/skill-gap")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition"
              >
                ← Select Another Company
              </button>

            </div>

          </main>

        </div>

      </div>
    );
  }


  // =====================================================
  // NO RESULT
  // =====================================================

  if (!result) {
    return null;
  }


  // =====================================================
  // OPEN ROADMAP
  // =====================================================

  const openRoadmap = () => {

    const selectedCompany =
      result.company || company;

    const missingSkills =
      result.missingSkills || [];

    localStorage.setItem(
      "selectedCompany",
      selectedCompany
    );

    localStorage.setItem(
      "missingSkills",
      JSON.stringify(missingSkills)
    );

    console.log(
      "Roadmap Company:",
      selectedCompany
    );

    console.log(
      "Roadmap Missing Skills:",
      missingSkills
    );

    navigate(
      `/roadmap?company=${encodeURIComponent(
        selectedCompany
      )}`
    );
  };


  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="flex min-h-screen bg-slate-100">

      <Sidebar />

      <div className="flex-1 min-w-0">

        <Navbar />

        <main className="p-6 md:p-8 pb-12 max-w-7xl mx-auto">


          {/* HEADER */}

          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">

            <div>

              <button
                onClick={() => navigate("/skill-gap")}
                className="text-blue-600 hover:text-blue-800 font-semibold mb-4"
              >
                ← Change Company
              </button>

              <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                {result.company} Skill Gap
              </h1>

              <p className="text-gray-500 mt-2 text-lg">
                Skill Match:{" "}

                <span className="font-bold text-blue-600">
                  {result.skillMatch || 0}%
                </span>
              </p>

            </div>


            <button
              onClick={openRoadmap}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-md transition"
            >
              🗺️ View Roadmap
            </button>

          </div>


          {/* MATCHED SKILLS */}

          <div className="bg-white rounded-2xl shadow-md p-6 mt-8">

            <h2 className="text-2xl font-bold text-green-600 mb-5">
              ✅ Matched Skills
            </h2>

            {result.matchedSkills?.length > 0 ? (

              <div className="flex flex-wrap gap-3">

                {result.matchedSkills.map((skill) => (

                  <span
                    key={skill}
                    className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-semibold"
                  >
                    {skill}
                  </span>

                ))}

              </div>

            ) : (

              <p className="text-gray-500">
                No matched skills found.
              </p>

            )}

          </div>


          {/* MISSING SKILLS */}

          <div className="bg-white rounded-2xl shadow-md p-6 mt-8">

            <h2 className="text-2xl font-bold text-red-600 mb-5">
              ❌ Missing Skills
            </h2>

            {result.missingSkills?.length > 0 ? (

              <div className="flex flex-wrap gap-3">

                {result.missingSkills.map((skill) => (

                  <span
                    key={skill}
                    className="bg-red-100 text-red-700 px-4 py-2 rounded-full font-semibold"
                  >
                    {skill}
                  </span>

                ))}

              </div>

            ) : (

              <p className="text-green-600 font-semibold">
                🎉 No missing skills! You are ready for this company.
              </p>

            )}

          </div>


          {/* RECOMMENDATIONS */}

          <div className="bg-white rounded-2xl shadow-md p-6 mt-8">

            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              📚 Recommendations
            </h2>

            {result.recommendations?.length > 0 ? (

              <div className="space-y-4">

                {result.recommendations.map(
                  (item, index) => (

                    <div
                      key={index}
                      className="border-l-4 border-blue-600 bg-gray-50 p-5 rounded-lg"
                    >

                      <h3 className="font-bold text-lg text-gray-800">
                        {item.skill}
                      </h3>

                      <p className="text-gray-600 mt-1">
                        {item.reason}
                      </p>

                      <span className="inline-block mt-3 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                        {item.priority} Priority
                      </span>

                    </div>

                  )
                )}

              </div>

            ) : (

              <p className="text-gray-500">
                No recommendations available.
              </p>

            )}

          </div>


          {/* ROADMAP BUTTON */}

          {result.missingSkills?.length > 0 && (

            <div className="flex justify-center mt-10">

              <button
                onClick={openRoadmap}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg transition"
              >
                🚀 Start My Learning Roadmap
              </button>

            </div>

          )}

        </main>

      </div>

    </div>
  );
}

export default SkillGap;