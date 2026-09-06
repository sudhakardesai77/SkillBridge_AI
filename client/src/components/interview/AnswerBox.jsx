function AnswerBox({ answer, setAnswer }) {
  return (
    <textarea
      value={answer}
      onChange={(e) => setAnswer(e.target.value)}
      rows={8}
      placeholder="Type your answer here..."
      className="w-full mt-6 border rounded-xl p-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
}

export default AnswerBox;