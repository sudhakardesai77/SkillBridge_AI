function QuestionCard({ question }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-xl font-bold mb-4">
        Interview Question
      </h2>

      <p className="text-lg text-gray-700">
        {question}
      </p>
    </div>
  );
}

export default QuestionCard;