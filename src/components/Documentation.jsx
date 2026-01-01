import { FileText, Upload, Brain, Play, Download, Settings, HelpCircle, Video, BookOpen, CheckCircle, AlertCircle, Info } from "lucide-react";
import { useState } from "react";

export default function Documentation() {
  const [activeSection, setActiveSection] = useState("getting-started");

  const sections = [
    { id: "getting-started", title: "Getting Started", icon: <Play className="w-5 h-5" /> },
    { id: "file-upload", title: "File Upload Guide", icon: <Upload className="w-5 h-5" /> },
    { id: "quiz-generation", title: "Quiz Generation", icon: <Brain className="w-5 h-5" /> },
    { id: "taking-quiz", title: "Taking the Quiz", icon: <FileText className="w-5 h-5" /> },
    { id: "results", title: "Results & Reports", icon: <Download className="w-5 h-5" /> },
    { id: "troubleshooting", title: "Troubleshooting", icon: <HelpCircle className="w-5 h-5" /> },
  ];

  const steps = [
    {
      title: "Step 1: Access the Platform",
      description: "Open QuizGen AI in your web browser. The platform works on Chrome, Firefox, Safari, and Edge.",
      details: [
        "No account registration required",
        "Works on desktop and mobile browsers",
        "Progressive Web App (PWA) support"
      ],
      icon: <Globe className="w-6 h-6" />
    },
    {
      title: "Step 2: Choose Input Method",
      description: "Select between uploading a document or pasting text directly.",
      details: [
        "Upload: PDF, DOCX, TXT files (up to 20MB)",
        "Paste: Copy text from any source",
        "Both methods support AI analysis"
      ],
      icon: <Upload className="w-6 h-6" />
    },
    {
      title: "Step 3: Configure Quiz Settings",
      description: "Set the number of questions (5-50) and provide student information.",
      details: [
        "Adjust question count with slider",
        "Enter student name and course",
        "Settings affect quiz difficulty"
      ],
      icon: <Settings className="w-6 h-6" />
    },
    {
      title: "Step 4: Generate Quiz",
      description: "Let AI analyze your content and create targeted questions.",
      details: [
        "Uses Google Gemini 2.0 Flash AI",
        "Generates questions in 2-10 seconds",
        "Questions based on content complexity"
      ],
      icon: <Brain className="w-6 h-6" />
    },
    {
      title: "Step 5: Take the Quiz",
      description: "Answer questions in the interactive quiz interface.",
      details: [
        "Timer tracks completion time",
        "Question navigation buttons",
        "Save progress and return later"
      ],
      icon: <FileText className="w-6 h-6" />
    },
    {
      title: "Step 6: View Results",
      description: "Get detailed performance analysis and download reports.",
      details: [
        "Score percentage and time taken",
        "Question-by-question analysis",
        "Download PDF/text reports"
      ],
      icon: <Download className="w-6 h-6" />
    }
  ];

  const fileGuidelines = [
    {
      type: "PDF Files",
      icon: <FileText className="w-5 h-5 text-red-500" />,
      tips: [
        "Ensure text is selectable (not scanned images)",
        "Maximum 20MB file size",
        "PDFs with OCR work best",
        "Avoid password-protected files"
      ],
      format: "application/pdf"
    },
    {
      type: "DOCX Files",
      icon: <FileText className="w-5 h-5 text-blue-500" />,
      tips: [
        "Microsoft Word 2007+ format",
        "Text, images, and tables supported",
        "Styles and formatting are extracted",
        "Maximum 20MB file size"
      ],
      format: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    },
    {
      type: "Text Files",
      icon: <FileText className="w-5 h-5 text-green-500" />,
      tips: [
        "Plain text format (.txt)",
        "UTF-8 encoding recommended",
        "Minimum 10 characters required",
        "No size limit (under 20MB)"
      ],
      format: "text/plain"
    }
  ];

  const troubleshooting = [
    {
      issue: "File upload fails",
      solution: "Check file size (max 20MB) and format (PDF, DOCX, TXT). Ensure internet connection is stable.",
      icon: <AlertCircle className="w-5 h-5 text-yellow-500" />
    },
    {
      issue: "Quiz generation takes too long",
      solution: "Large files or complex content may take 10-30 seconds. Try reducing file size or using text input.",
      icon: <AlertCircle className="w-5 h-5 text-orange-500" />
    },
    {
      issue: "PDF text not extracted",
      solution: "The PDF may be image-based. Convert to text using OCR tools or use a different file format.",
      icon: <AlertCircle className="w-5 h-5 text-red-500" />
    },
    {
      issue: "Quiz questions seem irrelevant",
      solution: "Ensure your content is clear and comprehensive. The AI works best with well-structured text.",
      icon: <Info className="w-5 h-5 text-blue-500" />
    }
  ];

  const bestPractices = [
    "Use clear, well-structured documents for best results",
    "For large documents, consider splitting into sections",
    "Review generated questions before starting the quiz",
    "Save your quiz link to return later",
    "Use the same device for consistent experience"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Complete User Guide
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Step-by-step instructions to master QuizGen AI and create amazing quizzes
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                Documentation Sections
              </h3>
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${
                      activeSection === section.id
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {section.icon}
                    <span className="font-medium">{section.title}</span>
                  </button>
                ))}
              </nav>
              
              <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                  <Video className="w-5 h-5" />
                  Quick Tips
                </h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Use clear, structured documents</li>
                  <li>• Start with 10-15 questions</li>
                  <li>• Save your quiz link</li>
                  <li>• Review generated questions</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-12">
            {/* Getting Started */}
            {activeSection === "getting-started" && (
              <div className="space-y-8">
                <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <Play className="w-6 h-6 text-blue-600" />
                    Getting Started with QuizGen AI
                  </h2>
                  <p className="text-gray-600 mb-8">
                    Follow these simple steps to create your first AI-powered quiz. No technical knowledge required!
                  </p>
                  
                  <div className="space-y-6">
                    {steps.map((step, index) => (
                      <div key={index} className="flex gap-6 p-6 bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-200">
                        <div className="flex-shrink-0">
                          <div className="bg-blue-100 w-12 h-12 rounded-xl flex items-center justify-center">
                            <span className="text-blue-700 font-bold text-lg">{index + 1}</span>
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                          <p className="text-gray-600 mb-3">{step.description}</p>
                          <ul className="space-y-1">
                            {step.details.map((detail, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-sm text-gray-500">
                                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                {detail}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Best Practices */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-200">
                  <h3 className="text-xl font-semibold text-green-800 mb-4">✨ Best Practices</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {bestPractices.map((practice, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-green-700">{practice}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* File Upload Guide */}
            {activeSection === "file-upload" && (
              <div className="space-y-8">
                <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <Upload className="w-6 h-6 text-blue-600" />
                    File Upload Guide
                  </h2>
                  
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Supported File Formats</h3>
                    <div className="grid md:grid-cols-3 gap-6">
                      {fileGuidelines.map((file, index) => (
                        <div key={index} className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                          <div className="flex items-center gap-3 mb-4">
                            {file.icon}
                            <h4 className="font-semibold text-gray-900">{file.type}</h4>
                          </div>
                          <p className="text-sm text-gray-500 mb-4 font-mono">{file.format}</p>
                          <ul className="space-y-2">
                            {file.tips.map((tip, tipIndex) => (
                              <li key={tipIndex} className="flex items-start gap-2 text-sm text-gray-600">
                                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                {tip}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-blue-50 p-6 rounded-2xl border border-blue-200">
                      <h3 className="text-lg font-semibold text-blue-800 mb-4">📁 Upload Methods</h3>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-blue-700 mb-2">Drag & Drop</h4>
                          <p className="text-blue-600 text-sm">Simply drag your file into the upload area</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-blue-700 mb-2">Click to Browse</h4>
                          <p className="text-blue-600 text-sm">Click the upload area to select files from your device</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-blue-700 mb-2">Paste Text</h4>
                          <p className="text-blue-600 text-sm">Copy and paste text directly into the text input</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-50 p-6 rounded-2xl border border-green-200">
                      <h3 className="text-lg font-semibold text-green-800 mb-4">✅ Upload Checklist</h3>
                      <ul className="space-y-3">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-green-700">File size under 20MB</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-green-700">Supported format (PDF, DOCX, TXT)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-green-700">Text is selectable (not scanned images)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-green-700">Minimum 10 characters of text</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Quiz Generation */}
            {activeSection === "quiz-generation" && (
              <div className="space-y-8">
                <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <Brain className="w-6 h-6 text-blue-600" />
                    Quiz Generation Process
                  </h2>
                  
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">How AI Creates Questions</h3>
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-200">
                      <p className="text-purple-700 mb-4">
                        Our AI analyzes your content using Google's Gemini 2.0 Flash model to create relevant, challenging questions.
                      </p>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-white/50 p-4 rounded-xl">
                          <h4 className="font-semibold text-purple-800 mb-2">Content Analysis</h4>
                          <p className="text-purple-600 text-sm">AI reads and understands your document's key concepts</p>
                        </div>
                        <div className="bg-white/50 p-4 rounded-xl">
                          <h4 className="font-semibold text-purple-800 mb-2">Question Types</h4>
                          <p className="text-purple-600 text-sm">Generates multiple-choice questions based on difficulty</p>
                        </div>
                        <div className="bg-white/50 p-4 rounded-xl">
                          <h4 className="font-semibold text-purple-800 mb-2">Answer Options</h4>
                          <p className="text-purple-600 text-sm">Creates plausible distractors based on content</p>
                        </div>
                        <div className="bg-white/50 p-4 rounded-xl">
                          <h4 className="font-semibold text-purple-800 mb-2">Quality Check</h4>
                          <p className="text-purple-600 text-sm">Validates questions for clarity and relevance</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-blue-50 p-6 rounded-2xl border border-blue-200">
                      <h3 className="text-lg font-semibold text-blue-800 mb-4">⚙️ Configuration Options</h3>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-blue-700 mb-2">Question Count (5-50)</h4>
                          <p className="text-blue-600 text-sm">Adjust based on document length and time available</p>
                          <ul className="text-blue-600 text-sm mt-2 space-y-1">
                            <li>• 5-10: Quick review</li>
                            <li>• 10-25: Standard quiz</li>
                            <li>• 25-50: Comprehensive test</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-blue-700 mb-2">Student Information</h4>
                          <p className="text-blue-600 text-sm">Add names and course details for personalized reports</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-50 p-6 rounded-2xl border border-green-200">
                      <h3 className="text-lg font-semibold text-green-800 mb-4">🎯 Optimization Tips</h3>
                      <ul className="space-y-3">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-green-700">Use clear section headings in documents</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-green-700">Include key terms and definitions</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-green-700">Structure content logically</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-green-700">Balance theoretical and practical content</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Troubleshooting */}
            {activeSection === "troubleshooting" && (
              <div className="space-y-8">
                <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <HelpCircle className="w-6 h-6 text-blue-600" />
                    Troubleshooting Guide
                  </h2>
                  
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Common Issues & Solutions</h3>
                    <div className="space-y-4">
                      {troubleshooting.map((item, index) => (
                        <div key={index} className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                          <div className="flex items-start gap-4">
                            {item.icon}
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 mb-2">{item.issue}</h4>
                              <p className="text-gray-600">{item.solution}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-8 border border-yellow-200">
                    <h3 className="text-xl font-semibold text-yellow-800 mb-4">🚨 Emergency Solutions</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-yellow-700 mb-2">If upload fails:</h4>
                        <ul className="text-yellow-600 text-sm space-y-1">
                          <li>1. Check file format and size</li>
                          <li>2. Try a different browser</li>
                          <li>3. Clear browser cache</li>
                          <li>4. Use text input instead</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-yellow-700 mb-2">If quiz fails:</h4>
                        <ul className="text-yellow-600 text-sm space-y-1">
                          <li>1. Refresh the page</li>
                          <li>2. Check internet connection</li>
                          <li>3. Try with smaller content</li>
                          <li>4. Contact support if persists</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 bg-blue-50 p-6 rounded-2xl border border-blue-200">
                    <h3 className="text-lg font-semibold text-blue-800 mb-4">📞 Support Information</h3>
                    <div className="text-blue-700 space-y-2">
                      <p>For additional help:</p>
                      <ul className="space-y-1 pl-4">
                        <li>• Email: mdafan00094@gmail.com</li>
                        <li>• GitHub: github.com/md-afan</li>
                        <li>• Website: md-afan.netlify.app</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Other sections would follow similar pattern... */}
            {activeSection === "taking-quiz" && (
              <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Taking the Quiz</h2>
                {/* Content for taking quiz section */}
                <p className="text-gray-600">This section would contain detailed instructions about taking quizzes...</p>
              </div>
            )}

            {activeSection === "results" && (
              <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Results & Reports</h2>
                {/* Content for results section */}
                <p className="text-gray-600">This section would contain detailed instructions about viewing results...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper component for globe icon
const Globe = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
  </svg>
);