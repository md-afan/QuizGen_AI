import { useRef, useState } from "react";
import { CheckCircle2, XCircle, Clock, BarChart3, RotateCcw, Star, Download, Camera } from "lucide-react";
import html2canvas from "html2canvas";

export default function QuizResults({ results, onNewQuiz, quiz }) {
  const resultsRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);

  if (!results) return null;

  const percentage = results.percentage || Math.round((results.score / results.total) * 100);
  
  const getPerformanceMessage = () => {
    if (percentage >= 90) return "Outstanding! 🎉";
    if (percentage >= 80) return "Excellent! 👏";
    if (percentage >= 70) return "Great job! 👍";
    if (percentage >= 60) return "Good work! 😊";
    if (percentage >= 50) return "Not bad! 📚";
    return "Keep practicing! 💪";
  };

  const getStrengthColor = (percentage) => {
    if (percentage >= 90) return "text-green-600";
    if (percentage >= 80) return "text-blue-600";
    if (percentage >= 70) return "text-indigo-600";
    if (percentage >= 60) return "text-yellow-600";
    if (percentage >= 50) return "text-orange-600";
    return "text-red-600";
  };

  const getStrengthBgColor = (percentage) => {
    if (percentage >= 90) return "bg-green-100";
    if (percentage >= 80) return "bg-blue-100";
    if (percentage >= 70) return "bg-indigo-100";
    if (percentage >= 60) return "bg-yellow-100";
    if (percentage >= 50) return "bg-orange-100";
    return "bg-red-100";
  };

  const downloadResultsSnapshot = async () => {
    if (!resultsRef.current) return;

    setIsDownloading(true);
    try {
      const canvas = await html2canvas(resultsRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#f8fafc"
      });

      const image = canvas.toDataURL("image/png", 1.0);
      const link = document.createElement("a");
      link.download = `quiz-results-${new Date().getTime()}.png`;
      link.href = image;
      link.click();
    } catch (error) {
      console.error("Error downloading snapshot:", error);
      // Fallback to text download
      downloadResultsAsText();
    } finally {
      setIsDownloading(false);
    }
  };

  const downloadResultsAsText = () => {
    const textContent = generateTextReport();
    const blob = new Blob([textContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = `quiz-results-${new Date().getTime()}.txt`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  const generateTextReport = () => {
    const date = new Date().toLocaleString();
    let report = `Quiz Results Report\n`;
    report += `Generated on: ${date}\n`;
    report += `====================\n\n`;
    report += `Overall Score: ${results.score}/${results.total} (${percentage}%)\n`;
    report += `Time Taken: ${results.timeTaken} seconds\n`;
    report += `Performance: ${getPerformanceMessage()}\n\n`;
    report += `Detailed Results:\n`;
    report += `-----------------\n`;

    quiz.forEach((q, i) => {
      const userAnswer = results.answers[i];
      const correctAnswer = results.correctAnswers[i];
      const userChoice = userAnswer ? userAnswer.charAt(0).toUpperCase() : '';
      const correctChoice = correctAnswer ? correctAnswer.charAt(0).toUpperCase() : '';
      const isCorrect = userChoice === correctChoice;

      report += `Q${i + 1}: ${q.question}\n`;
      report += `Your Answer: ${userAnswer || "Not answered"} ${isCorrect ? "✓" : "✗"}\n`;
      if (!isCorrect) {
        report += `Correct Answer: ${correctAnswer}\n`;
      }
      report += `\n`;
    });

    report += `\nThank you for using QuizGen AI!`;
    return report;
  };

  const shareResults = async () => {
    const textContent = `I scored ${results.score}/${results.total} (${percentage}%) on my quiz! 🎯\n\nTry QuizGen AI for yourself!`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Quiz Results',
          text: textContent,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Sharing cancelled or failed');
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(textContent).then(() => {
        alert('Results copied to clipboard!');
      });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Download Options */}
      <div className="p-6 bg-white rounded-2xl shadow-md">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Download className="w-5 h-5 text-blue-600" />
          Download Results
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          <button
            onClick={downloadResultsSnapshot}
            disabled={isDownloading}
            className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-200 disabled:opacity-50"
          >
            <Camera className="w-5 h-5" />
            {isDownloading ? "Generating..." : "Download Snapshot"}
          </button>
          
          <button
            onClick={downloadResultsAsText}
            className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-200"
          >
            <FileText className="w-5 h-5" />
            Download as Text
          </button>
          
          <button
            onClick={shareResults}
            className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-purple-700 transition-all duration-200"
          >
            <Share className="w-5 h-5" />
            Share Results
          </button>
        </div>
      </div>

      {/* Results Content (with ref for screenshot) */}
      <div ref={resultsRef} className="space-y-6">
        {/* Summary Card */}
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg border-2 border-indigo-100">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <svg className="w-32 h-32 transform rotate-[-90deg]" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#e6e6e6"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#4f46e5"
                  strokeWidth="3"
                  strokeDasharray={`${percentage}, 100`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold text-gray-800">{percentage}%</span>
              </div>
            </div>
          </div>
          
          <h2 className={`text-3xl font-bold mb-3 ${getStrengthColor(percentage)}`}>
            {getPerformanceMessage()}
          </h2>
          
          <div className="flex justify-center items-center gap-6 mb-4 flex-wrap">
            <div className="flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span className="font-semibold text-green-700">{results.score} Correct</span>
            </div>
            <div className="flex items-center gap-2 bg-red-50 px-3 py-1 rounded-full">
              <XCircle className="w-4 h-4 text-red-600" />
              <span className="font-semibold text-red-700">{results.total - results.score} Incorrect</span>
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-2 text-gray-600 bg-gray-50 px-3 py-1 rounded-full inline-block">
            <Clock className="w-4 h-4" />
            <span>Time taken: {results.timeTaken} seconds</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className={`p-6 rounded-2xl shadow-sm text-center ${getStrengthBgColor(percentage)}`}>
            <BarChart3 className="w-8 h-8 mx-auto mb-3 text-indigo-600" />
            <div className={`text-3xl font-bold ${getStrengthColor(percentage)}`}>
              {percentage}%
            </div>
            <div className="text-sm text-gray-600 font-medium">Overall Score</div>
          </div>
          
          <div className="p-6 bg-green-50 rounded-2xl shadow-sm text-center">
            <CheckCircle2 className="w-8 h-8 mx-auto mb-3 text-green-600" />
            <div className="text-3xl font-bold text-gray-800">
              {results.score}/{results.total}
            </div>
            <div className="text-sm text-gray-600 font-medium">Correct Answers</div>
          </div>
          
          <div className="p-6 bg-blue-50 rounded-2xl shadow-sm text-center">
            <Clock className="w-8 h-8 mx-auto mb-3 text-blue-600" />
            <div className="text-3xl font-bold text-gray-800">
              {results.timeTaken}s
            </div>
            <div className="text-sm text-gray-600 font-medium">Time Taken</div>
          </div>
        </div>

        {/* Detailed Results */}
        <div className="p-6 bg-white rounded-2xl shadow-md">
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            Detailed Results
          </h3>
          <div className="space-y-4">
            {quiz.map((q, i) => {
              const userAnswer = results.answers[i];
              const correctAnswer = results.correctAnswers[i];
              const userChoice = userAnswer ? userAnswer.charAt(0).toUpperCase() : '';
              const correctChoice = correctAnswer ? correctAnswer.charAt(0).toUpperCase() : '';
              const isCorrect = userChoice === correctChoice;
              
              // Find the full correct option text
              const correctOption = q.options.find(opt => 
                opt.charAt(0).toUpperCase() === correctChoice
              ) || correctAnswer;

              return (
                <div key={i} className={`p-4 border-2 rounded-lg transition-all duration-200 ${
                  isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                }`}>
                  <div className="flex items-start gap-3">
                    <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-1 ${
                      isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                    }`}>
                      {isCorrect ? '✓' : '✗'}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-800 mb-2">
                        Q{i + 1}: {q.question}
                      </div>
                      <div className="space-y-1 text-sm">
                        <div>
                          <span className="text-gray-600">Your answer: </span>
                          <span className={isCorrect ? "text-green-700 font-medium" : "text-red-700 font-medium"}>
                            {userAnswer || "Not answered"}
                          </span>
                        </div>
                        {!isCorrect && (
                          <div>
                            <span className="text-gray-600">Correct answer: </span>
                            <span className="text-green-700 font-medium">
                              {correctOption}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid md:grid-cols-2 gap-4">
        <button
          onClick={onNewQuiz}
          className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-semibold text-lg flex items-center justify-center gap-3 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <RotateCcw className="w-5 h-5" />
          Create New Quiz
        </button>
        
        <button
          onClick={downloadResultsSnapshot}
          disabled={isDownloading}
          className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl font-semibold text-lg flex items-center justify-center gap-3 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
        >
          <Download className="w-5 h-5" />
          {isDownloading ? "Generating Snapshot..." : "Download Results"}
        </button>
      </div>
    </div>
  );
}

// Add the missing Share icon component
const Share = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="18" cy="5" r="3"/>
    <circle cx="6" cy="12" r="3"/>
    <circle cx="18" cy="19" r="3"/>
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
  </svg>
);

// Add the missing FileText icon component
const FileText = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14,2 14,8 20,8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
    <polyline points="10,9 9,9 8,9"/>
  </svg>
);