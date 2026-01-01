import { useState, useEffect, useRef } from "react";
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ChevronLeft, 
  ChevronRight,
  HelpCircle,
  Check,
  X
} from "lucide-react";

export default function QuizPlayer({ quiz, onQuizComplete }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [timeTaken, setTimeTaken] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const startTimeRef = useRef(null);
  const timerRef = useRef(null);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    startTimeRef.current = new Date();
    setIsRunning(true);

    timerRef.current = setInterval(() => {
      if (isRunning && startTimeRef.current) {
        const currentTime = new Date();
        const seconds = Math.floor((currentTime - startTimeRef.current) / 1000);
        setTimeTaken(seconds);
      }
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning]);

  const handleSelect = (qIndex, option) => {
    if (!submitted) {
      setAnswers({ ...answers, [qIndex]: option });
      // Auto move to next question on mobile for better UX
      if (isMobile && qIndex < quiz.length - 1) {
        setTimeout(() => setCurrentQuestion(qIndex + 1), 300);
      }
    }
  };

  const handleSubmit = () => {
    setIsRunning(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setSubmitted(true);
    setShowConfirmation(false);

    const score = quiz.reduce((acc, q, i) => {
      const userAnswer = answers[i];
      const correctAnswer = q.answer;

      if (!userAnswer || !correctAnswer) return acc;

      const userChoice = userAnswer.charAt(0).toUpperCase();
      const correctChoice = correctAnswer.charAt(0).toUpperCase();

      return userChoice === correctChoice ? acc + 1 : acc;
    }, 0);

    onQuizComplete({
      score,
      total: quiz.length,
      timeTaken: timeTaken,
      answers: { ...answers },
      correctAnswers: quiz.map(q => q.answer),
      percentage: Math.round((score / quiz.length) * 100)
    });
  };

  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === quiz.length;

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getQuestionStatus = (index) => {
    if (answers[index]) {
      const userAnswer = answers[index];
      const correctAnswer = quiz[index]?.answer;
      if (submitted) {
        const userChoice = userAnswer.charAt(0).toUpperCase();
        const correctChoice = correctAnswer.charAt(0).toUpperCase();
        return userChoice === correctChoice ? 'correct' : 'incorrect';
      }
      return 'answered';
    }
    return 'unanswered';
  };

  const progressPercentage = (answeredCount / quiz.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50 p-2 md:p-4 lg:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Mobile Optimized Header */}
        <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200 mb-4 px-3 py-3">
          <div className="flex flex-col space-y-3">
            {/* Top row - Title and Timer */}
            <div className="flex justify-between items-center">
              <div className="flex-1 min-w-0">
                <h1 className="text-lg font-bold text-gray-900 truncate">
                  Quiz: Question {currentQuestion + 1}/{quiz.length}
                </h1>
                <p className="text-xs text-gray-600">Tap to select answer</p>
              </div>
              <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg">
                <Clock className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span className="font-mono text-sm font-bold text-gray-800">{formatTime(timeTaken)}</span>
              </div>
            </div>

            {/* Progress Bar - Mobile */}
            <div className="w-full">
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>{answeredCount}/{quiz.length} answered</span>
                <span>{Math.round(progressPercentage)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-green-500 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>

            {/* Question Quick Navigation - Mobile */}
            <div className="overflow-x-auto pb-2 -mx-2 px-2">
              <div className="flex space-x-2 min-w-max">
                {quiz.slice(0, 15).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentQuestion(index)}
                    className={`flex-shrink-0 w-7 h-7 rounded-md flex items-center justify-center text-xs font-medium transition-all
                      ${currentQuestion === index ? 'ring-2 ring-blue-500 ring-offset-1' : ''}
                      ${getQuestionStatus(index) === 'correct' ? 'bg-green-100 text-green-700 border border-green-300' :
                        getQuestionStatus(index) === 'incorrect' ? 'bg-red-100 text-red-700 border border-red-300' :
                        getQuestionStatus(index) === 'answered' ? 'bg-blue-100 text-blue-700 border border-blue-300' :
                        'bg-gray-100 text-gray-600 border border-gray-300'
                      }`}
                  >
                    {index + 1}
                  </button>
                ))}
                {quiz.length > 15 && (
                  <div className="flex-shrink-0 w-7 h-7 rounded-md bg-gray-100 flex items-center justify-center text-xs text-gray-500">
                    ...
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content - Mobile First Design */}
        <div className="space-y-4 md:space-y-6">
          {/* Current Question Card */}
          <div className="bg-white rounded-xl md:rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            {/* Question Counter */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{currentQuestion + 1}</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">Question {currentQuestion + 1}</h3>
                    <p className="text-xs text-gray-600">of {quiz.length}</p>
                  </div>
                </div>
                <div className={`text-xs font-medium px-2 py-1 rounded-full
                  ${getQuestionStatus(currentQuestion) === 'correct' ? 'bg-green-100 text-green-700' :
                    getQuestionStatus(currentQuestion) === 'incorrect' ? 'bg-red-100 text-red-700' :
                    getQuestionStatus(currentQuestion) === 'answered' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-600'
                  }`}
                >
                  {getQuestionStatus(currentQuestion) === 'correct' ? 'Correct' :
                   getQuestionStatus(currentQuestion) === 'incorrect' ? 'Incorrect' :
                   getQuestionStatus(currentQuestion) === 'answered' ? 'Answered' : 'Not answered'}
                </div>
              </div>
            </div>

            {/* Question Text */}
            <div className="p-4 md:p-6">
              <div className="prose prose-sm max-w-none mb-6">
                <p className="text-gray-800 text-base md:text-lg leading-relaxed">
                  {quiz[currentQuestion]?.question}
                </p>
              </div>

              {/* Answer Options - Touch Friendly */}
              <div className="space-y-3">
                {quiz[currentQuestion]?.options?.map((opt, j) => {
                  const optionLetter = String.fromCharCode(65 + j);
                  const isSelected = answers[currentQuestion] === opt;
                  const correctAnswer = quiz[currentQuestion]?.answer;
                  const correctChoice = correctAnswer ? correctAnswer.charAt(0).toUpperCase() : '';
                  const isCorrect = optionLetter === correctChoice;

                  return (
                    <button
                      key={j}
                      onClick={() => handleSelect(currentQuestion, opt)}
                      disabled={submitted}
                      className={`w-full text-left p-4 rounded-lg border transition-all duration-200 active:scale-[0.98] touch-manipulation
                        ${submitted
                          ? isCorrect
                            ? "bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-400"
                            : isSelected
                              ? "bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-400"
                              : "border-gray-200"
                          : isSelected
                            ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-400"
                            : "border-gray-200 active:border-blue-300 active:bg-blue-50"
                        }`}
                    >
                      <div className="flex items-center gap-3 md:gap-4">
                        <div className={`flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center text-sm md:text-base font-bold
                          ${submitted
                            ? isCorrect
                              ? "bg-green-500 text-white"
                              : isSelected
                                ? "bg-red-500 text-white"
                                : "bg-gray-100 text-gray-600"
                            : isSelected
                              ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {optionLetter}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-gray-800 text-sm md:text-base break-words text-left">{opt}</p>
                        </div>
                        {submitted && isCorrect && (
                          <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                        )}
                        {submitted && isSelected && !isCorrect && (
                          <X className="w-5 h-5 text-red-500 flex-shrink-0" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mobile Navigation Footer */}
            <div className="border-t border-gray-200 px-4 py-3 bg-gray-50">
              <div className="flex justify-between items-center">
                <button
                  onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                  disabled={currentQuestion === 0}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed
                    text-gray-700 bg-white border border-gray-300 active:bg-gray-100 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Previous</span>
                </button>

                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span className="text-sm font-medium text-gray-700">
                    {currentQuestion + 1} of {quiz.length}
                  </span>
                </div>

                <button
                  onClick={() => setCurrentQuestion(Math.min(quiz.length - 1, currentQuestion + 1))}
                  disabled={currentQuestion === quiz.length - 1}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed
                    text-gray-700 bg-white border border-gray-300 active:bg-gray-100 transition-colors"
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Stats Bar - Mobile Optimized */}
          <div className="grid grid-cols-3 gap-2 md:gap-4">
            <div className="bg-white rounded-lg border border-gray-200 p-3 text-center">
              <div className="text-2xl font-bold text-blue-600">{answeredCount}</div>
              <div className="text-xs text-gray-600">Answered</div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-3 text-center">
              <div className="text-2xl font-bold text-gray-600">{quiz.length - answeredCount}</div>
              <div className="text-xs text-gray-600">Pending</div>
            </div>
            {/* <div className="bg-white rounded-lg border border-gray-200 p-3 text-center">
              <div className="text-2xl font-bold text-green-600">
                {quiz.reduce((acc, q, i) => {
                  const userAnswer = answers[i];
                  const correctAnswer = q.answer;
                  if (!userAnswer || !correctAnswer) return acc;
                  const userChoice = userAnswer.charAt(0).toUpperCase();
                  const correctChoice = correctAnswer.charAt(0).toUpperCase();
                  return userChoice === correctChoice ? acc + 1 : acc;
                }, 0)}
              </div>
              <div className="text-xs text-gray-600">Correct</div>
            </div> */}
          </div>

          {/* Quick Tips - Mobile */}
          {!submitted && (
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200 p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <h3 className="text-sm font-semibold text-blue-800">Quick Tips</h3>
              </div>
              <div className="text-xs text-blue-700 space-y-1">
                <p>• Tap to select answer</p>
                <p>• Swipe left/right to navigate questions</p>
                <p>• Review answers before submitting</p>
              </div>
            </div>
          )}

          {/* Submit Section - Mobile Optimized */}
          {!submitted && quiz.length > 0 && (
            <div className="sticky bottom-4 z-40">
              <div className="bg-white rounded-xl shadow-2xl border border-gray-300 p-4 mx-2 md:mx-0">
                <div className="flex flex-col items-center space-y-3">
                  <div className="text-center">
                    <h3 className="text-sm font-semibold text-gray-900">Ready to submit?</h3>
                    <p className="text-xs text-gray-600 mt-1">
                      {allAnswered 
                        ? "All questions answered. Tap below to submit."
                        : `Answered: ${answeredCount}/${quiz.length}. Complete all to submit.`
                      }
                    </p>
                  </div>
                  
                  <button
                    onClick={() => allAnswered ? setShowConfirmation(true) : null}
                    disabled={!allAnswered}
                    className={`w-full py-3 rounded-xl font-semibold text-white transition-all duration-300 active:scale-95
                      ${allAnswered
                        ? "bg-gradient-to-r from-green-600 to-emerald-600 active:from-green-700 active:to-emerald-700 shadow-lg"
                        : "bg-gray-400 cursor-not-allowed"
                      }`}
                  >
                    {allAnswered ? "Submit Quiz Now" : `Complete All Questions`}
                  </button>
                  
                  {!allAnswered && (
                    <button
                      onClick={() => {
                        // Find first unanswered question
                        const firstUnanswered = quiz.findIndex((_, i) => !answers[i]);
                        if (firstUnanswered !== -1) {
                          setCurrentQuestion(firstUnanswered);
                          // Scroll to top on mobile
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }
                      }}
                      className="text-sm text-blue-600 font-medium underline active:text-blue-700"
                    >
                      Jump to first unanswered question
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Desktop Sidebar - Only on large screens */}
        <div className="hidden lg:block fixed right-6 top-24 w-72">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-5">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Question Navigation</h3>
            <div className="grid grid-cols-5 gap-2">
              {quiz.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentQuestion(index);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`w-full aspect-square rounded-lg flex items-center justify-center text-sm font-medium transition-all
                    ${currentQuestion === index ? 'ring-2 ring-blue-500 ring-offset-1' : ''}
                    ${getQuestionStatus(index) === 'correct' ? 'bg-green-100 text-green-700 border border-green-300' :
                      getQuestionStatus(index) === 'incorrect' ? 'bg-red-100 text-red-700 border border-red-300' :
                      getQuestionStatus(index) === 'answered' ? 'bg-blue-100 text-blue-700 border border-blue-300' :
                      'bg-gray-100 text-gray-600 border border-gray-300'
                    }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            
            {/* <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Status:</span>
                <div className="flex gap-2">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-gray-700">Correct</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span className="text-gray-700">Incorrect</span>
                  </div>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>

      {/* Confirmation Modal - Mobile Optimized */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-fade-in">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <HelpCircle className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Submit Quiz?</h3>
              <p className="text-gray-600 mb-6 text-sm">
                You've answered {answeredCount} out of {quiz.length} questions. You cannot change answers after submission.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-medium active:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium active:from-blue-700 active:to-purple-700 transition-all shadow-lg"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Submitted State Modal */}
      {submitted && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-fade-in text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Quiz Submitted!</h3>
            <p className="text-gray-600 mb-6 text-sm">
              Your answers have been submitted successfully.
            </p>
            <button
              onClick={handleSubmit}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold active:from-blue-700 active:to-purple-700 transition-all shadow-lg"
            >
              View Results
            </button>
          </div>
        </div>
      )}
    </div>
  );
}