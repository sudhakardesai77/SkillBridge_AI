import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";

import {
  getCompanyByName,
} from "../api/companyApi";

import {
  FaAmazon,
  FaMicrosoft,
  FaGoogle,
  FaBuilding,
  FaArrowLeft,
  FaExternalLinkAlt,
} from "react-icons/fa";

function CompanyDetails() {
  const { companyName } =
    useParams();

  const navigate =
    useNavigate();

  const [company, setCompany] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const loadCompany =
      async () => {
        try {
          setLoading(true);
          setError("");

          const response =
            await getCompanyByName(
              companyName
            );

          setCompany(
            response.company
          );
        } catch (err) {
          console.error(
            "Company Details Error:",
            err
          );

          setError(
            "Company not found."
          );
        } finally {
          setLoading(false);
        }
      };

    if (companyName) {
      loadCompany();
    }
  }, [companyName]);

  const iconMap = {
    amazon: FaAmazon,
    microsoft: FaMicrosoft,
    google: FaGoogle,
    building: FaBuilding,
  };

  if (loading) {
    return (
      <div className="flex bg-slate-100 min-h-screen">
        <Sidebar />

        <div className="flex-1">
          <Navbar />

          <div className="p-8">
            <div className="bg-white rounded-2xl p-10 text-center">
              <p className="text-gray-500">
                Loading company...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="flex bg-slate-100 min-h-screen">
        <Sidebar />

        <div className="flex-1">
          <Navbar />

          <div className="p-8">
            <div className="bg-white rounded-2xl p-10 text-center">
              <h2 className="text-2xl font-bold text-red-600">
                Company Not Found
              </h2>

              <button
                onClick={() =>
                  navigate(
                    "/companies"
                  )
                }
                className="mt-6 px-5 py-3 bg-blue-600 text-white rounded-xl"
              >
                Back to Companies
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const Icon =
    iconMap[company.icon] ||
    FaBuilding;

  return (
    <div className="flex bg-slate-100 min-h-screen">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <div className="p-8">
          {/* Back */}

          <button
            onClick={() =>
              navigate(
                "/companies"
              )
            }
            className="flex items-center gap-2 text-blue-600 mb-6 hover:underline"
          >
            <FaArrowLeft />
            Back to Companies
          </button>

          {/* Header */}

          <div className="bg-white rounded-3xl shadow-lg p-8 mb-8">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="w-24 h-24 rounded-2xl bg-blue-50 flex items-center justify-center">
                <Icon
                  size={55}
                  className="text-blue-600"
                />
              </div>

              <div className="flex-1">
                <h1 className="text-4xl font-bold">
                  {company.name}
                </h1>

                <p className="text-gray-500 mt-2">
                  {company.description}
                </p>

                <div className="flex flex-wrap gap-3 mt-4">
                  <span className="px-4 py-2 bg-blue-50 text-blue-700 rounded-xl">
                    📍{" "}
                    {company.location}
                  </span>

                  <span className="px-4 py-2 bg-green-50 text-green-700 rounded-xl">
                    💰{" "}
                    {company.package}
                  </span>

                  <span className="px-4 py-2 bg-purple-50 text-purple-700 rounded-xl">
                    🎓 Min CGPA:{" "}
                    {company.minCGPA}
                  </span>
                </div>
              </div>

              {company.website && (
                <a
                  href={
                    company.website
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
                >
                  Career Page
                  <FaExternalLinkAlt
                    size={13}
                  />
                </a>
              )}
            </div>
          </div>

          {/* Roles */}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <section className="bg-white rounded-2xl shadow p-6">
              <h2 className="text-2xl font-bold mb-5">
                Available Roles
              </h2>

              <div className="space-y-3">
                {company.roles?.map(
                  (role) => (
                    <div
                      key={role}
                      className="p-4 bg-slate-50 rounded-xl"
                    >
                      {role}
                    </div>
                  )
                )}
              </div>
            </section>

            {/* Skills */}

            <section className="bg-white rounded-2xl shadow p-6">
              <h2 className="text-2xl font-bold mb-5">
                Required Skills
              </h2>

              <div className="flex flex-wrap gap-3">
                {company.skills?.map(
                  (skill) => (
                    <span
                      key={skill}
                      className="px-4 py-2 bg-blue-50 text-blue-700 rounded-xl"
                    >
                      {skill}
                    </span>
                  )
                )}
              </div>
            </section>

            {/* Rounds */}

            <section className="bg-white rounded-2xl shadow p-6">
              <h2 className="text-2xl font-bold mb-5">
                Hiring Process
              </h2>

              <div className="space-y-4">
                {company.rounds?.map(
                  (
                    round,
                    index
                  ) => (
                    <div
                      key={round}
                      className="flex items-center gap-4"
                    >
                      <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                        {index + 1}
                      </div>

                      <span>
                        {round}
                      </span>
                    </div>
                  )
                )}
              </div>
            </section>

            {/* Resources */}

            <section className="bg-white rounded-2xl shadow p-6">
              <h2 className="text-2xl font-bold mb-5">
                Preparation Resources
              </h2>

              <div className="space-y-3">
                {company.resources?.map(
                  (resource) => (
                    <div
                      key={resource}
                      className="p-4 bg-slate-50 rounded-xl"
                    >
                      📚 {resource}
                    </div>
                  )
                )}
              </div>
            </section>
          </div>

          {/* Skill Gap */}

          <div className="mt-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
            <h2 className="text-2xl font-bold">
              Check Your Skill Gap
            </h2>

            <p className="mt-2 text-blue-100">
              Compare your resume
              skills with{" "}
              {company.name}'s
              requirements.
            </p>

            <button
              onClick={() =>
                navigate(
                  `/skill-gap?company=${encodeURIComponent(
                    company.name
                  )}`
                )
              }
              className="mt-5 px-6 py-3 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50"
            >
              Analyze Skill Gap →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompanyDetails;