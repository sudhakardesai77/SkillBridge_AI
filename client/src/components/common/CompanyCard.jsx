import {
  FaAmazon,
  FaMicrosoft,
  FaGoogle,
  FaBuilding,
} from "react-icons/fa";

function CompanyCard({
  company,
  onClick,
}) {
  const iconMap = {
    amazon: FaAmazon,
    microsoft: FaMicrosoft,
    google: FaGoogle,
    building: FaBuilding,
  };

  const Icon =
    iconMap[company.icon] ||
    FaBuilding;

  return (
    <div
      className="cursor-pointer bg-white rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 p-8"
      onClick={() => {
        if (onClick) {
          onClick(company.name);
        }
      }}
    >
      <div className="flex flex-col items-center text-center">
        <Icon
          size={50}
          className="text-blue-600 mb-4"
        />

        <h2 className="text-2xl font-bold">
          {company.name}
        </h2>

        <p className="text-gray-500 mt-2">
          Min CGPA:{" "}
          {company.minCGPA}
        </p>

        <p className="text-green-600 font-semibold mt-2">
          {company.package ||
            "Varies by role"}
        </p>

        <p className="text-gray-400 text-sm mt-2">
          {company.location}
        </p>

        {company.skills &&
          company.skills.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {company.skills
                .slice(0, 4)
                .map((skill) => (
                  <span
                    key={skill}
                    className="px-2 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs"
                  >
                    {skill}
                  </span>
                ))}
            </div>
          )}
      </div>
    </div>
  );
}

export default CompanyCard;