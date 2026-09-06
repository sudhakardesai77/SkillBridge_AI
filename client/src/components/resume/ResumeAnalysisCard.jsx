function ResumeAnalysisCard({ title, value, color }) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6">

      <h3 className="text-gray-500 text-lg">
        {title}
      </h3>

      <p
        className="text-4xl font-bold mt-4"
        style={{ color }}
      >
        {value}
      </p>

    </div>
  );
}

export default ResumeAnalysisCard;