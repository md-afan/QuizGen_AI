import { useState } from "react";
import DocumentUpload from "./components/DocumentUpload.jsx";
import TextInput from "./components/TextInput.jsx";
import QuizGenerator from "./components/QuizGenerator.jsx";
import QuizPlayer from "./components/QuizPlayer.jsx";
import QuizResults from "./components/QuizResults.jsx";
import { Brain, Upload, FileText, Code, Star } from "lucide-react";

function App() {
  const [docText, setDocText] = useState("");
  const [quiz, setQuiz] = useState([]);
  const [quizResults, setQuizResults] = useState(null);
  const [numQuestions, setNumQuestions] = useState(5);
  const [activeTab, setActiveTab] = useState("upload");
  const [currentView, setCurrentView] = useState("home"); // "home", "quiz"

  const handleQuizComplete = (results) => {
    const resultsWithPercentage = {
      ...results,
      percentage: Math.round((results.score / results.total) * 100)
    };
    setQuizResults(resultsWithPercentage);
  };

  const handleNewQuiz = () => {
    setQuiz([]);
    setQuizResults(null);
    setDocText("");
    setCurrentView("home");
  };

  const handleStartQuiz = () => {
    setCurrentView("quiz");
  };

  // Homepage View
  if (currentView === "home") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-xl">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    QuizGen AI
                  </h1>
                  <p className="text-sm text-gray-600">Powered by Gemini 2.0 Flash</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Developed by</p>
                <p className="font-semibold text-blue-600">MD AFAN</p>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="max-w-6xl mx-auto px-4 py-12 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Star className="w-4 h-4" />
              AI-Powered Quiz Generator
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Transform Your Content into
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> Interactive Quizzes</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Upload documents or paste text to instantly generate intelligent quizzes using Google's Gemini 2.0 Flash AI. 
              Perfect for educators, students, and content creators.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button
                onClick={() => { setActiveTab("upload"); handleStartQuiz(); }}
                className="flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Upload className="w-5 h-5" />
                Upload Document
              </button>
              <button
                onClick={() => { setActiveTab("text"); handleStartQuiz(); }}
                className="flex items-center gap-3 bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 px-8 py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <FileText className="w-5 h-5" />
                Paste Text
              </button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-100">
              <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Upload className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Upload</h3>
              <p className="text-gray-600">Upload TXT documents or paste text directly</p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-100">
              <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Powered</h3>
              <p className="text-gray-600">Gemini 2.0 Flash generates relevant questions</p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-100">
              <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Code className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Instant Results</h3>
              <p className="text-gray-600">Get detailed analytics and performance metrics</p>
            </div>
          </div>

          {/* Technology Stack */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-center mb-6">Technology Stack</h3>
            <div className="flex flex-wrap justify-center gap-6">
              <div className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-2">
                  <span className="text-2xl">⚛️</span>
                </div>
                <p className="font-semibold">React + Vite</p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-2">
                  <span className="text-2xl">🎨</span>
                </div>
                <p className="font-semibold">Tailwind CSS</p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-2">
                  <span className="text-2xl">🤖</span>
                </div>
                <p className="font-semibold">Gemini 2.0 Flash</p>
              </div>
              <div className="text-center">
                <div className="bg-orange-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-2">
                  <span className="text-2xl">⚡</span>
                </div>
                <p className="font-semibold">Fast Generation</p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-white/80 backdrop-blur-sm border-t border-gray-200 mt-16">
          <div className="max-w-6xl mx-auto px-4 py-8 text-center">
            <p className="text-gray-600">
              Developed with ❤️ by <span className="font-semibold text-blue-600">MD AFAN</span>
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Powered by Google Gemini 2.0 Flash AI • Quiz Generation Platform
            </p>
          </div>
        </footer>
      </div>
    );
  }

  // Quiz Creation View
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={handleNewQuiz}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold"
          >
            ← Back to Home
          </button>
          <div className="text-right">
            <h1 className="text-2xl font-bold text-gray-900">QuizGen AI</h1>
            <p className="text-sm text-gray-600">by MD AFAN • Gemini 2.0 Flash</p>
          </div>
        </div>

        {!docText && (
          <div className="mb-6">
            <div className="flex border-b border-gray-200">
              <button
                className={`flex items-center gap-2 px-4 py-2 font-medium ${
                  activeTab === "upload"
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab("upload")}
              >
                <Upload className="w-4 h-4" />
                Upload Document
              </button>
              <button
                className={`flex items-center gap-2 px-4 py-2 font-medium ${
                  activeTab === "text"
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab("text")}
              >
                <FileText className="w-4 h-4" />
                Paste Text
              </button>
            </div>
            
            <div className="p-6 bg-white rounded-b-2xl shadow-md">
              {activeTab === "upload" ? (
                <DocumentUpload onTextExtracted={setDocText} />
              ) : (
                <TextInput onTextExtracted={setDocText} />
              )}
            </div>
          </div>
        )}

        {docText && !quiz.length && !quizResults && (
          <div className="p-6 bg-white rounded-2xl shadow-md mb-6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Questions: {numQuestions}
              </label>
              <input
                type="range"
                min="3"
                max="10"
                value={numQuestions}
                onChange={(e) => setNumQuestions(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>3</span>
                <span>5</span>
                <span>7</span>
                <span>10</span>
              </div>
            </div>
            <QuizGenerator 
              docText={docText} 
              onQuizReady={setQuiz} 
              numQuestions={numQuestions}
            />
            <button
              onClick={() => setDocText("")}
              className="mt-3 px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              ← Back
            </button>
          </div>
        )}

        {quiz.length > 0 && !quizResults && (
          <QuizPlayer quiz={quiz} onQuizComplete={handleQuizComplete} />
        )}

        {quizResults && (
          <QuizResults 
            results={quizResults} 
            onNewQuiz={handleNewQuiz}
            quiz={quiz}
          />
        )}
      </div>
    </div>
  );
}

export default App;