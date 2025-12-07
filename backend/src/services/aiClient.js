const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

const topics = [
  "artificial intelligence",
  "web development",
  "cloud computing",
  "cybersecurity",
  "machine learning",
  "blockchain technology",
  "remote work productivity",
  "software architecture",
  "mobile app development",
  "data science",
  "DevOps practices",
  "API design",
  "database optimization",
  "frontend frameworks",
  "backend technologies",
];

const MAX_RETRIES = 3;
const model = "llama-3.3-70b-versatile";

export function getModelName() {
  return model;
}

export async function tryGenerateArticle(topic) {
  const response = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      //llama-3.1-8b-instant
      //llama-3.1-70b-versatile
      //llama-3.3-70b-versatile
      model: model,
      messages: [
        {
          role: "system",
          content: `You generate blog articles as JSON. Rules:
1. Output ONLY valid JSON, no other text
2. Use this exact format: {"title": "string", "content": "string", "tags": ["string"]}
3. No newlines inside strings - write content as one continuous string
4. Include 3-5 tags
5. Content should be 2-3 paragraphs, separated by spaces`,
        },
        {
          role: "user",
          content: `Generate a blog article about: ${topic}`,
        },
      ],
      max_tokens: 1024,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Groq API error: ${error}`);
  }

  const data = await response.json();
  const rawData = data.choices[0].message.content;

  let cleanedData = rawData.trim();
  if (cleanedData.startsWith("```")) {
    cleanedData = cleanedData
      .replace(/^```(?:json)?\n?/, "")
      .replace(/\n?```$/, "");
  }
  cleanedData = cleanedData.replace(/[\x00-\x1F\x7F]/g, " ");

  const jsonData = JSON.parse(cleanedData);

  if (!jsonData.title || !jsonData.content) {
    throw new Error(`Invalid article: missing title or content`);
  }

  if (!Array.isArray(jsonData.tags)) {
    jsonData.tags = [];
  }

  return jsonData;
}

export async function generateArticle() {
  const topic = topics[Math.floor(Math.random() * topics.length)];

  let lastError;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const result = await tryGenerateArticle(topic);
      return result;
    } catch (error) {
      lastError = error;
      console.log(`Attempt ${attempt}/${MAX_RETRIES} failed: ${error.message}`);
      if (attempt < MAX_RETRIES) {
        console.log(`Retrying...`);
      }
    }
  }

  throw new Error(
    `Failed after ${MAX_RETRIES} attempts. Last error: ${lastError.message}`
  );
}
