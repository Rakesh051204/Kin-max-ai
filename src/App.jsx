import { useState, useEffect, useRef } from "react";

const COMPANIES = ["Google", "Amazon", "Microsoft", "Meta", "Apple", "General FAANG"];
const TOPICS = [
  { id: "ml", label: "ML / Deep Learning", icon: "🤖" },
  { id: "statistics", label: "Statistics", icon: "📊" },
  { id: "sql", label: "SQL", icon: "🗄️" },
  { id: "python", label: "Python", icon: "🐍" },
  { id: "aptitude", label: "Math Aptitude", icon: "📐" },
  { id: "logical", label: "Logical Reasoning", icon: "🧩" },
  { id: "casestudy", label: "Case Study", icon: "📋" },
  { id: "systemdesign", label: "System Design", icon: "⚙️" },
];
const DIFFICULTIES = ["Easy", "Medium", "Hard"];
const GRADES = { 9: "S", 8: "A", 7: "B", 5: "C", 0: "D" };

function getGrade(score) {
  for (const [min, grade] of Object.entries(GRADES).sort((a, b) => b[0] - a[0])) {
    if (score >= Number(min)) return grade;
  }
  return "D";
}

function GradeChip({ score }) {
  const grade = getGrade(score);
  const colors = { S: "#00FF88", A: "#00C2FF", B: "#FFD700", C: "#FF6B35", D: "#FF4444" };
  return (
    <span style={{
      display: "inline-block", padding: "2px 12px", borderRadius: 8,
      background: colors[grade] + "22", color: colors[grade],
      fontWeight: 800, fontSize: 18, border: `1.5px solid ${colors[grade]}`,
      fontFamily: "'Space Mono', monospace"
    }}>{grade}</span>
  );
}

const API_KEY_STORAGE = "ds_coach_api_key";

export default function App() {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem(API_KEY_STORAGE) || "");
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [screen, setScreen] = useState("home"); // home | setup | question | feedback | report
  const [company, setCompany] = useState("Google");
  const [topic, setTopic] = useState(TOPICS[0]);
  const [difficulty, setDifficulty] = useState("Medium");
  const [numQuestions, setNumQuestions] = useState(5);
  const [session, setSession] = useState([]);
  const [currentQ, setCurrentQ] = useState(null);
  const [qIndex, setQIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(120);
  const [timerActive, setTimerActive] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [hint, setHint] = useState("");
  const [hintLoading, setHintLoading] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (timerActive && timer > 0) {
      timerRef.current = setTimeout(() => setTimer(t => t - 1), 1000);
    }
    return () => clearTimeout(timerRef.current);
  }, [timerActive, timer]);

  function saveApiKey() {
    localStorage.setItem(API_KEY_STORAGE, apiKeyInput);
    setApiKey(apiKeyInput);
  }

  async function callClaude(prompt, system = "") {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system: system || "You are a world-class FAANG Data Scientist interviewer. Respond ONLY with valid JSON, no markdown, no backticks.",
        messages: [{ role: "user", content: prompt }]
      })
    });
    const data = await res.json();
    const text = data.content?.[0]?.text || "";
    const clean = text.replace(/```json|```/g, "").trim();
    return JSON.parse(clean);
  }

  async function fetchQuestion() {
    setLoading(true);
    setAnswer("");
    setFeedback(null);
    setShowHint(false);
    setHint("");
    try {
      const q = await callClaude(
        `Generate a ${difficulty} ${topic.label} interview question for a Data Scientist role at ${company}.
Return JSON: { "question": "...", "context": "brief context if needed, else empty string" }`
      );
      setCurrentQ(q);
      setTimer(difficulty === "Easy" ? 90 : difficulty === "Medium" ? 120 : 180);
      setTimerActive(true);
    } catch (e) {
      alert("API error: " + e.message);
    }
    setLoading(false);
  }

  async function submitAnswer() {
    setTimerActive(false);
    setLoading(true);
    try {
      const fb = await callClaude(
        `Question: ${currentQ.question}
Candidate Answer: ${answer || "(no answer given)"}
Company: ${company}, Topic: ${topic.label}, Difficulty: ${difficulty}

Evaluate and return JSON:
{
  "score": <1-10>,
  "strengths": ["...", "..."],
  "improvements": ["...", "..."],
  "ideal_answer": "FAANG-level ideal answer in 3-5 sentences",
  "verdict": "one sentence summary"
}`
      );
      setFeedback(fb);
      setSession(s => [...s, { question: currentQ.question, answer, ...fb, topic: topic.label, company }]);
    } catch (e) {
      alert("API error: " + e.message);
    }
    setLoading(false);
    setScreen("feedback");
  }

  async function getHint() {
    setHintLoading(true);
    try {
      const h = await callClaude(
        `Give a subtle hint for this interview question without giving away the answer:
Question: ${currentQ.question}
Return JSON: { "hint": "..." }`
      );
      setHint(h.hint);
      setShowHint(true);
    } catch (e) {}
    setHintLoading(false);
  }

  function nextQuestion() {
    if (qIndex + 1 >= numQuestions) {
      setScreen("report");
    } else {
      setQIndex(i => i + 1);
      setScreen("question");
      fetchQuestion();
    }
  }

  function startSession() {
    setSession([]);
    setQIndex(0);
    setScreen("question");
    fetchQuestion();
  }

  function resetAll() {
    setScreen("home");
    setSession([]);
    setQIndex(0);
    setCurrentQ(null);
    setFeedback(null);
    setAnswer("");
  }

  const avgScore = session.length ? (session.reduce((a, b) => a + b.score, 0) / session.length).toFixed(1) : 0;

  // ── SCREENS ──────────────────────────────────────────────────────────────────

  if (!apiKey) return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo}>⚡</div>
        <h1 style={styles.title}>DS Interview Coach</h1>
        <p style={styles.sub}>FAANG Data Scientist Simulator</p>
        <p style={{ color: "#aaa", marginBottom: 16, fontSize: 14 }}>Enter your Anthropic API key to begin</p>
        <input
          style={styles.input}
          type="password"
          placeholder="sk-ant-..."
          value={apiKeyInput}
          onChange={e => setApiKeyInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && saveApiKey()}
        />
        <button style={styles.btn} onClick={saveApiKey}>Start Coaching →</button>
        <p style={{ color: "#555", fontSize: 12, marginTop: 12 }}>Key saved locally in your browser only.</p>
      </div>
    </div>
  );

  if (screen === "home") return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo}>⚡</div>
        <h1 style={styles.title}>DS Interview Coach</h1>
        <p style={styles.sub}>AI-Powered FAANG Interview Simulator</p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", margin: "16px 0" }}>
          {["Google", "Amazon", "Microsoft", "Meta"].map(c => (
            <span key={c} style={styles.tag}>{c}</span>
          ))}
        </div>
        <button style={styles.btn} onClick={() => setScreen("setup")}>Start Interview →</button>
        {session.length > 0 && (
          <button style={{ ...styles.btn, background: "#111", border: "1px solid #333", marginTop: 8 }} onClick={() => setScreen("report")}>
            View Last Report 📊
          </button>
        )}
        <button style={{ ...styles.btnSm, marginTop: 16 }} onClick={() => { localStorage.removeItem(API_KEY_STORAGE); setApiKey(""); }}>
          Change API Key
        </button>
      </div>
    </div>
  );

  if (screen === "setup") return (
    <div style={styles.page}>
      <div style={{ ...styles.card, maxWidth: 560 }}>
        <h2 style={styles.sectionTitle}>⚙️ Configure Session</h2>

        <label style={styles.label}>Company</label>
        <div style={styles.chipRow}>
          {COMPANIES.map(c => (
            <button key={c} style={company === c ? styles.chipActive : styles.chip} onClick={() => setCompany(c)}>{c}</button>
          ))}
        </div>

        <label style={styles.label}>Topic</label>
        <div style={styles.chipRow}>
          {TOPICS.map(t => (
            <button key={t.id} style={topic.id === t.id ? styles.chipActive : styles.chip} onClick={() => setTopic(t)}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        <label style={styles.label}>Difficulty</label>
        <div style={styles.chipRow}>
          {DIFFICULTIES.map(d => (
            <button key={d} style={difficulty === d ? styles.chipActive : styles.chip} onClick={() => setDifficulty(d)}>{d}</button>
          ))}
        </div>

        <label style={styles.label}>Number of Questions</label>
        <div style={styles.chipRow}>
          {[3, 5, 7, 10].map(n => (
            <button key={n} style={numQuestions === n ? styles.chipActive : styles.chip} onClick={() => setNumQuestions(n)}>{n}</button>
          ))}
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
          <button style={{ ...styles.btn, flex: 1, background: "#111", border: "1px solid #333" }} onClick={() => setScreen("home")}>← Back</button>
          <button style={{ ...styles.btn, flex: 2 }} onClick={startSession}>Begin Session →</button>
        </div>
      </div>
    </div>
  );

  if (screen === "question") return (
    <div style={styles.page}>
      <div style={{ ...styles.card, maxWidth: 640 }}>
        <div style={styles.progressBar}>
          <div style={{ ...styles.progressFill, width: `${((qIndex) / numQuestions) * 100}%` }} />
        </div>
        <div style={styles.metaRow}>
          <span style={styles.tag}>{company}</span>
          <span style={styles.tag}>{topic.icon} {topic.label}</span>
          <span style={{ ...styles.tag, color: difficulty === "Hard" ? "#FF4444" : difficulty === "Medium" ? "#FFD700" : "#00FF88" }}>{difficulty}</span>
          <span style={{ marginLeft: "auto", fontFamily: "'Space Mono', monospace", color: timer < 30 ? "#FF4444" : "#00C2FF", fontSize: 18, fontWeight: 700 }}>
            ⏱ {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, "0")}
          </span>
        </div>

        <div style={styles.qCounter}>Q{qIndex + 1} / {numQuestions}</div>

        {loading ? (
          <div style={styles.loadingBox}>
            <div style={styles.spinner} />
            <p style={{ color: "#888", marginTop: 12 }}>Generating question...</p>
          </div>
        ) : currentQ && (
          <>
            <div style={styles.questionBox}>
              <p style={styles.questionText}>{currentQ.question}</p>
              {currentQ.context && <p style={styles.contextText}>{currentQ.context}</p>}
            </div>

            {showHint && <div style={styles.hintBox}>💡 {hint}</div>}

            <textarea
              style={styles.textarea}
              placeholder="Type your answer here..."
              value={answer}
              onChange={e => setAnswer(e.target.value)}
              rows={6}
            />

            <div style={{ display: "flex", gap: 10 }}>
              <button style={{ ...styles.btnSm, flex: 1 }} onClick={getHint} disabled={hintLoading || showHint}>
                {hintLoading ? "..." : "💡 Hint"}
              </button>
              <button style={{ ...styles.btn, flex: 3 }} onClick={submitAnswer} disabled={loading}>
                Submit Answer →
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );

  if (screen === "feedback") return (
    <div style={styles.page}>
      <div style={{ ...styles.card, maxWidth: 640 }}>
        <h2 style={styles.sectionTitle}>📊 Feedback</h2>

        {loading ? (
          <div style={styles.loadingBox}><div style={styles.spinner} /></div>
        ) : feedback && (
          <>
            <div style={styles.scoreRow}>
              <div style={styles.scoreBig}>{feedback.score}<span style={{ fontSize: 18 }}>/10</span></div>
              <GradeChip score={feedback.score} />
            </div>
            <p style={{ color: "#aaa", textAlign: "center", marginBottom: 20 }}>{feedback.verdict}</p>

            <div style={styles.feedSection}>
              <h3 style={{ color: "#00FF88", marginBottom: 8 }}>✅ Strengths</h3>
              {feedback.strengths?.map((s, i) => <p key={i} style={styles.feedItem}>• {s}</p>)}
            </div>

            <div style={styles.feedSection}>
              <h3 style={{ color: "#FF6B35", marginBottom: 8 }}>🔧 Improvements</h3>
              {feedback.improvements?.map((s, i) => <p key={i} style={styles.feedItem}>• {s}</p>)}
            </div>

            <div style={{ ...styles.feedSection, background: "#0a1f1a", borderColor: "#00FF8833" }}>
              <h3 style={{ color: "#00C2FF", marginBottom: 8 }}>🏆 FAANG Ideal Answer</h3>
              <p style={{ color: "#ccc", lineHeight: 1.7 }}>{feedback.ideal_answer}</p>
            </div>

            <button style={styles.btn} onClick={nextQuestion}>
              {qIndex + 1 >= numQuestions ? "View Report 📊" : "Next Question →"}
            </button>
          </>
        )}
      </div>
    </div>
  );

  if (screen === "report") return (
    <div style={styles.page}>
      <div style={{ ...styles.card, maxWidth: 680 }}>
        <h2 style={styles.sectionTitle}>🏆 Session Report</h2>
        <div style={styles.scoreRow}>
          <div style={styles.scoreBig}>{avgScore}<span style={{ fontSize: 18 }}>/10</span></div>
          <GradeChip score={Number(avgScore)} />
        </div>
        <p style={{ color: "#aaa", textAlign: "center", marginBottom: 24 }}>
          {session.length} questions · {company} · {topic.label}
        </p>

        {session.map((q, i) => (
          <div key={i} style={styles.reportCard}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <span style={{ color: "#888", fontSize: 13 }}>Q{i + 1} · {q.topic}</span>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span style={{ color: "#00C2FF", fontFamily: "'Space Mono', monospace" }}>{q.score}/10</span>
                <GradeChip score={q.score} />
              </div>
            </div>
            <p style={{ color: "#fff", marginBottom: 6, fontWeight: 600 }}>{q.question}</p>
            <p style={{ color: "#888", fontSize: 13 }}>Your answer: {q.answer || "(none)"}</p>
          </div>
        ))}

        <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
          <button style={{ ...styles.btn, flex: 1, background: "#111", border: "1px solid #333" }} onClick={resetAll}>← Home</button>
          <button style={{ ...styles.btn, flex: 1 }} onClick={() => { setQIndex(0); setSession([]); setScreen("setup"); }}>New Session →</button>
        </div>
      </div>
    </div>
  );
}

// ── STYLES ────────────────────────────────────────────────────────────────────
const styles = {
  page: {
    minHeight: "100vh", background: "#050a0f",
    display: "flex", alignItems: "center", justifyContent: "center",
    padding: "24px 16px", fontFamily: "'Syne', 'Space Mono', sans-serif"
  },
  card: {
    background: "#0d1117", border: "1px solid #1a2332",
    borderRadius: 20, padding: "36px 32px", width: "100%", maxWidth: 480,
    boxShadow: "0 0 60px #00FF8811"
  },
  logo: { fontSize: 48, textAlign: "center", marginBottom: 8 },
  title: { color: "#fff", fontSize: 32, fontWeight: 800, textAlign: "center", margin: 0 },
  sub: { color: "#00C2FF", textAlign: "center", marginBottom: 24, fontSize: 15 },
  sectionTitle: { color: "#fff", fontSize: 22, fontWeight: 700, marginBottom: 20 },
  label: { color: "#888", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 8, marginTop: 16 },
  input: {
    width: "100%", background: "#111", border: "1px solid #222", borderRadius: 10,
    color: "#fff", padding: "12px 16px", fontSize: 15, marginBottom: 12,
    boxSizing: "border-box", outline: "none"
  },
  btn: {
    width: "100%", background: "linear-gradient(135deg, #00FF88, #00C2FF)",
    border: "none", borderRadius: 12, color: "#000", fontWeight: 800,
    fontSize: 16, padding: "14px", cursor: "pointer", marginTop: 8,
    fontFamily: "inherit", transition: "opacity 0.2s"
  },
  btnSm: {
    background: "#111", border: "1px solid #333", borderRadius: 10,
    color: "#aaa", fontWeight: 600, fontSize: 14, padding: "10px 16px",
    cursor: "pointer", fontFamily: "inherit"
  },
  tag: {
    background: "#111", border: "1px solid #222", borderRadius: 20,
    color: "#00C2FF", fontSize: 12, padding: "4px 12px", fontWeight: 600
  },
  chipRow: { display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 4 },
  chip: {
    background: "#111", border: "1px solid #222", borderRadius: 20,
    color: "#888", fontSize: 13, padding: "6px 14px", cursor: "pointer", fontFamily: "inherit"
  },
  chipActive: {
    background: "#00FF8820", border: "1.5px solid #00FF88", borderRadius: 20,
    color: "#00FF88", fontSize: 13, padding: "6px 14px", cursor: "pointer", fontWeight: 700, fontFamily: "inherit"
  },
  progressBar: { height: 4, background: "#111", borderRadius: 4, marginBottom: 20, overflow: "hidden" },
  progressFill: { height: "100%", background: "linear-gradient(90deg, #00FF88, #00C2FF)", borderRadius: 4, transition: "width 0.5s" },
  metaRow: { display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center", marginBottom: 16 },
  qCounter: { color: "#555", fontSize: 13, marginBottom: 16, fontFamily: "'Space Mono', monospace" },
  questionBox: {
    background: "#080e14", border: "1px solid #1a2332", borderRadius: 14,
    padding: "20px 22px", marginBottom: 16
  },
  questionText: { color: "#f0f6ff", fontSize: 17, lineHeight: 1.7, margin: 0 },
  contextText: { color: "#666", fontSize: 13, marginTop: 10, marginBottom: 0 },
  hintBox: {
    background: "#1a1500", border: "1px solid #FFD70033", borderRadius: 10,
    color: "#FFD700", padding: "12px 16px", marginBottom: 12, fontSize: 14
  },
  textarea: {
    width: "100%", background: "#080e14", border: "1px solid #1a2332",
    borderRadius: 12, color: "#fff", padding: "14px 16px", fontSize: 14,
    resize: "vertical", marginBottom: 12, boxSizing: "border-box",
    fontFamily: "inherit", lineHeight: 1.6, outline: "none"
  },
  loadingBox: { display: "flex", flexDirection: "column", alignItems: "center", padding: "40px 0" },
  spinner: {
    width: 36, height: 36, border: "3px solid #111",
    borderTop: "3px solid #00FF88", borderRadius: "50%",
    animation: "spin 0.8s linear infinite"
  },
  scoreRow: { display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginBottom: 8 },
  scoreBig: { color: "#00FF88", fontSize: 52, fontWeight: 900, fontFamily: "'Space Mono', monospace" },
  feedSection: {
    background: "#080e14", border: "1px solid #1a2332", borderRadius: 12,
    padding: "16px", marginBottom: 12
  },
  feedItem: { color: "#ccc", marginBottom: 6, lineHeight: 1.6 },
  reportCard: {
    background: "#080e14", border: "1px solid #1a2332", borderRadius: 12,
    padding: "16px", marginBottom: 10
  }
};
