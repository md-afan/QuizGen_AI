import { useState } from "react";
import { Sparkles, Target, BarChart3 } from "lucide-react";
import { generateQuizFromText } from "../services/geminiService";

export default function QuizGenerator({ docText, onQuizReady, numQuestions }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    const isFile = typeof docText === 'object' && docText.base64Data;
    const isValidText = typeof docText === 'string' && docText.trim().length >= 10;
    
    if (!isFile && !isValidText) {
      setError("Please provide sufficient content");
      return;
    }

    setLoading(true);
    setError("");
    
    try {
      console.log(`Generating ${numQuestions} questions...`);
      const quiz = await generateQuizFromText(docText, numQuestions);
      onQuizReady(quiz);
    } catch (err) {
      setError(err.message || "Failed to generate quiz. Please try again.");
      console.error("Quiz generation error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Extract topic if available
  const getTopicInfo = () => {
    if (typeof docText === 'string') {
      const topicMatch = docText.match(/TOPIC:\s*(.+)/i);
      return topicMatch ? topicMatch[1] : "Custom Content";
    }
    return "Document Content";
  };

  return (
    <div className="text-center space-y-4">
      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}
      
      {/* Quiz Info Card */}
      <div className="p-4 bg-blue-50 rounded-lg">
        <div className="flex items-center justify-center gap-4 mb-2">
          <Target className="w-5 h-5 text-blue-600" />
          <span className="font-semibold text-blue-800">{getTopicInfo()}</span>
          <BarChart3 className="w-5 h-5 text-blue-600" />
          <span className="font-semibold text-blue-800">{numQuestions} Questions</span>
        </div>
        <p className="text-sm text-blue-600">
          AI will generate a comprehensive quiz based on your content
        </p>
      </div>

      <button
        onClick={handleGenerate}
        disabled={loading}
        className={`px-8 py-4 rounded-xl font-semibold text-white transition-all duration-200 ${
          loading ? "bg-gray-400" : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-xl"
        }`}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            Generating {numQuestions} Smart Questions...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Generate {numQuestions} Question Quiz
          </span>
        )}
      </button>
      
      {loading && (
        <div className="space-y-2">
          <p className="text-sm text-gray-600">
            Analyzing content and creating targeted questions...
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full animate-pulse"></div>
          </div>
        </div>
      )}
    </div>
  );
}