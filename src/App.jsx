import { useState } from "react";

export default function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loadingQ, setLoadingQ] = useState(false);
  const [loadingF, setLoadingF] = useState(false);

  // ✅ AI Question
  const generateQuestion = async () => {
    setLoadingQ(true);
    setFeedback("");

    try {
      const res = await fetch("/api/question", {
        method: "POST"
      });

      const data = await res.json();
      setQuestion(data.text);
      setAnswer("");
    } catch (err) {
      setQuestion("Error generating question");
    }

    setLoadingQ(false);
  };

  // ✅ AI Feedback
  const getFeedback = async () => {
    if (!answer) {
      setFeedback("⚠️ Please write an answer first.");
      return;
    }

    setLoadingF(true);

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          question,
          answer
        })
      });

      const data = await res.json();
      setFeedback(data.text);
    } catch (err) {
      setFeedback("Error getting AI feedback");
    }

    setLoadingF(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        color: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "20px",
        padding: "20px"
      }}
    >
      <h1>🔥 AI Interview Coach</h1>

      {/* Generate Question */}
      <button
        onClick={generateQuestion}
        disabled={loadingQ}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          cursor: "pointer"
        }}
      >
        {loadingQ ? "Generating..." : "Generate Question"}
      </button>

      {/* Question Box */}
      {question && (
        <div style={{ maxWidth: "600px", textAlign: "center" }}>
          <h2>Question:</h2>
          <p>{question}</p>

          {/* Answer Box */}
          <textarea
            placeholder="Write your answer..."
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            style={{
              width: "100%",
              height: "120px",
              marginTop: "10px"
            }}
          />

          {/* Feedback Button */}
          <button
            onClick={getFeedback}
            disabled={loadingF}
            style={{
              marginTop: "10px",
              padding: "10px 20px",
              cursor: "pointer"
            }}
          >
            {loadingF ? "Analyzing..." : "Get Feedback"}
          </button>

          {/* Feedback Output */}
          {feedback && (
            <div style={{ marginTop: "20px" }}>
              <h3>AI Feedback:</h3>
              <p>{feedback}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
