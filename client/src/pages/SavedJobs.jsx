import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";

import {
  getBookmarkedJobs,
  removeBookmark,
} from "../api/jobApi";

function SavedJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadSavedJobs = async () => {
    try {
      setLoading(true);

      const res = await getBookmarkedJobs();

      console.log("Saved Jobs:", res);

      setJobs(res.jobs || []);

    } catch (err) {
      console.error("Saved Jobs Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSavedJobs();
  }, []);

  const handleRemove = async (id) => {
    try {
      await removeBookmark(id);

      await loadSavedJobs();

    } catch (err) {
      console.error("Remove Bookmark Error:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-100">
        <h1 className="text-3xl font-bold text-blue-600">
          Loading Saved Jobs...
        </h1>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-100">

      <Sidebar />

      <div className="flex-1">

        <Navbar />

        <div className="p-8 max-w-7xl mx-auto">

          {/* HEADER */}

          <div className="flex justify-between items-center mb-8">

            <div>

              <h1 className="text-4xl font-bold">
                🔖 Saved Jobs
              </h1>

              <p className="text-gray-500 mt-2">
                Jobs and internships you saved for later.
              </p>

            </div>

            <Link
              to="/jobs"
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold"
            >
              Browse Jobs
            </Link>

          </div>


          {/* EMPTY */}

          {jobs.length === 0 ? (

            <div className="bg-white rounded-2xl shadow p-10 text-center">

              <h2 className="text-2xl font-bold">
                No Saved Jobs
              </h2>

              <p className="text-gray-500 mt-2">
                Bookmark a job to see it here.
              </p>

              <Link
                to="/jobs"
                className="inline-block mt-6 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold"
              >
                Find Jobs
              </Link>

            </div>

          ) : (

            <div className="space-y-5">

              {jobs.map((job) => (

                <div
                  key={job._id}
                  className="bg-white rounded-2xl shadow-md p-6"
                >

                  <div className="flex flex-col md:flex-row md:justify-between gap-5">

                    <div>

                      <h2 className="text-2xl font-bold">
                        {job.jobTitle}
                      </h2>

                      <p className="text-blue-600 font-semibold mt-1">
                        {job.company}
                      </p>

                      <div className="flex flex-wrap gap-2 mt-4">

                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                          📍 {job.location}
                        </span>

                        <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
                          💼 {job.jobType}
                        </span>

                      </div>

                    </div>


                    <div className="flex gap-3 items-center">

                      {job.applyLink && (

                        <a
                          href={job.applyLink}
                          target="_blank"
                          rel="noreferrer"
                          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold"
                        >
                          Apply
                        </a>

                      )}

                      <button
                        onClick={() =>
                          handleRemove(job._id)
                        }
                        className="bg-red-100 text-red-700 px-5 py-3 rounded-xl font-semibold"
                      >
                        Remove
                      </button>

                    </div>

                  </div>


                  {job.description && (
                    <p className="text-gray-600 mt-5">
                      {job.description}
                    </p>
                  )}

                </div>

              ))}

            </div>

          )}

        </div>

      </div>

    </div>
  );
}

export default SavedJobs;