import {
  FaCheckCircle,
  FaFileAlt,
  FaRobot,
  FaBuilding,
} from "react-icons/fa";

function RecentActivity() {
  const activities = [
    {
      icon: <FaFileAlt />,
      title: "Resume Uploaded",
      color: "text-blue-600",
    },
    {
      icon: <FaRobot />,
      title: "ATS Analysis Completed",
      color: "text-green-600",
    },
    {
      icon: <FaBuilding />,
      title: "Eligibility Checked",
      color: "text-purple-600",
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h2 className="text-xl font-bold mb-6">
        Recent Activity
      </h2>

      <div className="space-y-5">
        {activities.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-4"
          >
            <div className={`${item.color} text-xl`}>
              {item.icon}
            </div>

            <div className="flex-1">
              <h3 className="font-semibold">
                {item.title}
              </h3>
            </div>

            <FaCheckCircle className="text-green-500" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecentActivity;