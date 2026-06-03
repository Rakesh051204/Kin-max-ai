import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { question, answer } = req.body;

  try {
    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: `
Question: ${question}
Answer: ${answer}
Give feedback and score out of 10.
`
    });

    res.status(200).json({
      text: response.output_text
    });

  } catch (err) {
    res.status(500).json({
      error: "AI request failed"
    });
  }
}
