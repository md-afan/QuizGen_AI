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
  Sparkles,
  File,
  Book,
  Globe,
  Image,
  Database,
  Cpu,
  Shield,
  Award,
  TrendingUp,
  Calendar,
  Mail,
  Linkedin,
} from "lucide-react";

import DocumentUpload from "./components/DocumentUpload.jsx";
import TextInput from "./components/TextInput.jsx";
import QuizGenerator from "./components/QuizGenerator.jsx";
import QuizPlayer from "./components/QuizPlayer.jsx";
import QuizResults from "./components/QuizResults.jsx";
import UserFormModal from "./components/UserFormModal";
import ConfirmationModal from "./components/ConfirmationModal";
import Technology from "./components/Technology";
import Documentation from "./components/Documentation";
import profile from'./assets/profile.png';

function App() {
  const [currentView, setCurrentView] = useState("home");
  const [isScrolled, setIsScrolled] = useState(false);

  // Quiz state
  const [docText, setDocText] = useState("");
  const [quiz, setQuiz] = useState([]);
  const [quizResults, setQuizResults] = useState(null);
  const [numQuestions, setNumQuestions] = useState(20); // Default increased from 15 to 20
  const [activeTab, setActiveTab] = useState("upload");

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

  // Modernized Developer info
  const developer = {
    name: "MD AFAN",
    role: "Developer",
    image: profile,
    email: "mdafan00094@gmail.com",
    linkedin: "https://www.linkedin.com/in/md-afan/",
    portfolio: "https://md-afan.netlify.app/",
    expertise: [
      "React.js & Next.js",
      "AI/ML Integration",
      "Cloud Architecture",
      "UI/UX Design"
    ],
    bio: "Building cutting-edge AI applications with focus on educational technology and user experience.",
    achievements: [
      "10+ AI Projects",
      "EdTech Specialist",
      "Full Stack Development",
      "Open Source Contributor"
    ]
  };

  const handleTextExtracted = (text, fileName = "Uploaded Document") => {
    setDocText(text);
    setUploadedFileName(fileName);
    setShowUserForm(true);
  };

  const handleTextSubmit = (text) => {
    setDocText(text);
    setUploadedFileName("Pasted Text");
    setShowUserForm(true);
  };

  const handleStart = (tab = "upload") => {
    setActiveTab(tab);
    setCurrentView("quiz");
  };

  const handleNavigation = (page) => {
    setCurrentView(page);
    window.scrollTo(0, 0);
  };

  const handleUserFormSubmit = (data) => {
    setUserData(data);
    setShowUserForm(false);
    setShowConfirmation(true);
  };

  const handleConfirmation = () => {
    setShowConfirmation(false);
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
    setNumQuestions(20);
    setActiveTab("upload");
    setCurrentView("home");
    setUserData(null);
    setUploadedFileName("");
  };

  // HOME, TECHNOLOGY, and DOCUMENTATION VIEWS
  if (["home", "technology", "documentation"].includes(currentView)) {
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
                  <p className="text-xs text-gray-600">Powered by Gemini 2.5</p>
                </div>
              </div>

              <div className="hidden md:flex items-center space-x-8">
                <button 
                  onClick={() => handleNavigation("home")}
                  className={`transition-colors font-medium ${
                    currentView === "home" ? "text-blue-600" : "text-gray-700 hover:text-blue-600"
                  }`}
                >
                  Home
                </button>
                {currentView === "home" && (
                  <>
                    <a href="#features" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Features</a>
                    <a href="#how-it-works" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">How It Works</a>
                  </>
                )}
                <button 
                  onClick={() => handleNavigation("technology")}
                  className={`transition-colors font-medium ${
                    currentView === "technology" ? "text-blue-600" : "text-gray-700 hover:text-blue-600"
                  }`}
                >
                  Technology
                </button>
                <button 
                  onClick={() => handleNavigation("documentation")}
                  className={`transition-colors font-medium ${
                    currentView === "documentation" ? "text-blue-600" : "text-gray-700 hover:text-blue-600"
                  }`}
                >
                  Documentation
                </button>
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

        {/* Render appropriate page */}
        {currentView === "home" ? (
          <>
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
                      Transform Documents & Images into{" "}
                      <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                        Intelligent Quizzes
                      </span>
                    </h1>

                    <p className="text-xl text-gray-600 leading-relaxed">
                      Upload PDF, DOCX, TXT files up to 25MB or images up to 6MB. Generate up to 100 targeted questions using Google's Gemini 2.5 Flash AI with Vision capabilities.
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

                    {/* Updated Stats */}
                    <div className="flex items-center gap-8 pt-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">100</div>
                        <div className="text-sm text-gray-600">Max Questions</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">25MB</div>
                        <div className="text-sm text-gray-600">File Size</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">6MB</div>
                        <div className="text-sm text-gray-600">Image Size</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">AI</div>
                        <div className="text-sm text-gray-600">Vision</div>
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
                                <div className="text-sm text-gray-600">Extended File Support</div>
                                <div className="font-semibold text-gray-800">25MB Limit • 4 Formats</div>
                              </div>
                            </div>
                          </div>

                          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-2xl border border-green-100">
                            <div className="flex items-center gap-3">
                              <Image className="w-6 h-6 text-green-600" />
                              <div>
                                <div className="text-sm text-gray-600">Image Processing</div>
                                <div className="font-semibold text-gray-800">6MB Images • AI Vision</div>
                              </div>
                            </div>
                          </div>

                          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-2xl border border-purple-100">
                            <div className="flex items-center gap-3">
                              <Star className="w-6 h-6 text-purple-600" />
                              <div>
                                <div className="text-sm text-gray-600">Advanced Quizzes</div>
                                <div className="font-semibold text-gray-800">5-100 Questions</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Modern Developer Card */}
                    <ModernDeveloperCard developer={developer} />
                  </div>
                </div>
              </div>
            </section>

            {/* Updated Features Section */}
            <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50">
              <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                  <h2 className="text-4xl font-bold text-gray-900 mb-4">Advanced Features</h2>
                  <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    Everything you need to create comprehensive, intelligent quizzes from documents and images
                  </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <FeatureCard 
                    icon={<File className="w-7 h-7 text-white" />} 
                    title="Extended File Support" 
                    description="Upload PDF, DOCX, and TXT files up to 25MB. Gemini AI processes all formats seamlessly."
                    badges={["25MB", "PDF", "DOCX", "TXT"]}
                  />
                  <FeatureCard 
                    icon={<Image className="w-7 h-7 text-white" />} 
                    title="Image Processing" 
                    description="Upload images (PNG, JPG, JPEG) up to 6MB. Gemini Vision AI analyzes visual content."
                    badges={["6MB", "PNG", "JPG", "JPEG"]}
                    highlight="AI Vision"
                  />
                  <FeatureCard 
                    icon={<Book className="w-7 h-7 text-white" />} 
                    title="100 Questions Maximum" 
                    description="Generate comprehensive quizzes with up to 100 targeted questions covering all aspects of your content."
                    highlight="100 Qs"
                  />
                  <FeatureCard 
                    icon={<Brain className="w-7 h-7 text-white" />} 
                    title="AI-Powered Analysis" 
                    description="Gemini 2.5 Flash with Vision intelligently analyzes both text and visual content."
                  />
                  <FeatureCard 
                    icon={<Database className="w-7 h-7 text-white" />} 
                    title="Smart Content Processing" 
                    description="Extract meaningful quiz content from documents, images, and mixed media."
                  />
                  <FeatureCard 
                    icon={<Rocket className="w-7 h-7 text-white" />} 
                    title="Professional Analytics" 
                    description="Get detailed performance metrics, time tracking, and comprehensive results analysis."
                  />
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
                  <Step number="1" icon={<Upload className="w-4 h-4 text-white" />} title="Upload Content" desc="Upload PDF, DOCX, TXT files (25MB max) or images (6MB max). Our AI analyzes both text and visual content." />
                  <Step number="2" icon={<Brain className="w-4 h-4 text-white" />} title="AI Generates Quiz" desc="Gemini AI creates 5-100 targeted questions based on your content and preferences using advanced vision capabilities." />
                  <Step number="3" icon={<Star className="w-4 h-4 text-white" />} title="Take & Analyze" desc="Take the interactive quiz, get instant results with detailed analytics and professional insights." />
                </div>
              </div>
            </section>

            {/* Updated CTA */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-4xl font-bold text-white mb-4">Ready to Create Advanced Quizzes?</h2>
                <p className="text-xl text-blue-100 mb-8">Generate up to 100 questions from 25MB documents or 6MB images with advanced AI Vision</p>
                
                <div className="grid md:grid-cols-4 gap-4 mb-8 max-w-2xl mx-auto">
                  <div className="bg-white/20 p-4 rounded-2xl">
                    <div className="text-2xl font-bold text-white">100</div>
                    <div className="text-blue-100">Questions Max</div>
                  </div>
                  <div className="bg-white/20 p-4 rounded-2xl">
                    <div className="text-2xl font-bold text-white">25MB</div>
                    <div className="text-blue-100">File Size</div>
                  </div>
                  <div className="bg-white/20 p-4 rounded-2xl">
                    <div className="text-2xl font-bold text-white">6MB</div>
                    <div className="text-blue-100">Image Size</div>
                  </div>
                  <div className="bg-white/20 p-4 rounded-2xl">
                    <div className="text-2xl font-bold text-white">AI</div>
                    <div className="text-blue-100">Vision</div>
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

            {/* Updated Footer with LinkedIn */}
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
                    <p className="text-gray-400">Advanced quiz generation with 100 questions, 25MB files, 6MB images, and AI Vision support.</p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-4">Capabilities</h4>
                    <ul className="space-y-2 text-gray-400">
                      <li>• Up to 100 questions</li>
                      <li>• 25MB file support</li>
                      <li>• 6MB image support</li>
                      <li>• AI Vision processing</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-4">Developer</h4>
                    <div className="mb-3">
                      <div className="flex items-center gap-3">
                        <img src={developer.image} alt={developer.name} className="w-12 h-12 rounded-full object-cover border-2 border-blue-500" />
                        <div>
                          <div className="font-semibold">{developer.name}</div>
                          <div className="text-xs text-gray-400">{developer.role}</div>
                        </div>
                      </div>
                    </div>
                    <ul className="space-y-2 text-gray-400">
                      <li className="flex items-center gap-2"><Code className="w-4 h-4" /> React + Tailwind</li>
                      <li>Gemini 2.5 Vision</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-4">Connect</h4>
                    <ul className="space-y-2 text-gray-400">
                      <li className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <a href={`mailto:${developer.email}`} className="hover:text-white transition-colors">Email</a>
                      </li>
                      <li className="flex items-center gap-2">
                        <Linkedin className="w-4 h-4" />
                        <a href={developer.linkedin} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">LinkedIn</a>
                      </li>
                      <li className="flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        <a href={developer.portfolio} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Portfolio</a>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                  <p>&copy; {new Date().getFullYear()} QuizGen AI. All rights reserved. Powered by Google Gemini 2.5 Flash with Vision</p>
                </div>
              </div>
            </footer>
          </>
        ) : currentView === "technology" ? (
          <Technology />
        ) : (
          <Documentation />
        )}
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
            <p className="text-sm text-gray-600">by {developer.name} • Gemini 2.5 Vision</p>
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
                Upload Content
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
                max="100"
                value={numQuestions}
                onChange={(e) => setNumQuestions(parseInt(e.target.value))}
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-2">
                <span>5</span>
                <span>25</span>
                <span>50</span>
                <span>75</span>
                <span>100</span>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Generate 5 to 100 questions for comprehensive coverage of your content
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

/* ----- Modern DeveloperCard component ----- */
function ModernDeveloperCard({ developer }) {
  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl p-5 border border-gray-200 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full -translate-y-12 translate-x-12"></div>
      <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-full -translate-x-8 translate-y-8"></div>
      
      <div className="relative z-10">
        <div className="flex flex-col items-center text-center mb-4">
          <div className="relative mb-4">
            <img src={developer.image} alt={developer.name} className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg" />
            <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-full shadow-lg">
              <Brain className="w-5 h-5 text-white" />
            </div>
          </div>
          <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{developer.name}</h3>
          <p className="text-sm text-gray-600 mb-2">{developer.role}</p>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-green-600 font-medium">Available for projects</span>
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-4 text-center">{developer.bio}</p>

        {/* Expertise */}
        

        {/* Achievements */}
        

        {/* Contact Links */}
        <div className="flex justify-center gap-4 mt-4">
          <a href={`mailto:${developer.email}`} 
             className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
             title="Email">
            <Mail className="w-4 h-4" />
          </a>
          <a href={developer.linkedin} 
             target="_blank" 
             rel="noreferrer"
             className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
             title="LinkedIn">
            <Linkedin className="w-4 h-4" />
          </a>
          <a href={developer.portfolio} 
             target="_blank" 
             rel="noreferrer"
             className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
             title="Portfolio">
            <Globe className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}

/* ----- FeatureCard component ----- */
function FeatureCard({ icon, title, description, badges, highlight }) {
  return (
    <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-lg border border-white/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
      
      {badges && (
        <div className="flex flex-wrap gap-2 mt-4">
          {badges.map((badge, index) => (
            <span key={index} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">
              {badge}
            </span>
          ))}
        </div>
      )}
      
      {highlight && (
        <div className="mt-4 text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {highlight}
        </div>
      )}
    </div>
  );
}

function Step({ number, icon, title, desc }) {
  return (
    <div className="text-center">
      <div className="relative inline-block mb-6">
        <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg group-hover:scale-110 transition-transform duration-300">
          {number}
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-md">
          {icon}
        </div>
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600">{desc}</p>
    </div>
  );
}

export default App;