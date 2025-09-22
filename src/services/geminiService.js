import axios from "axios";

const API_KEY = "AIzaSyD6w_XP-eye70GgfkXPjP2AdMHmc6w-CP8"; 
const BASE_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

export async function generateQuizFromText(docText, numQuestions = 5) {
  try {
    const cleanText = docText.trim();
    
    if (!cleanText || cleanText.length < 10) {
      throw new Error("Text content is too short");
    }

    console.log("Generating quiz from text (first 200 chars):", cleanText.substring(0, 200));

    const response = await axios.post(BASE_URL, {
      contents: [
        {
          parts: [
            {
              text: `You are an expert quiz generator. Create ${numQuestions} multiple-choice questions based EXACTLY on the following text.

TEXT CONTENT:
"""${cleanText}"""

INSTRUCTIONS:
- Generate ${numQuestions} questions that can be answered using ONLY the provided text
- Each question must have 4 options (A, B, C, D)
- Options should be clear and distinct
- Mark the correct answer with the letter (A, B, C, or D)
- Questions should test comprehension of the text
- Make sure answers are verifiable from the text

OUTPUT FORMAT (JSON only):
{
  "quiz": [
    {
      "question": "Question about the text",
      "options": ["A) Option 1", "B) Option 2", "C) Option 3", "D) Option 4"],
      "answer": "A"
    }
  ]
}

Return pure JSON without any additional text.`
            },
          ],
        },
      ],
    });

    let textResponse = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
    
    // Clean response
    textResponse = textResponse.replace(/```json|```/g, "").trim();
    
    const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      textResponse = jsonMatch[0];
    }

    let parsed = { quiz: [] };
    try {
      parsed = JSON.parse(textResponse);
      
      if (parsed.quiz && Array.isArray(parsed.quiz)) {
        // Validate and format questions
        parsed.quiz = parsed.quiz.map((q, index) => ({
          question: q.question || `Question ${index + 1} about the content`,
          options: q.options || ["A) Option A", "B) Option B", "C) Option C", "D) Option D"],
          answer: q.answer || "A"
        }));
      }
    } catch (err) {
      console.error("JSON parse error:", err);
      // Fallback questions
      parsed.quiz = Array.from({ length: numQuestions }, (_, i) => ({
        question: `Question ${i + 1} based on the provided content`,
        options: [
          "A) Based on the text",
          "B) Related to content", 
          "C) Correct information",
          "D) Additional details"
        ],
        answer: "A"
      }));
    }

    return parsed.quiz.slice(0, numQuestions);
  } catch (error) {
    console.error("Error generating quiz:", error);
    return Array.from({ length: numQuestions }, (_, i) => ({
      question: `Question ${i + 1} about your content`,
      options: [
        "A) Relevant option",
        "B) Alternative option",
        "C) Correct option", 
        "D) Other option"
      ],
      answer: "C"
    }));
  }
}