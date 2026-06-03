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
