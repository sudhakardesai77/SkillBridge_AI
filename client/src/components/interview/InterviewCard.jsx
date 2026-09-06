function InterviewCard({
  interview,
  onView,
}) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6">

      <div className="flex justify-between items-center">

        <div>

          <h2 className="text-2xl font-bold">
            {interview.company}
          </h2>

          <p className="text-gray-500 mt-1">
            {interview.role ||
              "Software Engineer"}
          </p>

          <div className="flex gap-2 mt-3">

            {interview.interviewType && (
              <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                {interview.interviewType}
              </span>
            )}

            {interview.topic && (
              <span className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                {interview.topic}
              </span>
            )}

          </div>

          <p className="text-gray-500 mt-3">
            {interview.question}
          </p>

          {interview.totalQuestions > 1 && (
            <p className="text-sm text-gray-400 mt-2">
              Question{" "}
              {interview.questionNumber} of{" "}
              {interview.totalQuestions}
            </p>
          )}

          <p className="text-sm text-gray-400 mt-2">
            {new Date(
              interview.createdAt
            ).toLocaleDateString()}
          </p>

        </div>

        <div className="text-right">

          <div className="text-3xl font-bold text-blue-600">
            ⭐ {interview.score}/10
          </div>

          {onView && (
            <button
              onClick={() =>
                onView(interview)
              }
              className="mt-4 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
            >
              View Details
            </button>
          )}

        </div>

      </div>

    </div>
  );
}

export default InterviewCard;