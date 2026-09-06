import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
);

function DashboardChart({
  atsScore,
  profileCompletion,
  placementReadiness,
}) {
  const data = {
    labels: ["Profile", "ATS", "Placement"],
    datasets: [
      {
        label: "Overall Progress",
        data: [
          profileCompletion,
          atsScore,
          placementReadiness,
        ],
        borderColor: "#2563eb",
        backgroundColor: "rgba(37,99,235,0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h2 className="text-xl font-bold mb-5">
        Placement Progress
      </h2>

      <Line data={data} options={options} />
    </div>
  );
}

export default DashboardChart;