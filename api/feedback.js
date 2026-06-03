import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { question, answer } = req.body;

  if (!question || !answer) {
    return res.status(400).json({ error: "Missing question or answer" });
  }

  try {
    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: `
You are an AI interview evaluator.

Question: ${question}
Candidate Answer: ${answer}

Give:
1. Score out of 10
2. Short feedback
3. Improvement tips
`
    });

    res.status(200).json({
      text: response.output_text
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "AI request failed"
    });
  }
}
