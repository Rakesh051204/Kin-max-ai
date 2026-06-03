export default async function handler(req, res) {
  try {
    const { question, answer } = req.body;

    const apiKey = process.env.OPENAI_API_KEY;

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        input: `
You are a FAANG interview evaluator.

Question: ${question}
Answer: ${answer}

Return STRICT JSON in this format:
{
  "score": number out of 10,
  "strengths": "short points",
  "weaknesses": "short points",
  "improvements": "short advice"
}
        `,
      }),
    });

    const data = await response.json();

    const text =
      data.output_text ||
      data.output?.[0]?.content?.[0]?.text ||
      "No response";

    res.status(200).json({ text });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
