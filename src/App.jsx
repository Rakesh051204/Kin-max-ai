import { useState } from "react";

export default function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");

  const generateQuestion = () => {
    const questions = [
      "Explain Overfitting in Machine Learning",
      "What is Normalization vs Standardization?",
      "What is SQL JOIN?",
      "Explain Bias vs Variance",
      "What is REST API?"
    ];

    const random = questions[Math.floor(Math.random() * questions.length)];
    setQuestion(random);
    setAnswer("");
    setFeedback("");
  };

  const getFeedback = () => {
    if (!answer) {
      setFeedback("Please write an answer first.");
      return;
    }

    setFeedback("AI Feedback feature will be connected soon 🚀");
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

      <button
        onClick={generateQuestion}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          cursor: "pointer"
        }}
      >
        Generate Question
      </button>

      {question && (
        <div style={{ maxWidth: "600px", textAlign: "center" }}>
          <h2>Question:</h2>
          <p>{question}</p>

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

          <button
            onClick={getFeedback}
            style={{
              marginTop: "10px",
              padding: "10px 20px",
              cursor: "pointer"
            }}
          >
            Get Feedback
          </button>

          {feedback && (
            <div style={{ marginTop: "20px" }}>
              <h3>Feedback:</h3>
              <p>{feedback}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
