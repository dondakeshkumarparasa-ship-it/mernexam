const axios = require('axios');

/**
 * Universal AI Service
 * Autodetects key formats to seamlessly route queries across:
 * 1. Google Gemini (starts with 'AIzaSy') -> gemini-1.5-flash
 * 2. OpenRouter (starts with 'sk-or-') -> deepseek/deepseek-chat
 * 3. OpenAI / ChatGPT (starts with 'sk-') -> gpt-4o-mini
 */
exports.generateQuestion = async (category, difficulty) => {
  const apiKey = process.env.AI_API_KEY || process.env.GEMINI_API_KEY || process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey.includes('YOUR_')) {
    console.log("Universal AI Key not configured or contains placeholder.");
    return null;
  }

  // Construct structured competitive exam question prompt
  const promptText = `Generate exactly ONE highly realistic, verified previous year question (PYQ) pattern from Indian competitive government exams (like UPSC CSAT, SSC CGL, RRB NTPC, or SBI PO) matching these constraints:
- Category: ${category}
- Difficulty level: ${difficulty}
- No trivia or entertainment. Academic, logical, and technical government exam preparation ONLY.
- Return absolutely clean JSON and NOTHING else. No markdown wrapping, no backticks. It must be directly parseable as a valid JSON object.

JSON Schema format:
{
  "id": "${2000 + Math.floor(Math.random() * 99999)}",
  "category": "${category}",
  "tag": "Subtopic name (e.g. Percentage, Blood Relations)",
  "question": "Complete concise question text.",
  "options": ["Option A text", "Option B text", "Option C text", "Option D text"],
  "correctOptionIndex": 0-3 numerical index of correct option,
  "explanation": "Deeply detailed verified explanation of correct answer logic.",
  "concept": "Core syllabus concept focus.",
  "shortcut": "Shortcut formula or fast exam solving method if applicable, otherwise brief hint.",
  "source": "Specific Government exam name and year (e.g. UPSC CSAT 2022, SSC CGL 2023)",
  "difficulty": "${difficulty}",
  "takeaway": "Key visual takeaway to lock in long-term retention."
}`;

  // Autodetect Provider based on Key Signatures
  if (apiKey.startsWith('AIzaSy')) {
    console.log("Autodetected Google Gemini API Key. Routing to Gemini 1.5 Flash...");
    return await queryGemini(apiKey, promptText);
  } else if (apiKey.startsWith('sk-or-')) {
    console.log("Autodetected OpenRouter API Key. Routing to DeepSeek Chat...");
    return await queryOpenRouter(apiKey, promptText);
  } else if (apiKey.startsWith('sk-')) {
    console.log("Autodetected OpenAI ChatGPT API Key. Routing to GPT-4o-Mini...");
    return await queryOpenAI(apiKey, promptText);
  } else {
    // Attempt fallback to Gemini if signature is custom but provider is manually set in .env
    const provider = (process.env.AI_PROVIDER || '').toLowerCase();
    if (provider === 'openai' || provider === 'chatgpt') {
      return await queryOpenAI(apiKey, promptText);
    } else if (provider === 'openrouter') {
      return await queryOpenRouter(apiKey, promptText);
    } else {
      return await queryGemini(apiKey, promptText);
    }
  }
};

// 1. Google Gemini 1.5 Flash Connector
async function queryGemini(apiKey, promptText) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  try {
    const response = await axios.post(url, {
      contents: [{ parts: [{ text: promptText }] }],
      generationConfig: { responseMimeType: "application/json" }
    }, { timeout: 8000 });

    if (response.data && response.data.candidates && response.data.candidates[0].content.parts[0].text) {
      const jsonString = response.data.candidates[0].content.parts[0].text.trim();
      return JSON.parse(jsonString);
    }
  } catch (error) {
    console.error("Gemini query failed:", error.message);
  }
  return null;
}

// 2. OpenRouter (DeepSeek) Connector
async function queryOpenRouter(apiKey, promptText) {
  const url = "https://openrouter.ai/api/v1/chat/completions";
  const model = process.env.AI_MODEL || "deepseek/deepseek-chat";
  try {
    const response = await axios.post(url, {
      model: model,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: "You are a professional government exam compiler that strictly outputs clean, structured JSON schemas." },
        { role: "user", content: promptText }
      ]
    }, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": "https://exampulse.ai",
        "X-Title": "ExamPulse AI"
      },
      timeout: 10000
    });

    if (response.data && response.data.choices && response.data.choices[0].message.content) {
      const jsonString = response.data.choices[0].message.content.trim();
      return JSON.parse(jsonString);
    }
  } catch (error) {
    console.error("OpenRouter query failed:", error.message);
  }
  return null;
}

// 3. OpenAI ChatGPT (GPT-4o-Mini) Connector
async function queryOpenAI(apiKey, promptText) {
  const url = "https://api.openai.com/v1/chat/completions";
  const model = process.env.AI_MODEL || "gpt-4o-mini";
  try {
    const response = await axios.post(url, {
      model: model,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: "You are a professional government exam compiler that strictly outputs clean, structured JSON schemas." },
        { role: "user", content: promptText }
      ]
    }, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      timeout: 10000
    });

    if (response.data && response.data.choices && response.data.choices[0].message.content) {
      const jsonString = response.data.choices[0].message.content.trim();
      return JSON.parse(jsonString);
    }
  } catch (error) {
    console.error("OpenAI query failed:", error.message);
  }
  return null;
}
