import axios from "axios";

const API_KEY = "AIzaSyD6w_XP-eye70GgfkXPjP2AdMHmc6w-CP8"; 
const BASE_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

export async function generateQuizFromText(docText, numQuestions = 10) {
  try {
    let contents = [];
    let prompt = "";

    // Check if it's a file object (from document upload)
    if (typeof docText === 'object' && docText.base64Data) {
      // File upload - use multimodal content
      contents = [
        {
          parts: [
            {
              text: generateFilePrompt(numQuestions)
            },
            {
              inline_data: {
                mime_type: docText.mimeType,
                data: docText.base64Data
              }
            }
          ]
        }
      ];
    } else {
      // Text input - check if it has structured data (topic, type, difficulty)
      const structuredData = parseStructuredText(docText);
      
      if (structuredData) {
        prompt = generateStructuredPrompt(structuredData, numQuestions);
      } else {
        prompt = generateBasicPrompt(docText, numQuestions);
      }

      contents = [
        {
          parts: [{ text: prompt }]
        }
      ];
    }

    const response = await axios.post(BASE_URL, {
      contents: contents,
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192,
      }
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
        parsed.quiz = parsed.quiz.map((q, index) => ({
          question: q.question || `Question ${index + 1} about the content`,
          options: q.options || ["A) Option A", "B) Option B", "C) Option C", "D) Option D"],
          answer: q.answer || "A"
        }));
      }
    } catch (err) {
      console.error("JSON parse error:", err);
      // Fallback questions
      parsed.quiz = generateFallbackQuiz(numQuestions);
    }

    return parsed.quiz.slice(0, numQuestions);
  } catch (error) {
    console.error("Error generating quiz:", error);
    
    if (error.response?.data?.error) {
      const geminiError = error.response.data.error.message;
      if (geminiError.includes("file") || geminiError.includes("document")) {
        throw new Error("Gemini couldn't process the document. Please try a text file or paste the content directly.");
      }
    }
    
    throw new Error("Failed to generate quiz. Please try again.");
  }
}

// Helper function to parse structured text input
function parseStructuredText(text) {
  const lines = text.split('\n');
  const topicMatch = text.match(/TOPIC:\s*(.+)/i);
  const typeMatch = text.match(/QUIZ TYPE:\s*(.+)/i);
  const difficultyMatch = text.match(/DIFFICULTY:\s*(.+)/i);
  const contentMatch = text.match(/CONTENT:\s*([\s\S]*)/i);

  if (topicMatch && contentMatch) {
    return {
      topic: topicMatch[1].trim(),
      quizType: typeMatch ? typeMatch[1].trim() : 'comprehensive',
      difficulty: difficultyMatch ? difficultyMatch[1].trim() : 'medium',
      content: contentMatch[1].trim()
    };
  }
  return null;
}

// Generate prompt for structured input
function generateStructuredPrompt(data, numQuestions) {
  const { topic, quizType, difficulty, content } = data;
  
  return `Create a ${numQuestions}-question multiple-choice quiz about "${topic}".

QUIZ SPECIFICATIONS:
- Type: ${quizType} quiz
- Difficulty: ${difficulty} level
- Questions should test understanding of the specific content provided
- Focus on key concepts, facts, and applications mentioned
- Make questions challenging but fair

CONTENT TO BASE QUESTIONS ON:
${content}

QUESTION REQUIREMENTS:
- ${numQuestions} questions total
- 4 options per question (A, B, C, D)
- Only one correct answer per question
- Options should be plausible but distinct
- Questions should cover different aspects of the content
- Include conceptual, factual, and application questions

RESPONSE FORMAT (JSON only):
{
  "quiz": [
    {
      "question": "Clear question based on the content",
      "options": ["A) Option 1", "B) Option 2", "C) Option 3", "D) Option 4"],
      "answer": "A"
    }
  ]
}

Ensure questions are directly based on the provided content and appropriate for ${difficulty} difficulty.`;
}

// Generate prompt for basic text input
function generateBasicPrompt(text, numQuestions) {
  return `Create ${numQuestions} multiple-choice questions based on the following text. The questions should test comprehension of key concepts, facts, and details.

TEXT:
${text}

Generate ${numQuestions} questions with 4 options each. Format as JSON:
{
  "quiz": [
    {
      "question": "Question text",
      "options": ["A) ...", "B) ...", "C) ...", "D) ..."],
      "answer": "A"
    }
  ]
}`;
}

// Generate prompt for file uploads
function generateFilePrompt(numQuestions) {
  return `Analyze this document and create ${numQuestions} multiple-choice questions that test understanding of the key content.

Generate questions that cover:
- Main concepts and ideas
- Important facts and details
- Practical applications
- Relationships between concepts

Create ${numQuestions} questions with 4 options each. Format as JSON:
{
  "quiz": [
    {
      "question": "Question based on document content",
      "options": ["A) Option 1", "B) Option 2", "C) Option 3", "D) Option 4"],
      "answer": "A"
    }
  ]
}`;
}

// Fallback quiz generator
function generateFallbackQuiz(numQuestions) {
  return Array.from({ length: numQuestions }, (_, i) => ({
    question: `Question ${i + 1} based on the provided content`,
    options: [
      "A) Key concept from the content",
      "B) Related information", 
      "C) Correct detail from the content",
      "D) Additional aspect"
    ],
    answer: "C"
  }));
}