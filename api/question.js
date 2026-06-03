export default async function handler(req, res) {
  const { mode } = req.body;
  export default async function handler(req, res) {
  return res.status(200).json({
    text: "What is overfitting in machine learning?"
  });
}

  const prompt = `
You are a FAANG interviewer.

Company: ${mode || "FAANG"}

Ask ONE challenging interview question for a software/data science role.
`;

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      input: prompt,
    }),
  });

  const data = await response.json();

  res.status(200).json({
    text: data.output_text,
  });
}
