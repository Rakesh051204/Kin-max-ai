import { useState } from "react";

export default function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input) return;

    const newMessages = [...messages, { role: "user", text: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input }),
    });

    const data = await res.json();

    setMessages([
      ...newMessages,
      { role: "ai", text: data.text || "No response" },
    ]);

    setLoading(false);
  };

  return (
    <div style={{ padding: 20, background: "#0f172a", color: "white", minHeight: "100vh" }}>
      <h1>🔥 AI Interview Bot</h1>

      <div style={{ marginTop: 20 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ margin: "10px 0" }}>
            <b>{m.role === "user" ? "You" : "AI"}:</b> {m.text}
          </div>
        ))}
      </div>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type answer or say start interview..."
        style={{ width: "70%", padding: 10 }}
      />

      <button onClick={sendMessage} style={{ padding: 10, marginLeft: 10 }}>
        Send
      </button>

      {loading && <p>AI thinking...</p>}
    </div>
  );
}
export default function App() {
  const startMic = () => {
  const recognition =
    new (window.SpeechRecognition || window.webkitSpeechRecognition)();

  recognition.lang = "en-US";

  recognition.onresult = (event) => {
    setInput(event.results[0][0].transcript);
  };

  recognition.start();
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
      gap: "15px",
      padding: "20px"
    }}
  >

    <h1>🔥 AI Interview Bot</h1>

    {/* INPUT BOX */}
    <input
      value={input}
      onChange={(e) => setInput(e.target.value)}
      placeholder="Type or speak your answer..."
      style={{ padding: "10px", width: "300px" }}
    />

    {/* BUTTONS */}
    <div style={{ display: "flex", gap: "10px" }}>

      <button onClick={sendMessage}>
        Send
      </button>

      {/* 🎤 MIC BUTTON (ADD HERE) */}
      <button onClick={startMic}>
        🎤 Speak
      </button>

    </div>

    {/* CHAT OUTPUT */}
    <div>
      {messages.map((m, i) => (
        <p key={i}>
          <b>{m.role}:</b> {m.text}
        </p>
      ))}
    </div>

  </div>
);
