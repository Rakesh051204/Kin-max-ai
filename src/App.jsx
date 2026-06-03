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
  const speak = (text) => {
  const speech = new SpeechSynthesisUtterance(text);
  speech.lang = "en-US";
  speech.rate = 1;
  window.speechSynthesis.speak(speech);
};
return (
  <div style={{
    minHeight: "100vh",
    background: "#0b0f19",
    color: "white",
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  }}>

    {/* HEADER */}
    <div style={{
      width: "100%",
      padding: "15px",
      background: "#111827",
      textAlign: "center",
      fontSize: "20px",
      fontWeight: "bold"
    }}>
      🤖 FAANG AI Interview Assistant
    </div>

    {/* CHAT BOX */}
    <div style={{
      width: "90%",
      maxWidth: "700px",
      flex: 1,
      overflowY: "auto",
      padding: "20px"
    }}>
      {messages.map((m, i) => (
        <div
          key={i}
          style={{
            textAlign: m.role === "user" ? "right" : "left",
            margin: "10px 0"
          }}
        >
          <span style={{
            background: m.role === "user" ? "#2563eb" : "#1f2937",
            padding: "10px",
            borderRadius: "10px",
            display: "inline-block"
          }}>
            {m.text}
          </span>
        </div>
      ))}
    </div>

    {/* INPUT AREA */}
    <div style={{
      width: "90%",
      maxWidth: "700px",
      display: "flex",
      gap: "10px",
      padding: "15px"
    }}>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type or speak..."
        style={{
          flex: 1,
          padding: "10px",
          borderRadius: "8px"
        }}
      />

      <button onClick={startMic}>🎤</button>
      <button onClick={sendMessage}>Send</button>
    </div>

  </div>
);
