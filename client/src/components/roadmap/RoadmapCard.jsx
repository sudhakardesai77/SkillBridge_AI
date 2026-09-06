import {
  FaCalendarAlt,
  FaBook,
  FaGraduationCap,
} from "react-icons/fa";

function RoadmapCard({ week }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition duration-300">

      <div className="flex justify-between items-center">

        <div className="flex items-center gap-3">

          <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white">
            <FaCalendarAlt />
          </div>

          <div>
            <h2 className="text-xl font-bold">
              Week {week.week}
            </h2>

            <p className="text-gray-500">
              {week.focus}
            </p>
          </div>

        </div>

      </div>

      <hr className="my-5" />

      <h3 className="font-semibold flex items-center gap-2">
        <FaBook />
        Topics
      </h3>

      <div className="flex flex-wrap gap-2 mt-3">

        {week.topics.map((topic) => (
          <span
            key={topic}
            className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
          >
            {topic}
          </span>
        ))}

      </div>

      <h3 className="font-semibold flex items-center gap-2 mt-6">
        <FaGraduationCap />
        Learning Resources
      </h3>

      <ul className="mt-3 space-y-2">

        {week.resources.map((resource) => (
          <li
            key={resource}
            className="text-gray-700"
          >
            • {resource}
          </li>
        ))}

      </ul>

    </div>
  );
}

export default RoadmapCard;