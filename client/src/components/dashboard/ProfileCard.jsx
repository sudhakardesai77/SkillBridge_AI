import {
  FaUserCircle,
  FaEnvelope,
  FaUniversity,
  FaCode,
} from "react-icons/fa";

function ProfileCard({ user }) {
  const skills = Array.isArray(user?.skills)
    ? user.skills
    : [];

  const hasCgpa =
    user?.cgpa !== undefined &&
    user?.cgpa !== null &&
    user?.cgpa !== "" &&
    Number(user.cgpa) > 0;

  return (
    <div className="bg-white rounded-2xl shadow-md p-8 hover:shadow-xl transition">

      {/* =====================================================
          TOP PROFILE
      ===================================================== */}

      <div className="flex items-center gap-6">

        <FaUserCircle className="text-7xl text-blue-600" />

        <div>

          <h2 className="text-2xl font-bold">
            {user?.name || "Name Not Detected"}
          </h2>

          <p className="text-gray-500 flex items-center gap-2 mt-2">
            <FaEnvelope />

            {user?.email || "Email Not Detected"}
          </p>

          <p className="text-gray-500 flex items-center gap-2 mt-2">
            <FaUniversity />

            {user?.college || "College Not Detected"}
          </p>

          <p className="text-gray-500 flex items-center gap-2 mt-2">
            <FaCode />

            {user?.branch || "Branch Not Detected"}
          </p>

        </div>

      </div>

      <hr className="my-6" />

      {/* =====================================================
          DETAILS
      ===================================================== */}

      <div className="grid grid-cols-3 gap-6">

        {/* ================= CGPA ================= */}

        <div>

          <p className="text-gray-500">
            CGPA
          </p>

          <h2 className="text-3xl font-bold text-blue-600">

            {hasCgpa
              ? Number(user.cgpa).toFixed(2)
              : "Not Detected"}

          </h2>

        </div>

        {/* ================= SKILLS ================= */}

        <div>

          <p className="text-gray-500">
            Skills
          </p>

          <h2 className="text-3xl font-bold text-green-600">
            {skills.length}
          </h2>

        </div>

        {/* ================= RESUME ================= */}

        <div>

          <p className="text-gray-500">
            Resume
          </p>

          <h2 className="text-3xl font-bold text-orange-500">

            {user?.resume?.url
              ? "Uploaded"
              : "Pending"}

          </h2>

        </div>

      </div>

      {/* =====================================================
          SKILL LIST
      ===================================================== */}

      {skills.length > 0 && (

        <div className="mt-8">

          <h3 className="text-xl font-bold mb-4">
            Extracted Skills
          </h3>

          <div className="flex flex-wrap gap-3">

            {skills.map(
              (skill, index) => (

                <span
                  key={`${skill}-${index}`}
                  className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-semibold"
                >
                  {skill}
                </span>

              )
            )}

          </div>

        </div>

      )}

    </div>
  );
}

export default ProfileCard;