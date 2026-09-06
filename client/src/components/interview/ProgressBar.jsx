function ProgressBar({ current, total }) {
  const percentage = ((current + 1) / total) * 100;

  return (
    <div className="mb-8">
      <div className="flex justify-between mb-2">
        <span className="font-semibold">
          Question {current + 1} of {total}
        </span>

        <span>{Math.round(percentage)}%</span>
      </div>

      <div className="w-full bg-gray-300 rounded-full h-3">
        <div
          className="bg-blue-600 h-3 rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export default ProgressBar;