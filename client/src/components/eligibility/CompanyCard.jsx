import { Link } from "react-router-dom";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaBuilding,
} from "react-icons/fa";

function CompanyCard({ company }) {
  const matchedSkills = company.matchedSkills || [];
  const missingSkills = company.missingSkills || [];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition duration-300">

      {/* ================= HEADER ================= */}

      <div className="flex justify-between items-center">

        <div className="flex items-center gap-3">

          <FaBuilding className="text-3xl text-blue-600" />

          <div>
            <h2 className="text-2xl font-bold">
              {company.company}
            </h2>

            <p className="text-gray-500">
              Required CGPA: {company.cgpaRequired}
            </p>
          </div>

        </div>

        {/* Skill Match */}

        <div className="text-right">

          <h2 className="text-3xl font-bold text-blue-600">
            {company.matchPercentage}%
          </h2>

          <p className="text-gray-500">
            Skill Match
          </p>

        </div>

      </div>

      <hr className="my-5" />

      {/* ================= ELIGIBILITY ================= */}

      <div className="mb-5">

        {company.eligible ? (

          <div className="flex items-center gap-2">

            <FaCheckCircle className="text-green-600" />

            <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-semibold">
              Eligible
            </span>

          </div>

        ) : (

          <div className="flex items-center gap-2">

            <FaTimesCircle className="text-red-600" />

            <span className="bg-red-100 text-red-700 px-4 py-2 rounded-full font-semibold">
              Not Eligible
            </span>

          </div>

        )}

      </div>

      {/* ================= SKILLS ================= */}

      <h3 className="font-bold mb-3">
        Required Skills
      </h3>

      <div className="space-y-2">

        {/* Matched Skills */}

        {matchedSkills.map((skill) => (

          <div
            key={`matched-${skill}`}
            className="flex items-center gap-2 text-green-600"
          >

            <FaCheckCircle />

            <span>
              {skill}
            </span>

          </div>

        ))}

        {/* Missing Skills */}

        {missingSkills.map((skill) => (

          <div
            key={`missing-${skill}`}
            className="flex items-center gap-2 text-red-600"
          >

            <FaTimesCircle />

            <span>
              {skill}
            </span>

          </div>

        ))}

        {/* No Skills */}

        {matchedSkills.length === 0 &&
          missingSkills.length === 0 && (

            <p className="text-gray-500">
              No skill information available.
            </p>

          )}

      </div>

      {/* ================= ACTION BUTTONS ================= */}

      <div className="flex gap-3 mt-6">

        <Link
          to={`/skill-gap?company=${encodeURIComponent(
            company.company
          )}`}
          className="flex-1 bg-blue-600 text-white py-3 rounded-xl text-center hover:bg-blue-700 transition"
        >
          Skill Gap
        </Link>

        <Link
          to={`/roadmap?company=${encodeURIComponent(
            company.company
          )}`}
          className="flex-1 bg-green-600 text-white py-3 rounded-xl text-center hover:bg-green-700 transition"
        >
          Roadmap
        </Link>

      </div>

    </div>
  );
}

export default CompanyCard;