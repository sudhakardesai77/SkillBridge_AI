import { useEffect, useState } from "react";
import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";
import InterviewCard from "../components/interview/InterviewCard";
import { getInterviewHistory } from "../api/interviewHistoryApi";

function InterviewHistory() {
  const [history, setHistory] = useState([]);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const res = await getInterviewHistory();
      setHistory(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const filteredHistory = history.filter((item) =>
    item.company.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex bg-slate-100 min-h-screen">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <div className="p-8">

          <h1 className="text-4xl font-bold mb-2">
            Interview History
          </h1>

          <p className="text-gray-500 mb-8">
            Review all your previous AI mock interviews.
          </p>

          <input
            type="text"
            placeholder="Search company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-96 border rounded-xl p-3 mb-8"
          />

          {filteredHistory.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-10 text-center">
              <h2 className="text-3xl font-bold">
                No Interviews Found
              </h2>
            </div>
          ) : (
            <div className="space-y-6">

              {filteredHistory.map((item) => (
                <InterviewCard
                  key={item._id}
                  interview={item}
                  onView={setSelectedInterview}
                />
              ))}

            </div>
          )}

        </div>
      </div>

      {/* Modal */}

      {selectedInterview && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">

          <div className="bg-white rounded-2xl shadow-xl w-[800px] max-h-[90vh] overflow-y-auto p-8">

            <div className="flex justify-between items-center">

              <h2 className="text-3xl font-bold">
                {selectedInterview.company}
              </h2>

              <button
                onClick={() => setSelectedInterview(null)}
                className="text-3xl"
              >
                ✖
              </button>

            </div>

            <div className="mt-8">

              <h3 className="font-bold text-xl mb-2">
                Interview Question
              </h3>

              <p>{selectedInterview.question}</p>

            </div>

            <div className="mt-8">

              <h3 className="font-bold text-xl mb-2">
                Your Answer
              </h3>

              <p className="whitespace-pre-wrap">
                {selectedInterview.answer}
              </p>

            </div>

            <div className="mt-8">

              <h3 className="font-bold text-xl mb-2">
                AI Score
              </h3>

              <div className="text-4xl font-bold text-blue-600">
                ⭐ {selectedInterview.score}/10
              </div>

            </div>

            <div className="mt-8">

              <h3 className="font-bold text-xl mb-2">
                AI Feedback
              </h3>

              <ul className="list-disc ml-6 space-y-2">

                {selectedInterview.feedback.map((tip, index) => (
                  <li key={index}>
                    {tip}
                  </li>
                ))}

              </ul>

            </div>

            {selectedInterview.improvedAnswer && (

              <div className="mt-8">

                <h3 className="font-bold text-xl mb-2">
                  AI Suggested Answer
                </h3>

                <div className="bg-blue-50 rounded-xl p-5 whitespace-pre-wrap">
                  {selectedInterview.improvedAnswer}
                </div>

              </div>

            )}

            <div className="mt-8 text-gray-500">
              {new Date(selectedInterview.createdAt).toLocaleString()}
            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default InterviewHistory;