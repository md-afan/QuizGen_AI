// src/App.jsx
import { useState, useEffect } from "react";
import {
  Brain,
  Upload,
  FileText,
  Code,
  Star,
  Zap,
  Users,
  Rocket,
  ChevronRight,
  Play,
  Github,
  Sparkles,
  File,
  Book,
} from "lucide-react";

import DocumentUpload from "./components/DocumentUpload.jsx";
import TextInput from "./components/TextInput.jsx";
import QuizGenerator from "./components/QuizGenerator.jsx";
import QuizPlayer from "./components/QuizPlayer.jsx";
import QuizResults from "./components/QuizResults.jsx";
import UserFormModal from "./components/UserFormModal";
import ConfirmationModal from "./components/ConfirmationModal";
import { HomepageAd } from "./components/AdUnits";
import profile from'./assets/profile.png';

/**
 * App.jsx
 * - Adds a DeveloperCard feature (name + image + role + contact) highlighted in Hero and Footer
 * - Keeps quiz flow: home -> quiz creation -> quiz play -> results
 * - Adds user form and confirmation modals
 */

function App() {
  const [currentView, setCurrentView] = useState("home"); // "home" | "quiz"
  const [isScrolled, setIsScrolled] = useState(false);

  // Quiz state
  const [docText, setDocText] = useState("");
  const [quiz, setQuiz] = useState([]);
  const [quizResults, setQuizResults] = useState(null);
  const [numQuestions, setNumQuestions] = useState(15);
  const [activeTab, setActiveTab] = useState("upload"); // "upload" | "text"

  // New state variables for modals
  const [userData, setUserData] = useState(null);
  const [showUserForm, setShowUserForm] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState("");

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Developer info (update image & contact as you wish)
  const developer = {
    name: "MD AFAN",
    role: "Full-Stack Developer | AI",
    image: profile,
    email: "mdafan00094@gmail.com",
    github: "https://github.com/md-afan",
    bio: "Building AI-powered learning tools and educational UIs. Passionate about accessible edtech and clean UI."
  };

  // Handle text extraction from DocumentUpload
  const handleTextExtracted = (text, fileName = "Uploaded Document") => {
    setDocText(text);
    setUploadedFileName(fileName);
    setShowUserForm(true);
  };

  // Handle text submission from TextInput
  const handleTextSubmit = (text) => {
    setDocText(text);
    setUploadedFileName("Pasted Text");
    setShowUserForm(true);
  };

  // Start quiz flow — ensures active tab is set and navigates to quiz view
  const handleStart = (tab = "upload") => {
    setActiveTab(tab);
    setCurrentView("quiz");
  };

  // Handle user form submission
  const handleUserFormSubmit = (data) => {
    setUserData(data);
    setShowUserForm(false);
    setShowConfirmation(true);
  };

  // Handle confirmation
  const handleConfirmation = () => {
    setShowConfirmation(false);
    // Proceed with quiz generation (QuizGenerator will be shown automatically)
  };

  const handleQuizComplete = (results) => {
    const resultsWithPercentage = {
      ...results,
      percentage: results.total ? Math.round((results.score / results.total) * 100) : 0,
    };
    setQuizResults(resultsWithPercentage);
  };

  const handleNewQuiz = () => {
    setDocText("");
    setQuiz([]);
    setQuizResults(null);
    setNumQuestions(15);
    setActiveTab("upload");
    setCurrentView("home");
    setUserData(null);
    setUploadedFileName("");
  };

  // HOME VIEW
  if (currentView === "home") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        {/* Navigation */}
        <nav
          className={`fixed w-full z-50 transition-all duration-300 ${
            isScrolled ? "bg-white/90 backdrop-blur-md shadow-lg" : "bg-transparent"
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-2xl shadow-lg">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    QuizGen AI
                  </h1>
                  <p className="text-xs text-gray-600">Powered by Gemini 2.0</p>
                </div>
              </div>

              <div className="hidden md:flex items-center space-x-8">
                <a href="#features" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Features</a>
                <a href="#how-it-works" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">How It Works</a>
                <a href="#technology" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Technology</a>
              </div>

              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => handleStart("upload")}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2.5 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Get Started
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-12 items-start">
              {/* Left Content (Hero text) */}
              <div className="lg:col-span-2 space-y-8">
                <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-blue-600 border border-blue-200 shadow-sm">
                  <Zap className="w-4 h-4" />
                  Advanced AI-Powered Quiz Generation
                </div>

                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Transform Documents into{" "}
                  <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                    Intelligent Quizzes
                  </span>
                </h1>

                <p className="text-xl text-gray-600 leading-relaxed">
                  Upload PDF, DOCX, or TXT files (up to 20MB) and generate up to 50 targeted questions using Google's Gemini 2.0 Flash AI.
                  Perfect for educators, students, and professional training.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    type="button"
                    onClick={() => handleStart("upload")}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-2xl hover:scale-105 flex items-center gap-3 text-lg"
                  >
                    <Play className="w-5 h-5" />
                    Start Creating Quizzes
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                {/* Ad in hero section */}
                <HomepageAd />

                {/* Updated Stats */}
                <div className="flex items-center gap-8 pt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">50</div>
                    <div className="text-sm text-gray-600">Max Questions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">20MB</div>
                    <div className="text-sm text-gray-600">File Size</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">3</div>
                    <div className="text-sm text-gray-600">Formats</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">AI</div>
                    <div className="text-sm text-gray-600">Powered</div>
                  </div>
                </div>
              </div>

              {/* Right Column: Hero Visual + Developer Card */}
              <div className="space-y-6">
                {/* Enhanced Hero visual box */}
                <div className="relative z-10 bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border border-white/20">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    </div>

                    <div className="space-y-3">
                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-2xl border border-blue-100">
                        <div className="flex items-center gap-3">
                          <File className="w-6 h-6 text-blue-600" />
                          <div>
                            <div className="text-sm text-gray-600">Multiple File Formats</div>
                            <div className="font-semibold text-gray-800">PDF, DOCX, TXT Support</div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-2xl border border-green-100">
                        <div className="flex items-center gap-3">
                          <Book className="w-6 h-6 text-green-600" />
                          <div>
                            <div className="text-sm text-gray-600">Advanced Quiz Generation</div>
                            <div className="font-semibold text-gray-800">Up to 50 Questions</div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-2xl border border-purple-100">
                        <div className="flex items-center gap-3">
                          <Star className="w-6 h-6 text-purple-600" />
                          <div>
                            <div className="text-sm text-gray-600">Large File Support</div>
                            <div className="font-semibold text-gray-800">20MB File Size Limit</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Developer Card (Highlighted) */}
                <DeveloperCard developer={developer} />
              </div>
            </div>
          </div>
        </section>

        {/* Ad after hero section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <HomepageAd />
        </div>

        {/* Updated Features Section */}
        <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Advanced Features</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Everything you need to create comprehensive, intelligent quizzes from your documents
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard 
                icon={<File className="w-7 h-7 text-white" />} 
                title="Extended File Support" 
                description="Upload PDF, DOCX, and TXT files up to 20MB. Gemini AI processes all formats seamlessly."
                badges={["PDF", "DOCX", "TXT"]}
              />
              <FeatureCard 
                icon={<Book className="w-7 h-7 text-white" />} 
                title="50 Questions Maximum" 
                description="Generate comprehensive quizzes with up to 50 targeted questions covering all aspects of your content."
                highlight="50 Qs"
              />
              <FeatureCard 
                icon={<Upload className="w-7 h-7 text-white" />} 
                title="20MB File Size" 
                description="Handle larger documents and comprehensive materials with our increased 20MB file size limit."
                highlight="20MB"
              />
              <FeatureCard 
                icon={<Brain className="w-7 h-7 text-white" />} 
                title="AI-Powered Analysis" 
                description="Gemini 2.0 Flash intelligently analyzes content to generate relevant, challenging questions."
              />
              <FeatureCard 
                icon={<Users className="w-7 h-7 text-white" />} 
                title="Smart Quiz Types" 
                description="Choose from comprehensive, conceptual, detailed, or application-based quiz formats."
              />
              <FeatureCard 
                icon={<Rocket className="w-7 h-7 text-white" />} 
                title="Professional Analytics" 
                description="Get detailed performance metrics, time tracking, and comprehensive results analysis."
              />
            </div>

            {/* Ad in features section */}
            <div className="mt-12">
              <HomepageAd />
            </div>
          </div>
        </section>

        {/* Updated How It Works */}
        <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
              <p className="text-xl text-gray-600">Create comprehensive quizzes in just three simple steps</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Step number="1" icon={<File className="w-4 h-4 text-white" />} title="Upload Document" desc="Upload PDF, DOCX, or TXT files up to 20MB. Our AI will analyze the content comprehensively." />
              <Step number="2" icon={<Brain className="w-4 h-4 text-white" />} title="AI Generates Quiz" desc="Gemini AI creates up to 50 targeted questions based on your content and preferences." />
              <Step number="3" icon={<Star className="w-4 h-4 text-white" />} title="Take & Analyze" desc="Take the interactive quiz, get instant results with detailed analytics and insights." />
            </div>
          </div>
        </section>

        {/* Updated CTA */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-white mb-4">Ready to Create Advanced Quizzes?</h2>
            <p className="text-xl text-blue-100 mb-8">Generate up to 50 questions from 20MB documents with multiple format support</p>
            
            <div className="grid md:grid-cols-3 gap-4 mb-8 max-w-2xl mx-auto">
              <div className="bg-white/20 p-4 rounded-2xl">
                <div className="text-2xl font-bold text-white">50</div>
                <div className="text-blue-100">Questions Max</div>
              </div>
              <div className="bg-white/20 p-4 rounded-2xl">
                <div className="text-2xl font-bold text-white">20MB</div>
                <div className="text-blue-100">File Size</div>
              </div>
              <div className="bg-white/20 p-4 rounded-2xl">
                <div className="text-2xl font-bold text-white">3</div>
                <div className="text-blue-100">Formats</div>
              </div>
            </div>
            
            <button
              type="button"
              onClick={() => handleStart("upload")}
              className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-semibold hover:bg-gray-100 transition-all duration-200 shadow-2xl hover:shadow-2xl hover:scale-105 flex items-center gap-3 text-lg mx-auto"
            >
              <Sparkles className="w-5 h-5" />
              Start Creating Free Quizzes
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </section>

        {/* Updated Footer */}
        <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-xl">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xl font-bold">QuizGen AI</span>
                </div>
                <p className="text-gray-400">Advanced quiz generation with 50 questions, 20MB files, and multiple format support.</p>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Capabilities</h4>
                <ul className="space-y-2 text-gray-400">
                  <li>• Up to 50 questions</li>
                  <li>• 20MB file support</li>
                  <li>• PDF, DOCX, TXT</li>
                  <li>• AI-powered analysis</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Developer</h4>
                <div className="mb-3">
                  <div className="flex items-center gap-3">
                    <img src={developer.image} alt={developer.name} className="w-12 h-12 rounded-full object-cover" />
                    <div>
                      <div className="font-semibold">{developer.name}</div>
                      <div className="text-xs text-gray-400">{developer.role}</div>
                    </div>
                  </div>
                </div>
                <ul className="space-y-2 text-gray-400">
                  <li className="flex items-center gap-2"><Code className="w-4 h-4" /> React + Tailwind</li>
                  <li>Gemini 2.0 Flash</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Support</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="https://md-afan.netlify.app/" className="hover:text-white transition-colors">Contact</a></li>
                  <li><a href={developer.github} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">GitHub</a></li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; {new Date().getFullYear()} QuizGen AI. All rights reserved. Powered by Google Gemini 2.0 Flash</p>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  // QUIZ CREATION VIEW
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 p-4">
      {/* Add modals */}
      <UserFormModal
        isOpen={showUserForm}
        onClose={() => setShowUserForm(false)}
        onSubmit={handleUserFormSubmit}
        fileName={uploadedFileName}
      />
      
      <ConfirmationModal
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={handleConfirmation}
        userData={userData}
        numQuestions={numQuestions}
        fileName={uploadedFileName}
      />

      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button
            type="button"
            onClick={() => setCurrentView("home")}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold"
          >
            ← Back to Home
          </button>
          <div className="text-right">
            <h1 className="text-2xl font-bold text-gray-900">QuizGen AI</h1>
            <p className="text-sm text-gray-600">by {developer.name} • Gemini 2.0 Flash</p>
          </div>
        </div>

        {!docText && (
          <div className="mb-6">
            <div className="flex border-b border-gray-200">
              <button
                type="button"
                className={`flex items-center gap-2 px-4 py-2 font-medium ${
                  activeTab === "upload" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500"
                }`}
                onClick={() => setActiveTab("upload")}
              >
                <Upload className="w-4 h-4" />
                Upload Document
              </button>
              <button
                type="button"
                className={`flex items-center gap-2 px-4 py-2 font-medium ${
                  activeTab === "text" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500"
                }`}
                onClick={() => setActiveTab("text")}
              >
                <FileText className="w-4 h-4" />
                Paste Text
              </button>
            </div>

            <div className="p-6 bg-white rounded-b-2xl shadow-md">
              {activeTab === "upload" ? (
                <DocumentUpload onTextExtracted={handleTextExtracted} />
              ) : (
                <TextInput onTextExtracted={handleTextSubmit} />
              )}
            </div>
          </div>
        )}

        {docText && !quiz.length && !quizResults && !showUserForm && !showConfirmation && (
          <div className="p-6 bg-white rounded-2xl shadow-md mb-6">
            <div className="mb-6">
              <label className="block text-lg font-semibold text-gray-700 mb-3">
                Number of Questions: <span className="text-blue-600">{numQuestions}</span>
              </label>
              <input
                type="range"
                min="5"
                max="50"
                value={numQuestions}
                onChange={(e) => setNumQuestions(parseInt(e.target.value))}
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-2">
                <span>5</span>
                <span>15</span>
                <span>25</span>
                <span>35</span>
                <span>50</span>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Generate up to 50 questions for comprehensive coverage of your content
              </p>
            </div>

            <QuizGenerator docText={docText} onQuizReady={setQuiz} numQuestions={numQuestions} />

            <button type="button" onClick={() => setDocText("")} className="mt-4 px-4 py-2 text-gray-600 hover:text-gray-800 flex items-center gap-2">
              ← Back to Input
            </button>
          </div>
        )}

        {quiz.length > 0 && !quizResults && <QuizPlayer quiz={quiz} onQuizComplete={handleQuizComplete} />}

        {quizResults && (
          <QuizResults 
            results={quizResults} 
            onNewQuiz={handleNewQuiz}
            quiz={quiz}
            userData={userData}
          />
        )}
      </div>
    </div>
  );
}

/* ----- DeveloperCard component (highlighted) ----- */
function DeveloperCard({ developer }) {
  return (
    <div className="bg-white rounded-2xl shadow-2xl p-5 border border-white/20 flex flex-col items-center text-center">
      <img src={developer.image} alt={developer.name} className="w-28 h-28 rounded-full object-cover mb-4 shadow-md" />
      <h3 className="text-lg font-bold">{developer.name}</h3>
      <p className="text-sm text-gray-500">{developer.role}</p>
      <p className="text-sm text-gray-600 mt-3">{developer.bio}</p>
      <div className="mt-4 flex items-center gap-3">
        <a href={`mailto:${developer.email}`} className="text-sm text-blue-600 underline">Contact</a>
        <a href={developer.github} target="_blank" rel="noreferrer" className="text-sm text-gray-600 hover:text-blue-600">GitHub</a>
      </div>
    </div>
  );
}

/* ----- Enhanced FeatureCard component ----- */
function FeatureCard({ icon, title, description, badges, highlight }) {
  return (
    <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-lg border border-white/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
      
      {badges && (
        <div className="flex gap-2 mt-4">
          {badges.map((badge, index) => (
            <span key={index} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">
              {badge}
            </span>
          ))}
        </div>
      )}
      
      {highlight && (
        <div className="mt-4 text-2xl font-bold text-blue-600">{highlight}</div>
      )}
    </div>
  );
}

function Step({ number, icon, title, desc }) {
  return (
    <div className="text-center">
      <div className="relative inline-block mb-6">
        <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
          {number}
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
          {icon}
        </div>
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600">{desc}</p>
    </div>
  );
}

export default App;