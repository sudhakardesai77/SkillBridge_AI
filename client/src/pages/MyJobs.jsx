import { useEffect, useState } from "react";
import { getMyJobs, deleteJob } from "../api/jobApi";
import Sidebar from "../components/common/Sidebar";

function MyJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadJobs = async () => {
    try {
      setLoading(true);

      const res = await getMyJobs();

      setJobs(res.jobs || []);
    } catch (error) {
      console.error("Load Jobs Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const handleDelete = async (jobId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this job?"
    );

    if (!confirmDelete) return;

    try {
      await deleteJob(jobId);

      alert("Job deleted successfully!");

      loadJobs();
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Failed to delete job."
      );
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8">

        <div className="max-w-5xl mx-auto">

          <div className="flex justify-between items-center mb-6">

            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                My Posted Jobs
              </h1>

              <p className="text-gray-500">
                Manage all jobs posted by you.
              </p>
            </div>

          </div>

          {loading ? (

            <div className="p-8">
              Loading jobs...
            </div>

          ) : jobs.length === 0 ? (

            <div className="bg-white p-10 rounded-xl shadow text-center">

              <h2 className="text-xl font-semibold">
                No jobs posted yet
              </h2>

              <p className="text-gray-500 mt-2">
                Start by posting your first job.
              </p>

            </div>

          ) : (

            <div className="space-y-4">

              {jobs.map((job) => (

                <div
                  key={job._id}
                  className="bg-white p-6 rounded-xl shadow"
                >

                  <div className="flex justify-between">

                    <div>

                      <h2 className="text-xl font-bold">
                        {job.jobTitle}
                      </h2>

                      <p className="text-blue-600 font-medium">
                        {job.company}
                      </p>

                      <p className="text-gray-500 mt-2">
                        📍 {job.location}
                      </p>

                      <p className="text-gray-500">
                        💼 {job.jobType}
                      </p>

                    </div>

                    <button
                      onClick={() =>
                        handleDelete(job._id)
                      }
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg h-fit"
                    >
                      Delete
                    </button>

                  </div>

                  {job.description && (

                    <div className="mt-4">

                      <h3 className="font-semibold mb-2">
                        Description
                      </h3>

                      <p className="text-gray-600 whitespace-pre-line">
                        {job.description}
                      </p>

                    </div>

                  )}

                  {job.skills?.length > 0 && (

                    <div className="mt-4">

                      <h3 className="font-semibold mb-2">
                        Required Skills
                      </h3>

                      <div className="flex flex-wrap gap-2">

                        {job.skills.map(
                          (skill, index) => (

                            <span
                              key={index}
                              className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                            >
                              {skill}
                            </span>

                          )
                        )}

                      </div>

                    </div>

                  )}

                  {/* COMPANY WEBSITE */}

                  {job.companyWebsite && (

                    <a
                      href={job.companyWebsite}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block mt-5 text-blue-600 hover:underline"
                    >
                      🌐 Visit Company Website
                    </a>

                  )}

                  {/* APPLY LINK */}

                  {job.applyLink && (

                    <a
                      href={job.applyLink}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block mt-5 ml-5 text-green-600 hover:underline"
                    >
                      💼 View Apply Link →
                    </a>

                  )}

                </div>

              ))}

            </div>

          )}

        </div>

      </main>

    </div>
  );
}

export default MyJobs;