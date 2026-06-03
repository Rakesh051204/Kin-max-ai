const generateQuestion = async () => {
  setQuestion("");
  setAnswer("");
  setFeedback("");

  try {
    const res = await fetch("/api/question", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    });

    const data = await res.json();

    console.log("API RESPONSE:", data);

    setQuestion(data.text || "No question received");
  } catch (err) {
    setQuestion("Error generating question");
  }
};
