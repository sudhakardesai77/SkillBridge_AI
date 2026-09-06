import {
  useEffect,
  useState,
} from "react";

import {
  useSearchParams,
} from "react-router-dom";

import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";

import {
  generateRoadmap,
  getRoadmapProgress,
  toggleWeekCompletion,
} from "../api/roadmapApi";


function Roadmap() {

  const [searchParams] =
    useSearchParams();


  // ==========================================
  // COMPANY
  // ==========================================

  const urlCompany =
    searchParams.get("company");

  const savedCompany =
    localStorage.getItem(
      "selectedCompany"
    );

  const company =
    urlCompany || savedCompany;


  // ==========================================
  // STATES
  // ==========================================

  const [result, setResult] =
    useState(null);

  const [progress, setProgress] =
    useState({
      company: "",
      completedWeeks: [],
      totalWeeks: 0,
      progressPercentage: 0,
      lastUpdated: null,
    });

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [
    updatingWeek,
    setUpdatingWeek,
  ] = useState(null);


  // ==========================================
  // LOAD ROADMAP
  // ==========================================

  useEffect(() => {

    const loadRoadmap = async () => {

      try {

        setLoading(true);
        setError("");


        // ======================================
        // VALIDATE COMPANY
        // ======================================

        if (!company) {

          setError(
            "Company not selected. Please select a company from Skill Gap first."
          );

          return;
        }


        // Save company

        localStorage.setItem(
          "selectedCompany",
          company
        );


        // ======================================
        // GET MISSING SKILLS
        // ======================================

        let storedSkills = [];

        try {

          storedSkills = JSON.parse(
            localStorage.getItem(
              "missingSkills"
            ) || "[]"
          );

        } catch (error) {

          console.error(
            "Missing skills parse error:",
            error
          );

          storedSkills = [];
        }


        if (
          !Array.isArray(storedSkills) ||
          storedSkills.length === 0
        ) {

          setError(
            "No missing skills found. Please check Skill Gap first."
          );

          return;
        }


        // ======================================
        // CHECK SAVED ROADMAP
        // ======================================

        const savedRoadmap =
          localStorage.getItem(
            "roadmapData"
          );

        const savedRoadmapCompany =
          localStorage.getItem(
            "roadmapCompany"
          );


        let roadmapData = null;


        // ======================================
        // USE SAVED ROADMAP
        // ======================================

        if (
          savedRoadmap &&
          savedRoadmapCompany === company
        ) {

          try {

            roadmapData =
              JSON.parse(savedRoadmap);

            console.log(
              "Using saved roadmap"
            );

          } catch (parseError) {

            console.error(
              "Saved roadmap parse error:",
              parseError
            );

            localStorage.removeItem(
              "roadmapData"
            );

            localStorage.removeItem(
              "roadmapCompany"
            );
          }
        }


        // ======================================
        // GENERATE NEW ROADMAP
        // ======================================

        if (!roadmapData) {

          console.log(
            "Generating new AI roadmap..."
          );


          const response =
            await generateRoadmap(
              company,
              storedSkills
            );


          console.log(
            "Roadmap Response:",
            response
          );


          if (!response.success) {

            setError(
              response.message ||
              "Unable to generate roadmap."
            );

            return;
          }


          roadmapData =
            response.data;


          // Save roadmap locally

          localStorage.setItem(
            "roadmapData",
            JSON.stringify(
              roadmapData
            )
          );


          localStorage.setItem(
            "roadmapCompany",
            company
          );
        }


        // ======================================
        // SET ROADMAP
        // ======================================

        setResult(roadmapData);


        // ======================================
        // LOAD PROGRESS
        // ======================================

        const progressResponse =
          await getRoadmapProgress();


        if (progressResponse.success) {

          const progressData =
            progressResponse.data;


          // Make sure progress belongs
          // to current company

          if (
            progressData.company === company
          ) {

            setProgress(progressData);

          } else {

            setProgress({
              company: company,
              completedWeeks: [],
              totalWeeks:
                roadmapData.roadmap?.length || 0,
              progressPercentage: 0,
              lastUpdated: null,
            });

          }
        }

      } catch (err) {

        console.error(
          "Roadmap Error:",
          err
        );


        if (err.response) {

          console.error(
            "Server Response:",
            err.response.data
          );
        }


        setError(
          err.response?.data?.message ||
          "Failed to generate roadmap."
        );

      } finally {

        setLoading(false);

      }
    };


    loadRoadmap();

  }, [company]);


  // ==========================================
  // TOGGLE WEEK COMPLETION
  // ==========================================

  const handleToggleWeek =
    async (weekNumber) => {

      try {

        setUpdatingWeek(
          weekNumber
        );


        const response =
          await toggleWeekCompletion(
            weekNumber
          );


        if (response.success) {

          setProgress(
            response.data
          );

        } else {

          alert(
            response.message ||
            "Failed to update progress."
          );

        }

      } catch (err) {

        console.error(
          "Progress Update Error:",
          err
        );


        alert(
          err.response?.data?.message ||
          "Failed to update progress."
        );

      } finally {

        setUpdatingWeek(null);

      }
    };


  // ==========================================
  // CHECK WEEK COMPLETED
  // ==========================================

  const isWeekCompleted =
    (weekNumber) => {

      return (
        progress.completedWeeks || []
      ).includes(weekNumber);

    };


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (

      <div className="flex min-h-screen bg-slate-100">

        <Sidebar />

        <div className="flex-1 min-w-0">

          <Navbar />

          <div className="flex justify-center items-center min-h-[80vh]">

            <div className="text-center">

              <h1 className="text-3xl font-bold text-blue-600">

                🤖 Preparing Your AI Roadmap...

              </h1>

              <p className="text-gray-500 mt-3">

                Please wait a moment.

              </p>

            </div>

          </div>

        </div>

      </div>

    );
  }


  // ==========================================
  // ERROR
  // ==========================================

  if (error) {

    return (

      <div className="flex min-h-screen bg-slate-100">

        <Sidebar />

        <div className="flex-1 min-w-0">

          <Navbar />

          <div className="p-6 md:p-10">

            <div className="bg-white rounded-2xl shadow p-8 text-center">

              <h1 className="text-3xl font-bold text-red-600">

                ❌ Roadmap Error

              </h1>

              <p className="mt-4 text-gray-600">

                {error}

              </p>

            </div>

          </div>

        </div>

      </div>

    );
  }


  // ==========================================
  // NO RESULT
  // ==========================================

  if (!result) {
    return null;
  }


  // ==========================================
  // CALCULATE VALUES
  // ==========================================

  const totalWeeks =
    result.roadmap?.length || 0;

  const completedWeeks =
    progress.completedWeeks?.length || 0;

  const progressPercentage =
    progress.progressPercentage || 0;


  // ==========================================
  // ROADMAP PAGE
  // ==========================================

  return (

    <div className="flex min-h-screen bg-slate-100">

      <Sidebar />


      <div className="flex-1 min-w-0 overflow-x-hidden">

        <Navbar />


        <main className="p-4 md:p-8 max-w-6xl mx-auto">


          {/* ================================= */}
          {/* HEADER */}
          {/* ================================= */}

          <div className="mb-8">

            <h1 className="text-3xl md:text-4xl font-bold">

              🚀 {result.company || company}
              {" "}Learning Roadmap

            </h1>


            <p className="text-gray-500 mt-2">

              Learn everything step by step and
              track your progress.

            </p>


            {result.estimatedWeeks && (

              <div className="mt-4 inline-block bg-blue-100 text-blue-700 px-5 py-3 rounded-xl font-semibold">

                📅 Estimated Completion:{" "}

                {result.estimatedWeeks} weeks

              </div>

            )}

          </div>


          {/* ================================= */}
          {/* PROGRESS */}
          {/* ================================= */}

          <div className="bg-white rounded-2xl shadow-md p-6 mb-8">

            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">

              <div>

                <h2 className="text-2xl font-bold">

                  📊 Your Progress

                </h2>


                <p className="text-gray-500 mt-1">

                  {completedWeeks} of{" "}

                  {progress.totalWeeks ||
                    totalWeeks}{" "}

                  weeks completed

                </p>

              </div>


              <div className="text-3xl font-bold text-blue-600">

                {progressPercentage}%

              </div>

            </div>


            {/* PROGRESS BAR */}

            <div className="w-full bg-gray-200 rounded-full h-5 overflow-hidden">

              <div
                className="bg-blue-600 h-5 rounded-full transition-all duration-500"
                style={{
                  width: `${progressPercentage}%`,
                }}
              />

            </div>


            {/* COMPLETION MESSAGE */}

            {progressPercentage === 100 && (

              <div className="mt-5 bg-green-100 text-green-700 p-4 rounded-xl font-semibold">

                🎉 Congratulations! You completed
                your entire learning roadmap!

              </div>

            )}

          </div>


          {/* ================================= */}
          {/* ROADMAP WEEKS */}
          {/* ================================= */}

          <div className="space-y-6">

            {result.roadmap &&
            result.roadmap.length > 0 ? (

              result.roadmap.map(
                (week, index) => {

                  const weekNumber =
                    week.week || index + 1;

                  const completed =
                    isWeekCompleted(
                      weekNumber
                    );


                  return (

                    <div
                      key={weekNumber}
                      className={`bg-white rounded-2xl shadow-md p-6 transition-all duration-300 ${
                        completed
                          ? "border-2 border-green-500"
                          : ""
                      }`}
                    >


                      {/* WEEK HEADER */}

                      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">

                        <div>

                          <div className="flex flex-wrap items-center gap-3">

                            <h2 className="text-2xl font-bold">

                              Week {weekNumber}

                            </h2>


                            {completed && (

                              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold text-sm">

                                ✅ Completed

                              </span>

                            )}

                          </div>


                          {week.focus && (

                            <p className="text-blue-600 font-semibold mt-2">

                              🎯 {week.focus}

                            </p>

                          )}

                        </div>


                        {/* COMPLETE BUTTON */}

                        <button
                          onClick={() =>
                            handleToggleWeek(
                              weekNumber
                            )
                          }

                          disabled={
                            updatingWeek ===
                            weekNumber
                          }

                          className={`px-5 py-3 rounded-xl font-semibold transition disabled:opacity-50 ${
                            completed
                              ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                              : "bg-green-600 text-white hover:bg-green-700"
                          }`}
                        >

                          {updatingWeek ===
                          weekNumber
                            ? "Updating..."
                            : completed
                            ? "↩ Mark Incomplete"
                            : "✓ Mark Complete"}

                        </button>

                      </div>


                      {/* ================================= */}
                      {/* TOPICS */}
                      {/* ================================= */}

                      <div className="mt-6">

                        <h3 className="text-lg font-bold mb-3">

                          📚 Topics to Learn

                        </h3>


                        <div className="flex flex-wrap gap-3">

                          {week.topics &&
                          week.topics.length > 0 ? (

                            week.topics.map(
                              (
                                topic,
                                topicIndex
                              ) => (

                                <span
                                  key={topicIndex}
                                  className="bg-slate-100 px-4 py-2 rounded-lg text-gray-700"
                                >

                                  {topic}

                                </span>

                              )
                            )

                          ) : (

                            <p className="text-gray-500">

                              No topics available.

                            </p>

                          )}

                        </div>

                      </div>


                      {/* ================================= */}
                      {/* RESOURCES */}
                      {/* ================================= */}

                      <div className="mt-6">

                        <h3 className="text-lg font-bold mb-3">

                          🔗 Learning Resources

                        </h3>


                        {week.resources &&
                        week.resources.length > 0 ? (

                          <div className="space-y-3">

                            {week.resources.map(
                              (
                                resource,
                                resourceIndex
                              ) => (

                                <div
                                  key={resourceIndex}
                                  className="bg-blue-50 border border-blue-100 p-4 rounded-xl"
                                >

                                  {typeof resource ===
                                  "object" ? (

                                    <>

                                      <h4 className="font-bold text-lg">

                                        {resource.title ||
                                          "Learning Resource"}

                                      </h4>


                                      {resource.description && (

                                        <p className="text-sm text-gray-600 mt-1">

                                          {
                                            resource.description
                                          }

                                        </p>

                                      )}


                                      {resource.url && (

                                        <a
                                          href={resource.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="inline-block mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                                        >

                                          Start Learning →

                                        </a>

                                      )}

                                    </>

                                  ) : (

                                    <p className="font-medium">

                                      📖 {resource}

                                    </p>

                                  )}

                                </div>

                              )
                            )}

                          </div>

                        ) : (

                          <p className="text-gray-500">

                            No resources available.

                          </p>

                        )}

                      </div>

                    </div>

                  );

                }
              )

            ) : (

              <div className="bg-white rounded-2xl shadow-md p-8 text-center">

                <h2 className="text-2xl font-bold">

                  No Roadmap Available

                </h2>


                <p className="text-gray-500 mt-2">

                  No roadmap data was returned
                  from the server.

                </p>

              </div>

            )}

          </div>

        </main>

      </div>

    </div>

  );
}


export default Roadmap;