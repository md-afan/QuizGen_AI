import { useState } from "react";
import { FileText } from "lucide-react";

export default function TextInput({ onTextExtracted }) {
  const [text, setText] = useState("");

  const handleSubmit = () => {
    if (text.trim().length >= 10) {
      onTextExtracted(text.trim());
    } else {
      alert("Please enter at least 10 characters of text.");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
        <FileText className="w-5 h-5 text-green-600" />
        Paste Your Text
      </h2>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste your text content here (minimum 10 characters)..."
        className="w-full h-48 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
        rows={6}
      />
      <div className="flex justify-between items-center mt-3">
        <span className={`text-sm ${text.length < 10 ? 'text-red-500' : 'text-green-600'}`}>
          {text.length} characters {text.length < 10 ? '(minimum 10 required)' : '(✓ ready)'}
        </span>
        <button
          onClick={handleSubmit}
          disabled={text.length < 10}
          className={`px-6 py-3 rounded-lg font-semibold text-white transition-all duration-200 ${
            text.length < 10 
              ? "bg-gray-400 cursor-not-allowed" 
              : "bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-xl"
          }`}
        >
          Generate Quiz
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