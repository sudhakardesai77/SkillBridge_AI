import {
  useEffect,
  useState,
} from "react";

import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";

import {
  getCodingProblems,
  toggleCodingProblem,
  deleteCodingProblem,
  getCodingStats,
  getAppliedJobsForCoding,
  getCodingRecommendations,
  addAIProblemToTracker,
} from "../api/codingApi";


function CodingTracker() {

  // =====================================================
  // TRACKED PROBLEMS
  // =====================================================

  const [
    problems,
    setProblems,
  ] = useState([]);


  const [
    stats,
    setStats,
  ] = useState(null);


  // =====================================================
  // APPLIED JOBS
  // =====================================================

  const [
    appliedJobs,
    setAppliedJobs,
  ] = useState([]);


  const [
    selectedJobId,
    setSelectedJobId,
  ] = useState("");


  // =====================================================
  // AI RESULTS
  // =====================================================

  const [
    aiProblems,
    setAiProblems,
  ] = useState([]);


  const [
    generatedJob,
    setGeneratedJob,
  ] = useState(null);


  const [
    aiLoading,
    setAiLoading,
  ] = useState(false);


  const [
    aiError,
    setAiError,
  ] = useState("");


  // =====================================================
  // AI OPTIONS
  // =====================================================

  const [
    platform,
    setPlatform,
  ] = useState("LeetCode");


  const [
    difficulty,
    setDifficulty,
  ] = useState("Medium");


  const [
    problemCount,
    setProblemCount,
  ] = useState(20);


  // =====================================================
  // ADDED AI PROBLEMS
  // =====================================================

  const [
    addedProblems,
    setAddedProblems,
  ] = useState({});


  const [
    addingProblem,
    setAddingProblem,
  ] = useState("");


  // =====================================================
  // PAGE
  // =====================================================

  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    error,
    setError,
  ] = useState("");


  // =====================================================
  // LOAD DATA
  // =====================================================

  const loadData =
    async () => {

      try {

        setLoading(true);

        setError("");


        const [
          problemsResponse,
          statsResponse,
          jobsResponse,
        ] = await Promise.all([

          getCodingProblems(),

          getCodingStats(),

          getAppliedJobsForCoding(),

        ]);


        setProblems(
          problemsResponse.data ||
          []
        );


        setStats(
          statsResponse.data ||
          null
        );


        setAppliedJobs(
          jobsResponse.data ||
          []
        );


      } catch (err) {

        console.error(
          "Coding Tracker Error:",
          err
        );


        setError(
          "Failed to load coding tracker."
        );

      } finally {

        setLoading(false);

      }
    };


  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {

    loadData();

  }, []);


  // =====================================================
  // SELECTED JOB
  // =====================================================

  const selectedApplication =
    appliedJobs.find(
      (application) =>
        String(
          application.job?._id
        ) ===
        String(
          selectedJobId
        )
    );


  const selectedJob =
    selectedApplication?.job ||
    null;


  // =====================================================
  // JOB-SPECIFIC PROBLEMS
  // =====================================================

  const jobProblems =
    selectedJobId

      ? problems.filter(
          (problem) =>
            problem.job &&
            String(
              problem.job._id ||
              problem.job
            ) ===
            String(
              selectedJobId
            )
        )

      : [];


  // =====================================================
  // JOB-SPECIFIC STATISTICS
  // =====================================================

  const jobTotal =
    jobProblems.length;


  const jobSolved =
    jobProblems.filter(
      (problem) =>
        problem.solved
    ).length;


  const jobRemaining =
    jobTotal -
    jobSolved;


  const jobProgress =
    jobTotal > 0

      ? Math.round(
          (jobSolved /
            jobTotal) *
            100
        )

      : 0;


  const jobEasy =
    jobProblems.filter(
      (problem) =>
        problem.difficulty ===
        "Easy"
    ).length;


  const jobMedium =
    jobProblems.filter(
      (problem) =>
        problem.difficulty ===
        "Medium"
    ).length;


  const jobHard =
    jobProblems.filter(
      (problem) =>
        problem.difficulty ===
        "Hard"
    ).length;


  const jobSolvedEasy =
    jobProblems.filter(
      (problem) =>
        problem.difficulty ===
          "Easy" &&
        problem.solved
    ).length;


  const jobSolvedMedium =
    jobProblems.filter(
      (problem) =>
        problem.difficulty ===
          "Medium" &&
        problem.solved
    ).length;


  const jobSolvedHard =
    jobProblems.filter(
      (problem) =>
        problem.difficulty ===
          "Hard" &&
        problem.solved
    ).length;


  // =====================================================
  // GENERATE
  // =====================================================

  const handleGenerate =
    async () => {

      try {

        setAiError("");


        if (!selectedJobId) {

          setAiError(
            "Please select a job you have applied for."
          );

          return;

        }


        setAiLoading(true);

        setAiProblems([]);

        setGeneratedJob(null);


        const response =
          await getCodingRecommendations({

            jobId:
              selectedJobId,

            platform,

            difficulty,

            problemCount:
              Number(
                problemCount
              ),

          });


        const generated =
          response?.data?.problems ||
          [];


        if (
          generated.length === 0
        ) {

          throw new Error(
            "No coding problems were generated."
          );

        }


        setAiProblems(
          generated
        );


        setGeneratedJob(
          response.data
        );


        setAddedProblems({});


        setTimeout(() => {

          document
            .getElementById(
              "ai-results"
            )
            ?.scrollIntoView({

              behavior:
                "smooth",

            });

        }, 100);


      } catch (err) {

        console.error(
          "AI Generation Error:",
          err
        );


        setAiError(

          err?.response?.data
            ?.message ||

          err?.message ||

          "Failed to generate coding problems."

        );

      } finally {

        setAiLoading(false);

      }
    };


  // =====================================================
  // ADD AI PROBLEM
  // =====================================================

  const handleAddAIProblem =
    async (
      problem,
      index
    ) => {

      const problemKey =
        problem.link ||
        `${problem.title}-${index}`;


      try {

        setAddingProblem(
          problemKey
        );


        const response =
          await addAIProblemToTracker(

            problem,

            selectedJobId

          );


        setAddedProblems(
          (previous) => ({

            ...previous,

            [problemKey]:
              true,

          })
        );


        await loadData();


        console.log(
          response?.message ||
          "Problem added to tracker."
        );


      } catch (err) {

        console.error(
          "Add AI Problem Error:",
          err
        );


        alert(

          err?.response?.data
            ?.message ||

          "Failed to add problem to tracker."

        );


      } finally {

        setAddingProblem("");

      }

    };


  // =====================================================
  // TOGGLE
  // =====================================================

  const handleToggle =
    async (id) => {

      try {

        await toggleCodingProblem(
          id
        );

        await loadData();

      } catch (err) {

        console.error(
          "Toggle Error:",
          err
        );

      }

    };


  // =====================================================
  // DELETE
  // =====================================================

  const handleDelete =
    async (id) => {

      const confirmed =
        window.confirm(
          "Are you sure you want to delete this problem?"
        );


      if (!confirmed) {

        return;

      }


      try {

        await deleteCodingProblem(
          id
        );

        await loadData();

      } catch (err) {

        console.error(
          "Delete Error:",
          err
        );

      }

    };


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (

      <div className="flex justify-center items-center min-h-screen bg-slate-100">

        <h1 className="text-3xl font-bold text-blue-600">

          Loading Coding Tracker...

        </h1>

      </div>

    );

  }


  // =====================================================
  // PAGE
  // =====================================================

  return (

    <div className="flex min-h-screen bg-slate-100">

      <Sidebar />


      <div className="flex-1">

        <Navbar />


        <div className="p-8">


          {/* =================================================
              HEADER
          ================================================= */}

          <div className="mb-8">

            <h1 className="text-4xl font-bold">

              Coding Tracker

            </h1>


            <p className="text-gray-500 mt-2">

              Prepare for the jobs you have actually
              applied for using personalized AI coding practice.

            </p>

          </div>


          {/* =================================================
              ERROR
          ================================================= */}

          {error && (

            <div className="bg-red-100 text-red-700 p-4 rounded-xl mb-6">

              {error}

            </div>

          )}


          {/* =================================================
              OVERALL STATISTICS
          ================================================= */}

          {stats && (

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-5 mb-8">


              <div className="bg-white rounded-2xl shadow p-6">

                <p className="text-gray-500">

                  Total Problems

                </p>

                <h2 className="text-3xl font-bold mt-2">

                  {stats.total}

                </h2>

              </div>


              <div className="bg-white rounded-2xl shadow p-6">

                <p className="text-gray-500">

                  Solved

                </p>

                <h2 className="text-3xl font-bold text-green-600 mt-2">

                  {stats.solved}

                </h2>

              </div>


              <div className="bg-white rounded-2xl shadow p-6">

                <p className="text-gray-500">

                  Unsolved

                </p>

                <h2 className="text-3xl font-bold text-red-600 mt-2">

                  {stats.unsolved}

                </h2>

              </div>


              <div className="bg-white rounded-2xl shadow p-6">

                <p className="text-gray-500">

                  Easy

                </p>

                <h2 className="text-3xl font-bold text-green-600 mt-2">

                  {stats.easy}

                </h2>

              </div>


              <div className="bg-white rounded-2xl shadow p-6">

                <p className="text-gray-500">

                  Medium / Hard

                </p>

                <h2 className="text-3xl font-bold text-orange-500 mt-2">

                  {stats.medium +
                    stats.hard}

                </h2>

              </div>

            </div>

          )}


          {/* =================================================
              OVERALL PROGRESS
          ================================================= */}

          {stats && (

            <div className="bg-white rounded-2xl shadow p-6 mb-8">

              <div className="flex justify-between items-center">

                <h2 className="text-2xl font-bold">

                  Overall Coding Progress

                </h2>


                <span className="text-xl font-bold text-blue-600">

                  {stats.progress}%

                </span>

              </div>


              <div className="w-full h-4 bg-gray-200 rounded-full mt-5 overflow-hidden">

                <div
                  className="h-4 bg-blue-600 rounded-full transition-all duration-700"
                  style={{
                    width:
                      `${stats.progress}%`,
                  }}
                />

              </div>

            </div>

          )}


          {/* =================================================
              JOB-SPECIFIC PROGRESS
          ================================================= */}

          {selectedJobId && selectedJob && (

            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">

              <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-5">

                <div>

                  <p className="text-blue-600 font-semibold">

                    🎯 Selected Job

                  </p>


                  <h2 className="text-3xl font-bold mt-1">

                    {selectedJob.jobTitle}

                  </h2>


                  <p className="text-gray-500 mt-1">

                    {selectedJob.company}

                  </p>

                </div>


                <div className="text-center">

                  <p className="text-gray-500">

                    Job Preparation

                  </p>


                  <p className="text-4xl font-bold text-blue-600">

                    {jobProgress}%

                  </p>

                </div>

              </div>


              {/* PROGRESS BAR */}

              <div className="mt-6">

                <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">

                  <div
                    className="h-4 bg-blue-600 rounded-full transition-all duration-700"
                    style={{
                      width:
                        `${jobProgress}%`,
                    }}
                  />

                </div>

              </div>


              {/* JOB CARDS */}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">


                <div className="bg-blue-50 rounded-xl p-5">

                  <p className="text-gray-500">

                    Problems Added

                  </p>


                  <p className="text-3xl font-bold mt-1">

                    {jobTotal}

                  </p>

                </div>


                <div className="bg-green-50 rounded-xl p-5">

                  <p className="text-gray-500">

                    Solved

                  </p>


                  <p className="text-3xl font-bold text-green-600 mt-1">

                    {jobSolved}

                  </p>

                </div>


                <div className="bg-orange-50 rounded-xl p-5">

                  <p className="text-gray-500">

                    Remaining

                  </p>


                  <p className="text-3xl font-bold text-orange-600 mt-1">

                    {jobRemaining}

                  </p>

                </div>

              </div>


              {/* DIFFICULTY BREAKDOWN */}

              {jobTotal > 0 ? (

                <div className="mt-6">

                  <h3 className="font-bold text-lg mb-4">

                    Difficulty Progress

                  </h3>


                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">


                    <div className="border rounded-xl p-4">

                      <div className="flex justify-between">

                        <span className="font-semibold text-green-600">

                          Easy

                        </span>

                        <span>

                          {jobSolvedEasy}
                          /
                          {jobEasy}

                        </span>

                      </div>


                      <div className="w-full h-2 bg-gray-200 rounded-full mt-3">

                        <div
                          className="h-2 bg-green-500 rounded-full"
                          style={{
                            width:
                              `${jobEasy > 0 ? (jobSolvedEasy / jobEasy) * 100 : 0}%`,
                          }}
                        />

                      </div>

                    </div>


                    <div className="border rounded-xl p-4">

                      <div className="flex justify-between">

                        <span className="font-semibold text-yellow-600">

                          Medium

                        </span>

                        <span>

                          {jobSolvedMedium}
                          /
                          {jobMedium}

                        </span>

                      </div>


                      <div className="w-full h-2 bg-gray-200 rounded-full mt-3">

                        <div
                          className="h-2 bg-yellow-500 rounded-full"
                          style={{
                            width:
                              `${jobMedium > 0 ? (jobSolvedMedium / jobMedium) * 100 : 0}%`,
                          }}
                        />

                      </div>

                    </div>


                    <div className="border rounded-xl p-4">

                      <div className="flex justify-between">

                        <span className="font-semibold text-red-600">

                          Hard

                        </span>

                        <span>

                          {jobSolvedHard}
                          /
                          {jobHard}

                        </span>

                      </div>


                      <div className="w-full h-2 bg-gray-200 rounded-full mt-3">

                        <div
                          className="h-2 bg-red-500 rounded-full"
                          style={{
                            width:
                              `${jobHard > 0 ? (jobSolvedHard / jobHard) * 100 : 0}%`,
                          }}
                        />

                      </div>

                    </div>

                  </div>

                </div>

              ) : (

                <div className="mt-6 bg-slate-50 rounded-xl p-5 text-center">

                  <p className="text-gray-500">

                    No problems have been added for this job yet.

                  </p>


                  <p className="text-gray-400 text-sm mt-1">

                    Generate AI problems below and add them to start tracking your preparation.

                  </p>

                </div>

              )}

            </div>

          )}


          {/* =================================================
              AI GENERATOR
          ================================================= */}

          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">


            <div className="mb-7">

              <h2 className="text-3xl font-bold">

                🤖 Job-Specific AI Coding Practice

              </h2>


              <p className="text-gray-500 mt-2">

                Select a job you have applied for.
                AI will use the job requirements and
                your resume skills to create personalized
                coding practice.

              </p>


              <p className="text-blue-600 text-sm mt-2 font-semibold">

                💡 Problems already added to your tracker
                will automatically be excluded from new recommendations.

              </p>

            </div>


            {/* =================================================
                APPLIED JOB
            ================================================= */}

            <div className="mb-6">

              <label className="block font-semibold mb-2">

                Select Applied Job

              </label>


              {appliedJobs.length === 0 ? (

                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5">

                  <h3 className="font-bold text-yellow-800">

                    No Applied Jobs Found

                  </h3>


                  <p className="text-yellow-700 mt-1">

                    Apply for a job first. Your applied
                    jobs will appear here.

                  </p>

                </div>

              ) : (

                <select
                  value={
                    selectedJobId
                  }
                  onChange={(e) => {

                    setSelectedJobId(
                      e.target.value
                    );

                    setAiProblems([]);

                    setGeneratedJob(null);

                    setAiError("");

                  }}
                  className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                >

                  <option value="">

                    -- Select a job you applied for --

                  </option>


                  {appliedJobs.map(
                    (application) => {

                      const job =
                        application.job;


                      return (

                        <option
                          key={
                            application.applicationId
                          }
                          value={
                            job._id
                          }
                        >

                          {job.company}
                          {" — "}
                          {job.jobTitle}

                        </option>

                      );

                    }
                  )}

                </select>

              )}

            </div>


            {/* =================================================
                SELECTED JOB PREVIEW
            ================================================= */}

            {selectedJob && (

              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 mb-6">

                <h3 className="text-xl font-bold">

                  {selectedJob.jobTitle}

                </h3>


                <p className="text-blue-600 font-semibold mt-1">

                  {selectedJob.company}

                </p>


                {selectedJob.location && (

                  <p className="text-gray-500 mt-1">

                    📍 {selectedJob.location}

                  </p>

                )}


                {selectedJob.description && (

                  <div className="mt-4">

                    <p className="font-semibold">

                      Job Description

                    </p>


                    <p className="text-gray-600 mt-1 leading-relaxed">

                      {selectedJob.description}

                    </p>

                  </div>

                )}


                {selectedJob.skills?.length > 0 && (

                  <div className="mt-4">

                    <p className="font-semibold mb-2">

                      Required Skills

                    </p>


                    <div className="flex flex-wrap gap-2">

                      {selectedJob.skills.map(
                        (
                          skill,
                          index
                        ) => (

                          <span
                            key={
                              `${skill}-${index}`
                            }
                            className="bg-white border border-blue-200 text-blue-700 px-3 py-1 rounded-full text-sm"
                          >

                            {skill}

                          </span>

                        )
                      )}

                    </div>

                  </div>

                )}

              </div>

            )}


            {/* =================================================
                SETTINGS
            ================================================= */}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">


              {/* PLATFORM */}

              <div>

                <label className="block font-semibold mb-2">

                  Coding Platform

                </label>


                <select
                  value={
                    platform
                  }
                  onChange={(e) =>
                    setPlatform(
                      e.target.value
                    )
                  }
                  className="w-full border rounded-xl px-4 py-3"
                >

                  <option>
                    LeetCode
                  </option>

                  <option>
                    CodeChef
                  </option>

                  <option>
                    Codeforces
                  </option>

                  <option>
                    GeeksforGeeks
                  </option>

                  <option>
                    HackerRank
                  </option>

                </select>

              </div>


              {/* DIFFICULTY */}

              <div>

                <label className="block font-semibold mb-2">

                  Difficulty

                </label>


                <select
                  value={
                    difficulty
                  }
                  onChange={(e) =>
                    setDifficulty(
                      e.target.value
                    )
                  }
                  className="w-full border rounded-xl px-4 py-3"
                >

                  <option>
                    Easy
                  </option>

                  <option>
                    Medium
                  </option>

                  <option>
                    Hard
                  </option>

                </select>

              </div>


              {/* NUMBER */}

              <div>

                <label className="block font-semibold mb-2">

                  Number of Problems

                </label>


                <select
                  value={
                    problemCount
                  }
                  onChange={(e) =>
                    setProblemCount(
                      Number(
                        e.target.value
                      )
                    )
                  }
                  className="w-full border rounded-xl px-4 py-3"
                >

                  <option value="5">
                    5 Problems
                  </option>

                  <option value="10">
                    10 Problems
                  </option>

                  <option value="20">
                    20 Problems
                  </option>

                  <option value="30">
                    30 Problems
                  </option>

                  <option value="40">
                    40 Problems
                  </option>

                  <option value="50">
                    50 Problems
                  </option>

                </select>

              </div>

            </div>


            {/* =================================================
                GENERATE BUTTON
            ================================================= */}

            <button
              onClick={
                handleGenerate
              }
              disabled={
                aiLoading ||
                appliedJobs.length === 0
              }
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white py-4 rounded-xl font-bold text-lg transition"
            >

              {aiLoading

                ? "🤖 AI is analyzing the job and generating problems..."

                : "✨ Generate Job-Specific Coding Problems"

              }

            </button>


            {/* =================================================
                AI ERROR
            ================================================= */}

            {aiError && (

              <div className="mt-5 bg-red-100 text-red-700 p-4 rounded-xl">

                {aiError}

              </div>

            )}

          </div>


          {/* =================================================
              AI RESULTS
          ================================================= */}

          <div
            id="ai-results"
            className="mb-8"
          >

            {aiProblems.length > 0 && (

              <div className="bg-white rounded-2xl shadow-lg p-8">


                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-5 mb-8">

                  <div>

                    <h2 className="text-3xl font-bold">

                      🎯 Personalized Coding Problems

                    </h2>


                    {generatedJob && (

                      <p className="text-gray-500 mt-2">

                        Prepared for{" "}

                        <span className="font-semibold text-gray-800">

                          {generatedJob.jobTitle}

                        </span>

                        {" "}at{" "}

                        <span className="font-semibold text-blue-600">

                          {generatedJob.company}

                        </span>

                      </p>

                    )}

                  </div>


                  <div className="flex flex-wrap gap-2">

                    <span className="bg-blue-100 text-blue-700 px-3 py-2 rounded-lg font-semibold">

                      {platform}

                    </span>


                    <span className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg font-semibold">

                      {difficulty}

                    </span>


                    <span className="bg-purple-100 text-purple-700 px-3 py-2 rounded-lg font-semibold">

                      {aiProblems.length} Problems

                    </span>

                  </div>

                </div>


                <div className="space-y-5">

                  {aiProblems.map(
                    (
                      problem,
                      index
                    ) => {

                      const problemKey =
                        problem.link ||
                        `${problem.title}-${index}`;


                      const isAdded =
                        addedProblems[
                          problemKey
                        ];


                      const isAdding =
                        addingProblem ===
                        problemKey;


                      return (

                        <div
                          key={
                            `${problem.title}-${index}`
                          }
                          className="border rounded-2xl p-6 hover:shadow-md transition"
                        >

                          <div className="flex flex-col lg:flex-row lg:justify-between gap-5">

                            <div className="flex-1">

                              <div className="flex flex-wrap items-center gap-3">

                                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-bold">

                                  #
                                  {index + 1}

                                </span>


                                <h3 className="text-xl font-bold">

                                  {problem.title}

                                </h3>


                                <span
                                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                    problem.difficulty ===
                                    "Easy"

                                      ? "bg-green-100 text-green-700"

                                      : problem.difficulty ===
                                        "Medium"

                                      ? "bg-yellow-100 text-yellow-700"

                                      : "bg-red-100 text-red-700"
                                  }`}
                                >

                                  {problem.difficulty}

                                </span>

                              </div>


                              <p className="text-blue-600 font-semibold mt-4">

                                Topic:{" "}

                                {problem.topic}

                              </p>


                              <p className="text-gray-500 mt-1">

                                Platform:{" "}

                                {problem.platform}

                              </p>


                              <div className="mt-5">

                                <p className="font-semibold">

                                  Problem

                                </p>


                                <p className="text-gray-600 mt-2 leading-relaxed">

                                  {problem.description}

                                </p>

                              </div>


                              <div className="mt-5 bg-slate-50 rounded-xl p-4">

                                <p className="font-semibold">

                                  💡 Why AI selected this

                                </p>


                                <p className="text-gray-600 mt-2">

                                  {problem.reason}

                                </p>

                              </div>

                            </div>


                            <div className="flex flex-col gap-3 lg:min-w-[190px]">

                              {problem.link && (

                                <a
                                  href={
                                    problem.link
                                  }
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-block text-center bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold whitespace-nowrap"
                                >

                                  Solve Problem ↗

                                </a>

                              )}


                              <button
                                onClick={() =>
                                  handleAddAIProblem(
                                    problem,
                                    index
                                  )
                                }
                                disabled={
                                  isAdded ||
                                  isAdding
                                }
                                className={`px-5 py-3 rounded-xl font-semibold whitespace-nowrap transition ${
                                  isAdded

                                    ? "bg-green-100 text-green-700 cursor-default"

                                    : "bg-purple-600 hover:bg-purple-700 text-white"

                                }`}
                              >

                                {isAdding

                                  ? "Adding..."

                                  : isAdded

                                  ? "✓ Added to Tracker"

                                  : "+ Add to My Tracker"

                                }

                              </button>

                            </div>

                          </div>

                        </div>

                      );

                    }
                  )}

                </div>

              </div>

            )}

          </div>


          {/* =================================================
              TRACKED PROBLEMS
          ================================================= */}

          {problems.length > 0 && (

            <div className="bg-white rounded-2xl shadow p-6">

              <div className="flex justify-between items-center mb-6">

                <div>

                  <h2 className="text-2xl font-bold">

                    My Tracked Problems

                  </h2>


                  {selectedJob && (

                    <p className="text-sm text-gray-500 mt-1">

                      Showing all tracked problems.
                      Problems with a 🎯 icon belong to the selected job.

                    </p>

                  )}

                </div>


                <span className="text-gray-500">

                  {problems.length} problems

                </span>

              </div>


              <div className="space-y-4">

                {problems.map(
                  (problem) => {

                    const belongsToSelectedJob =
                      selectedJobId &&
                      problem.job &&
                      String(
                        problem.job._id ||
                        problem.job
                      ) ===
                      String(
                        selectedJobId
                      );


                    return (

                      <div
                        key={
                          problem._id
                        }
                        className={`border rounded-xl p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 ${
                          belongsToSelectedJob
                            ? "border-blue-300 bg-blue-50/40"
                            : ""
                        }`}
                      >

                        <div>

                          <div className="flex flex-wrap items-center gap-3">

                            {belongsToSelectedJob && (

                              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-bold">

                                🎯 Selected Job

                              </span>

                            )}


                            <h3
                              className={`text-lg font-bold ${
                                problem.solved
                                  ? "line-through text-gray-400"
                                  : ""
                              }`}
                            >

                              {problem.title}

                            </h3>


                            <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">

                              {problem.difficulty}

                            </span>

                          </div>


                          <p className="text-gray-500 mt-2">

                            {problem.platform}

                          </p>


                          {problem.job && (

                            <p className="text-blue-600 text-sm mt-1 font-medium">

                              🎯{" "}

                              {problem.job.company ||
                                "Job"}

                              {" — "}

                              {problem.job.jobTitle ||
                                "Applied Position"}

                            </p>

                          )}

                        </div>


                        <div className="flex items-center gap-3 flex-wrap">

                          {problem.link && (

                            <a
                              href={
                                problem.link
                              }
                              target="_blank"
                              rel="noreferrer"
                              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-semibold"
                            >

                              Open

                            </a>

                          )}


                          <button
                            onClick={() =>
                              handleToggle(
                                problem._id
                              )
                            }
                            className={`px-4 py-2 rounded-lg font-semibold ${
                              problem.solved

                                ? "bg-yellow-100 text-yellow-700"

                                : "bg-green-100 text-green-700"
                            }`}
                          >

                            {problem.solved

                              ? "Mark Unsolved"

                              : "Mark Solved"

                            }

                          </button>


                          <button
                            onClick={() =>
                              handleDelete(
                                problem._id
                              )
                            }
                            className="px-4 py-2 bg-red-100 text-red-700 rounded-lg font-semibold"
                          >

                            Delete

                          </button>

                        </div>

                      </div>

                    );

                  }
                )}

              </div>

            </div>

          )}


          {/* =================================================
              EMPTY TRACKER
          ================================================= */}

          {problems.length === 0 && (

            <div className="bg-white rounded-2xl shadow p-8 text-center">

              <div className="text-5xl mb-4">

                📝

              </div>


              <h2 className="text-2xl font-bold">

                No Tracked Problems Yet

              </h2>


              <p className="text-gray-500 mt-2">

                Generate personalized problems above
                and add the ones you want to practice.

              </p>

            </div>

          )}

        </div>

      </div>

    </div>

  );

}


export default CodingTracker;