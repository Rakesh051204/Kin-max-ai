import { useState } from "react";

export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input) return;

    const newMessages = [...messages, { role: "user", text: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    const res = await fetch("/api/interview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: newMessages }),
    });

    const data = await res.json();

    setMessages([
      ...newMessages,
      { role: "ai", text: data.text },
    ]);

    setLoading(false);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0b0f19",
      color: "white",
      display: "flex",
      flexDirection: "column"
    }}>

      {/* HEADER */}
      <div style={{
        padding: 15,
        background: "#111827",
        textAlign: "center",
        fontSize: 20,
        fontWeight: "bold"
      }}>
        🚀 FAANG Interview SaaS
      </div>

      {/* CHAT AREA */}
      <div style={{
        flex: 1,
        padding: 20,
        overflowY: "auto"
      }}>
        {messages.map((m, i) => (
          <div key={i} style={{
            textAlign: m.role === "user" ? "right" : "left",
            margin: "10px 0"
          }}>
            <div style={{
              display: "inline-block",
              padding: 10,
              borderRadius: 10,
              background: m.role === "user" ? "#2563eb" : "#1f2937"
            }}>
              {m.text}
            </div>
          </div>
        ))}
      </div>

      {/* INPUT */}
      <div style={{
        display: "flex",
        padding: 15,
        gap: 10
      }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Answer interview question..."
          style={{
            flex: 1,
            padding: 10,
            borderRadius: 8
          }}
        />

        <button onClick={sendMessage}>
          Send
        </button>
      </div>

    </div>
  );
}
