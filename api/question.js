import OpenAI from "openai";

export default async function handler(req, res) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: "Missing OPENAI_API_KEY"
      });
    }

    const client = new OpenAI({
      apiKey
    });

    const response = await client.responses.create({
      model: "gpt-4o-mini",
      input: "Give ONE simple data science or machine learning interview question"
    });

    return res.status(200).json({
      text: response.output_text
    });

  } catch (err) {
    console.error("QUESTION API ERROR:", err);

    return res.status(500).json({
      error: err.message
    });
  }
}
