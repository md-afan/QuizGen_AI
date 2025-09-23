import { useState } from "react";
import { FileText, Lightbulb, Target, Zap } from "lucide-react";

export default function TextInput({ onTextExtracted }) {
  const [text, setText] = useState("");
  const [topic, setTopic] = useState("");
  const [quizType, setQuizType] = useState("comprehensive");
  const [difficulty, setDifficulty] = useState("medium");

  const handleSubmit = () => {
    if (text.trim().length >= 10 && topic.trim().length >= 2) {
      // Combine topic and text for better prompt
      const enhancedText = `TOPIC: ${topic}\nQUIZ TYPE: ${quizType}\nDIFFICULTY: ${difficulty}\nCONTENT:\n${text.trim()}`;
      onTextExtracted(enhancedText);
    } else {
      alert("Please enter at least 10 characters of text and a topic name.");
    }
  };

  const isFormValid = text.trim().length >= 10 && topic.trim().length >= 2;

  // Auto-detect topic from text if possible
  const handleTextChange = (newText) => {
    setText(newText);
    if (!topic && newText.length > 50) {
      // Try to extract a topic from the first few sentences
      const firstSentence = newText.split('.')[0];
      if (firstSentence.length > 10 && firstSentence.length < 50) {
        setTopic(firstSentence.replace(/[^a-zA-Z0-9 ]/g, '').trim());
      }
    }
  };

  const quizTypes = [
    { id: "comprehensive", name: "Comprehensive", desc: "Covers all aspects of the topic" },
    { id: "conceptual", name: "Conceptual", desc: "Focuses on understanding concepts" },
    { id: "detailed", name: "Detailed", desc: "Tests specific facts and details" },
    { id: "application", name: "Application", desc: "Practical application questions" }
  ];

  const difficulties = [
    { id: "easy", name: "Easy", desc: "Basic understanding" },
    { id: "medium", name: "Medium", desc: "Moderate challenge" },
    { id: "hard", name: "Hard", desc: "Advanced questions" },
    { id: "expert", name: "Expert", desc: "In-depth knowledge" }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
          <FileText className="w-5 h-5 text-green-600" />
          Create Custom Quiz
        </h2>
        <p className="text-gray-600 mb-4">
          Enter a topic and content to generate a targeted quiz. The AI will create relevant questions based on your input.
        </p>
      </div>

      {/* Topic Input */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
          <Target className="w-4 h-4" />
          Quiz Topic *
        </label>
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter the main topic (e.g., 'Python Programming', 'World War II', 'Photosynthesis')"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
        <p className="text-xs text-gray-500">This helps AI generate more focused questions</p>
      </div>

      {/* Quiz Configuration */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quiz Type
          </label>
          <select
            value={quizType}
            onChange={(e) => setQuizType(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          >
            {quizTypes.map(type => (
              <option key={type.id} value={type.id}>
                {type.name} - {type.desc}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Difficulty Level
          </label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          >
            {difficulties.map(diff => (
              <option key={diff.id} value={diff.id}>
                {diff.name} - {diff.desc}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Content Textarea */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
          <Lightbulb className="w-4 h-4" />
          Content for Quiz Generation *
        </label>
        <textarea
          value={text}
          onChange={(e) => handleTextChange(e.target.value)}
          placeholder="Paste or type the content you want to be quizzed on. Include key concepts, facts, and details. The AI will generate questions based on this content.

Examples:
- Programming concepts with code examples
- Historical events with dates and significance
- Scientific theories with explanations
- Book summaries with character details"
          className="w-full h-48 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-700"
          rows={8}
        />
        <div className="flex justify-between items-center">
          <span className={`text-sm ${text.length < 10 ? 'text-red-500' : 'text-green-600'}`}>
            {text.length} characters {text.length < 10 ? '(minimum 10)' : '(✓ ready)'}
          </span>
          <span className={`text-sm ${topic.length < 2 ? 'text-red-500' : 'text-green-600'}`}>
            Topic: {topic || 'Not set'}
          </span>
        </div>
      </div>

      {/* Quick Tips */}
      <div className="p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
          <Zap className="w-4 h-4" />
          Tips for Better Quizzes:
        </h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Include specific facts, dates, names, or technical terms</li>
          <li>• Provide clear explanations of concepts</li>
          <li>• Mention relationships between ideas</li>
          <li>• Include examples and counter-examples</li>
          <li>• The more detailed your content, the better the questions</li>
        </ul>
      </div>

      {/* Submit Button */}
      <div className="flex justify-between items-center mt-3">
        <div>
          {!isFormValid && (
            <p className="text-red-500 text-sm">
              Please enter a topic and at least 10 characters of content
            </p>
          )}
        </div>
        <button
          onClick={handleSubmit}
          disabled={!isFormValid}
          className={`px-8 py-3 rounded-lg font-semibold text-white transition-all duration-200 flex items-center gap-2 ${
            !isFormValid 
              ? "bg-gray-400 cursor-not-allowed" 
              : "bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 shadow-lg hover:shadow-xl"
          }`}
        >
          <Zap className="w-4 h-4" />
          Generate Smart Quiz
        </button>
      </div>

      {text.length > 0 && text.length < 10 && (
        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">
            ⚠️ Please enter at least 10 characters to generate a meaningful quiz.
          </p>
        </div>
      )}
    </div>
  );
}