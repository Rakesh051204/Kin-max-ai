import { useState } from "react";

export default function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

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
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0f172a",
      color: "white",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "20px"
    }}>
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
            style={{ width: "100%", height: "120px", marginTop: "10px" }}
          />
        </div>
      )}
    </div>
  );
}
