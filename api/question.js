export default async function handler(req, res) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "Missing API key" });
    }

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        input: "Give ONE simple machine learning interview question",
      }),
    });

    const data = await response.json();

    // ✅ SAFE extraction (FIXED)
    const text =
      data.output_text ||
      data.output?.[0]?.content?.[0]?.text ||
      data.error?.message ||
      "No response from AI";

    return res.status(200).json({
      text,
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      error: err.message,
    });
  }
}
