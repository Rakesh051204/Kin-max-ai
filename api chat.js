export default async function handler(req, res) {
  const { message } = req.body;

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      input: `
You are a FAANG interview AI.

User message: ${message}

Rules:
- If user starts → ask interview question
- If user answers → give score out of 10 + feedback
- Then ask next question

Keep response short.
      `,
    }),
  });

  const data = await response.json();

  res.status(200).json({
    text: data.output_text,
  });
}
