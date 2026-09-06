import { Link } from "react-router-dom";
import {
  FaFileAlt,
  FaRobot,
  FaBuilding,
  FaTools,
  FaMapSigns,
} from "react-icons/fa";

function QuickActions() {
  const actions = [
    {
      title: "Resume",
      icon: <FaFileAlt />,
      path: "/resume",
      color: "bg-blue-600",
    },
    {
      title: "ATS",
      icon: <FaRobot />,
      path: "/ats",
      color: "bg-green-600",
    },
    {
      title: "Eligibility",
      icon: <FaBuilding />,
      path: "/eligibility",
      color: "bg-purple-600",
    },
    {
      title: "Skill Gap",
      icon: <FaTools />,
      path: "/skill-gap",
      color: "bg-orange-600",
    },
    {
      title: "Roadmap",
      icon: <FaMapSigns />,
      path: "/roadmap",
      color: "bg-red-600",
    },
  ];

  return (
    <>
      <h2 className="text-2xl font-bold mb-5">
        Quick Actions
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-5">

        {actions.map((item) => (

          <Link
            key={item.title}
            to={item.path}
            className={`${item.color} text-white rounded-2xl p-6 hover:scale-105 transition duration-300`}
          >

            <div className="text-4xl mb-4">
              {item.icon}
            </div>

            <h2 className="font-bold">
              {item.title}
            </h2>

          </Link>

        ))}

      </div>
    </>
  );
}

export default QuickActions;