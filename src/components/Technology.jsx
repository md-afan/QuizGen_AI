import { Brain, Code, Cpu, Database, Shield, Zap, Globe, Cloud, Layers, Cpu as CpuIcon } from "lucide-react";

export default function Technology() {
  const technologies = [
    {
      category: "Frontend",
      icon: <Code className="w-8 h-8 text-blue-600" />,
      items: [
        { name: "React 18", description: "Modern component-based UI library for building interactive user interfaces" },
        { name: "Vite", description: "Next-generation frontend tooling for lightning-fast development and builds" },
        { name: "Tailwind CSS", description: "Utility-first CSS framework for rapid UI development" },
      ]
    },
    {
      category: "AI & Backend",
      icon: <Brain className="w-8 h-8 text-purple-600" />,
      items: [
        { name: "Google Gemini 2.0 Flash", description: "Latest multimodal AI model for intelligent content analysis and quiz generation" },
        { name: "RESTful API", description: "Clean API architecture for seamless communication between frontend and AI services" },
        { name: "File Processing", description: "Support for PDF, DOCX, TXT files with intelligent text extraction" },
      ]
    },
    {
      category: "Performance & Security",
      icon: <Shield className="w-8 h-8 text-green-600" />,
      items: [
        { name: "Optimized Bundling", description: "Code splitting and lazy loading for optimal performance" },
        { name: "Secure File Handling", description: "Client-side processing with no file storage on servers" },
        { name: "Responsive Design", description: "Mobile-first approach with cross-browser compatibility" },
      ]
    }
  ];

  const features = [
    {
      title: "Real-time AI Processing",
      description: "Instant quiz generation using Google's advanced Gemini 2.0 model",
      icon: <Zap className="w-6 h-6" />
    },
    {
      title: "Multi-format Support",
      description: "Process PDF, DOCX, and TXT files up to 20MB seamlessly",
      icon: <Layers className="w-6 h-6" />
    },
    {
      title: "Client-side Security",
      description: "All file processing happens in the browser - no data is stored on servers",
      icon: <Shield className="w-6 h-6" />
    },
    {
      title: "Progressive Web App",
      description: "Works offline and provides app-like experience across all devices",
      icon: <Globe className="w-6 h-6" />
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Technology Stack
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Built with cutting-edge technologies to deliver a seamless quiz generation experience
          </p>
        </div>

        {/* Tech Stack Overview */}
        <div className="mb-20">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
                <div className="bg-blue-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                  <div className="text-blue-600">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Architecture Diagram */}
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-200 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">System Architecture</h2>
            <div className="relative">
              <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
                {/* Client Layer */}
                <div className="bg-blue-50 p-6 rounded-2xl border-2 border-blue-200 w-full lg:w-1/4">
                  <div className="flex items-center gap-3 mb-4">
                    <Globe className="w-6 h-6 text-blue-600" />
                    <h3 className="text-lg font-semibold text-blue-800">Client Layer</h3>
                  </div>
                  <ul className="space-y-2 text-sm text-blue-700">
                    <li>• React 18 + Vite</li>
                    <li>• Tailwind CSS</li>
                    <li>• File Upload</li>
                    <li>• Quiz Interface</li>
                  </ul>
                </div>

                {/* Arrow */}
                <div className="hidden lg:block">
                  <div className="w-12 h-1 bg-blue-400"></div>
                </div>

                {/* AI Processing Layer */}
                <div className="bg-purple-50 p-6 rounded-2xl border-2 border-purple-200 w-full lg:w-1/3">
                  <div className="flex items-center gap-3 mb-4">
                    <Brain className="w-6 h-6 text-purple-600" />
                    <h3 className="text-lg font-semibold text-purple-800">AI Processing Layer</h3>
                  </div>
                  <ul className="space-y-2 text-sm text-purple-700">
                    <li>• Google Gemini 2.0 Flash API</li>
                    <li>• Content Analysis</li>
                    <li>• Quiz Generation</li>
                    <li>• PDF/DOCX Processing</li>
                  </ul>
                </div>

                {/* Arrow */}
                <div className="hidden lg:block">
                  <div className="w-12 h-1 bg-purple-400"></div>
                </div>

                {/* Output Layer */}
                <div className="bg-green-50 p-6 rounded-2xl border-2 border-green-200 w-full lg:w-1/4">
                  <div className="flex items-center gap-3 mb-4">
                    <CpuIcon className="w-6 h-6 text-green-600" />
                    <h3 className="text-lg font-semibold text-green-800">Output Layer</h3>
                  </div>
                  <ul className="space-y-2 text-sm text-green-700">
                    <li>• Interactive Quiz</li>
                    <li>• PDF Reports</li>
                    <li>• Performance Analytics</li>
                    <li>• Detailed Results</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Technology Details */}
        <div className="space-y-12">
          {technologies.map((tech, index) => (
            <div key={index} className="bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-gray-50 to-white p-6 border-b border-gray-200">
                <div className="flex items-center gap-4">
                  {tech.icon}
                  <h2 className="text-2xl font-bold text-gray-900">{tech.category}</h2>
                </div>
              </div>
              <div className="p-6">
                <div className="grid md:grid-cols-3 gap-6">
                  {tech.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.name}</h3>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Performance Metrics */}
        <div className="mt-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-8 text-center">Performance Metrics</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">{"< 2s"}</div>
              <div className="text-blue-200">Quiz Generation Time</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">99.9%</div>
              <div className="text-blue-200">Uptime Reliability</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">20MB</div>
              <div className="text-blue-200">Max File Size</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">50+</div>
              <div className="text-blue-200">Questions per Quiz</div>
            </div>
          </div>
        </div>

        {/* Future Roadmap */}
        <div className="mt-20 bg-white rounded-3xl shadow-lg border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Future Roadmap</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-800 mb-3">Q1 2024</h3>
              <ul className="space-y-2 text-blue-700">
                <li>• Mobile App Development</li>
                <li>• Advanced Analytics Dashboard</li>
                <li>• Collaborative Quiz Creation</li>
              </ul>
            </div>
            <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-200">
              <h3 className="text-lg font-semibold text-purple-800 mb-3">Q2 2024</h3>
              <ul className="space-y-2 text-purple-700">
                <li>• AI-powered Explanations</li>
                <li>• Custom Quiz Templates</li>
                <li>• Multi-language Support</li>
              </ul>
            </div>
            <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200">
              <h3 className="text-lg font-semibold text-green-800 mb-3">Q3 2024</h3>
              <ul className="space-y-2 text-green-700">
                <li>• Voice-based Quizzes</li>
                <li>• Integration with LMS</li>
                <li>• Advanced Question Types</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}