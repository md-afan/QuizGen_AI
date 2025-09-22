import { CheckCircle2, XCircle, Clock, BarChart3, RotateCcw, Star } from "lucide-react";

export default function QuizResults({ results, onNewQuiz, quiz }) {
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

  return (
    <div className="space-y-6 animate-fade-in">
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

      {/* New Quiz Button */}
      <button
        onClick={onNewQuiz}
        className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-semibold text-lg flex items-center justify-center gap-3 transition-all duration-200 shadow-lg hover:shadow-xl"
      >
        <RotateCcw className="w-5 h-5" />
        Create New Quiz
      </button>
    </div>
  );
}