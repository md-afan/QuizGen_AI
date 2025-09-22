import { useState } from "react";
import { Sparkles } from "lucide-react";
import { generateQuizFromText } from "../services/geminiService";

export default function QuizGenerator({ docText, onQuizReady, numQuestions }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!docText || docText.length < 10) {
      setError("Please provide sufficient text content (at least 50 characters)");
      return;
    }

    setLoading(true);
    setError("");
    
    try {
      console.log("Generating quiz from text:", docText.substring(0, 100) + "...");
      const quiz = await generateQuizFromText(docText, numQuestions);
      console.log("Quiz generated:", quiz);
      onQuizReady(quiz);
    } catch (err) {
      setError("Failed to generate quiz. Please try again.");
      console.error("Quiz generation error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-center">
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}
      
      <button
        onClick={handleGenerate}
        disabled={loading || !docText}
        className={`px-8 py-4 rounded-xl font-semibold text-white transition 
          ${loading || !docText ? "bg-gray-400" : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:opacity-90"}
        `}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            Generating {numQuestions} Questions from Document...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Sparkles /> Generate {numQuestions} Questions from Document
          </span>
        )}
      </button>
      
      {loading && (
        <p className="mt-3 text-sm text-gray-600">
          Analyzing document content and creating questions...
        </p>
      )}
    </div>
  );
}