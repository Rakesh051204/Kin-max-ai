import { useState } from "react";

export default function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("FAANG");
  const [timer, setTimer] = useState(120);

  // ⏱️ Timer
  const startTimer = () => {
    let time = 120;
    const interval = setInterval(() => {
      time--;
      setTimer(time);

      if (time <= 0) {
        clearInterval(interval);
        getFeedback();
      }
    }, 1000);
  };

  // 🎯 Generate Question (FAANG LEVEL)
  const generateQuestion = async () => {
    setLoading(true);
    setFeedback("");
    setAnswer("");
    setTimer(120);
    startTimer();

    try {
      const res = await fetch("/api/question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode }),
      });

      const data = await res.json();
      setQuestion(data.text);
    } catch (err) {
      setQuestion("Error generating question");
    }

    setLoading(false);
  };

  // 🧠 Get AI Feedback
  const getFeedback = async () => {
    if (!answer) {
      setFeedback("Please write an answer first.");
      return;
    }

    const res = await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, answer }),
    });

    const data = await res.json();
    setFeedback(data.text);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0f172a",
      color: "white",
      padding: "20px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "15px"
    }}>

      <h1>🔥 FAANG Interview Simulator</h1>

      {/* MODE SELECTOR */}
      <select
        onChange={(e) => setMode(e.target.value)}
        style={{ padding: "10px" }}
      >
        <option>FAANG</option>
        <option>Google</option>
        <option>Amazon</option>
        <option>Microsoft</option>
        <option>Data Science</option>
      </select>

      <button onClick={generateQuestion} disabled={loading}>
        {loading ? "Generating..." : "Start Interview"}
      </button>

      {/* TIMER */}
      <h3>⏱️ Time Left: {timer}s</h3>

      {/* QUESTION */}
      {question && (
        <div style={{ maxWidth: "600px" }}>
          <h2>Question:</h2>
          <p>{question}</p>

          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your answer..."
            style={{ width: "100%", height: "120px" }}
          />

          <button onClick={getFeedback}>
            Submit Answer
          </button>

          {/* FEEDBACK */}
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
