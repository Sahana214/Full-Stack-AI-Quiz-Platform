import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("Missing GEMINI_API_KEY in environment variables");
}

const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function generateOpenEndedQnA(amount: number, topic: string) {
  const prompt = `
    Generate ${amount} open-ended questions about "${topic}".
    For each question, also provide a clear and concise answer.
    Return the result as JSON array in the format:
    [
      { "question": "Question text", "answer": "answer with max length of 15 words" }
    ]
  `;

  const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  const cleaned = text.replace(/```json|```/g, "").trim();
  return JSON.parse(cleaned);
}

export async function generateMCQs(amount: number, topic: string) {
  const prompt = `
    Generate ${amount} multiple-choice questions about "${topic}".
    Each question should have 4 options (A, B, C, D).
    Clearly indicate the correct answer and provide a short explanation.
    Return the result as JSON array in the format:
    [
     {
        "question": "Question text",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correctAnswer": "Option X",
        "explanation": "Why this is the correct answer"
      }
    ]
  `;

  const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });

  const result = await model.generateContent(prompt);
  const text = result.response.text();


  const cleaned = text.replace(/```json|```/g, "").trim();

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    console.error("Failed to parse Gemini response:", text);
    throw new Error("Gemini returned invalid JSON");
  }
}
