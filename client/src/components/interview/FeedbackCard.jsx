function FeedbackCard({
  score,
  strengths,
  weaknesses,
  improvedAnswer,
}) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 mt-8">

      {/* Score */}

      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold">
          AI Interview Feedback
        </h2>

        <div className="bg-blue-100 text-blue-700 px-6 py-3 rounded-xl font-bold text-2xl">
          ⭐ {score}/10
        </div>
      </div>

      {/* Strengths */}

      <div className="mb-8">
        <h3 className="text-2xl font-bold text-green-600 mb-4">
          ✅ Strengths
        </h3>

        <ul className="space-y-3">
          {strengths.map((item, index) => (
            <li
              key={index}
              className="bg-green-50 p-4 rounded-xl"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Weaknesses */}

      <div className="mb-8">
        <h3 className="text-2xl font-bold text-red-600 mb-4">
          ⚠️ Areas to Improve
        </h3>

        <ul className="space-y-3">
          {weaknesses.map((item, index) => (
            <li
              key={index}
              className="bg-red-50 p-4 rounded-xl"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Improved Answer */}

      <div>
        <h3 className="text-2xl font-bold text-blue-600 mb-4">
          💡 AI Suggested Answer
        </h3>

        <div className="bg-blue-50 p-5 rounded-xl whitespace-pre-wrap leading-8">
          {improvedAnswer}
        </div>
      </div>

    </div>
  );
}

export default FeedbackCard;