import { useState, useEffect, useRef, useCallback } from "react";
import { 
  Clock, 
  Check,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Circle,
  CheckCircle,
  XCircle,
  Send
} from "lucide-react";

export default function QuizPlayer({ quiz, onQuizComplete }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [timeTaken, setTimeTaken] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  
  const startTimeRef = useRef(null);
  const timerRef = useRef(null);
  const submitLockRef = useRef(false);

  // Detect mobile device once
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Timer setup
  useEffect(() => {
    startTimeRef.current = new Date();
    const timer = setInterval(() => {
      const currentTime = new Date();
      const seconds = Math.floor((currentTime - startTimeRef.current) / 1000);
      setTimeTaken(seconds);
    }, 1000);

    timerRef.current = timer;
    return () => clearInterval(timer);
  }, []);

  // Handle answer selection
  const handleSelect = useCallback((option) => {
    if (submitted) return;
    
    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: option
    }));
  }, [currentQuestion, submitted]);

  // Submit quiz with protection against duplicate submissions
  const handleSubmit = useCallback(() => {
    if (submitLockRef.current || hasSubmitted) return;
    
    submitLockRef.current = true;
    setHasSubmitted(true);
    setSubmitted(true);
    
    // Clear timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    // Calculate score
    const score = quiz.reduce((acc, q, i) => {
      const userAnswer = answers[i];
      const correctAnswer = q.answer;
      
      if (!userAnswer || !correctAnswer) return acc;
      
      const userChoice = userAnswer.charAt(0).toUpperCase();
      const correctChoice = correctAnswer.charAt(0).toUpperCase();
      
      return userChoice === correctChoice ? acc + 1 : acc;
    }, 0);
    
    // Delay results slightly for better UX
    setTimeout(() => {
      onQuizComplete({
        score,
        total: quiz.length,
        timeTaken,
        answers: { ...answers },
        correctAnswers: quiz.map(q => q.answer),
        percentage: Math.round((score / quiz.length) * 100)
      });
    }, 300);
  }, [answers, quiz, timeTaken, onQuizComplete, hasSubmitted]);

  // Format time display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate progress
  const answeredCount = Object.keys(answers).length;
  const progress = (answeredCount / quiz.length) * 100;
  const allAnswered = answeredCount === quiz.length;

  // Get current question status
  const getAnswerStatus = (questionIndex) => {
    if (!answers[questionIndex]) return 'unanswered';
    
    if (submitted) {
      const userAnswer = answers[questionIndex];
      const correctAnswer = quiz[questionIndex]?.answer;
      if (!userAnswer || !correctAnswer) return 'unanswered';
      
      const userChoice = userAnswer.charAt(0).toUpperCase();
      const correctChoice = correctAnswer.charAt(0).toUpperCase();
      
      return userChoice === correctChoice ? 'correct' : 'incorrect';
    }
    
    return 'answered';
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft' && currentQuestion > 0) {
        setCurrentQuestion(prev => prev - 1);
      } else if (e.key === 'ArrowRight' && currentQuestion < quiz.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else if (e.key >= '1' && e.key <= '4') {
        const optionIndex = parseInt(e.key) - 1;
        if (quiz[currentQuestion]?.options[optionIndex]) {
          handleSelect(quiz[currentQuestion].options[optionIndex]);
        }
      } else if (e.key === 'Enter' && allAnswered && !submitted) {
        handleSubmit();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentQuestion, quiz, handleSelect, allAnswered, submitted, handleSubmit]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Minimal Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between">
            {/* Timer */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg">
              <Clock className="w-4 h-4 text-gray-600" />
              <span className="font-mono text-sm font-medium text-gray-800">
                {formatTime(timeTaken)}
              </span>
            </div>

            {/* Question Counter */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg">
              <span className="text-sm font-medium text-gray-800">
                {currentQuestion + 1} / {quiz.length}
              </span>
            </div>
          </div>

          {/* Single Progress Bar */}
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-600 transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Question Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          {/* Question Header */}
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-500">
                  Question {currentQuestion + 1}
                </span>
                {submitted && (
                  <span className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${
                    getAnswerStatus(currentQuestion) === 'correct' 
                      ? 'bg-green-50 text-green-700'
                      : 'bg-red-50 text-red-700'
                  }`}>
                    {getAnswerStatus(currentQuestion) === 'correct' ? (
                      <>
                        <CheckCircle className="w-3 h-3" />
                        Correct
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3 h-3" />
                        Incorrect
                      </>
                    )}
                  </span>
                )}
              </div>
              
              {!submitted && answers[currentQuestion] && (
                <span className="text-xs text-blue-600 font-medium flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  Answered
                </span>
              )}
            </div>
          </div>

          {/* Question Text */}
          <div className="px-6 py-8">
            <h2 className="text-xl font-medium text-gray-900 leading-relaxed">
              {quiz[currentQuestion]?.question}
            </h2>
          </div>

          {/* Answer Options */}
          <div className="px-6 pb-8 space-y-3">
            {quiz[currentQuestion]?.options?.map((option, index) => {
              const letter = String.fromCharCode(65 + index);
              const isSelected = answers[currentQuestion] === option;
              const correctAnswer = quiz[currentQuestion]?.answer;
              const isCorrect = correctAnswer && letter === correctAnswer.charAt(0).toUpperCase();
              
              return (
                <button
                  key={index}
                  onClick={() => handleSelect(option)}
                  disabled={submitted}
                  className={`w-full text-left p-4 rounded-lg border transition-colors duration-150 ${
                    submitted
                      ? isCorrect
                        ? 'bg-green-50 border-green-300'
                        : isSelected
                          ? 'bg-red-50 border-red-300'
                          : 'border-gray-200'
                      : isSelected
                        ? 'bg-blue-50 border-blue-400'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-md flex items-center justify-center text-sm font-medium ${
                      submitted
                        ? isCorrect
                          ? 'bg-green-100 text-green-700'
                          : isSelected
                            ? 'bg-red-100 text-red-700'
                            : 'bg-gray-100 text-gray-600'
                        : isSelected
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-600'
                    }`}>
                      {letter}
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-800">{option}</p>
                    </div>
                    {submitted && isCorrect && (
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                    )}
                    {submitted && isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-1" />
                    )}
                    {!submitted && isSelected && (
                      <Circle className="w-5 h-5 text-blue-500 fill-blue-500 flex-shrink-0 mt-1" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Navigation Footer */}
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
                disabled={currentQuestion === 0}
                className="flex items-center gap-2 px-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg 
                  hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Previous question"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Previous</span>
              </button>

              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">
                  {answeredCount} of {quiz.length} answered
                </span>
              </div>

              {currentQuestion < quiz.length - 1 ? (
                <button
                  onClick={() => setCurrentQuestion(prev => Math.min(quiz.length - 1, prev + 1))}
                  disabled={currentQuestion === quiz.length - 1}
                  className="flex items-center gap-2 px-4 py-2.5 text-white bg-blue-600 rounded-lg 
                    hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="Next question"
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={!allAnswered || submitted || hasSubmitted}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-colors ${
                    allAnswered && !submitted && !hasSubmitted
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                  aria-label="Submit quiz"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Quiz</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Question Quick Navigation (Mobile) */}
        {isMobile && (
          <div className="mt-6">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
              <span>Jump to question:</span>
              <span className="text-xs">Tap number</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {quiz.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuestion(index)}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium transition-colors ${
                    currentQuestion === index
                      ? 'bg-blue-600 text-white'
                      : getAnswerStatus(index) === 'correct'
                        ? 'bg-green-100 text-green-700 border border-green-300'
                        : getAnswerStatus(index) === 'incorrect'
                          ? 'bg-red-100 text-red-700 border border-red-300'
                          : getAnswerStatus(index) === 'answered'
                            ? 'bg-blue-100 text-blue-700 border border-blue-300'
                            : 'bg-gray-100 text-gray-600 border border-gray-300'
                  }`}
                  aria-label={`Question ${index + 1}`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Completion Warning */}
        {allAnswered && !submitted && !hasSubmitted && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-blue-800 font-medium">
                  All questions answered
                </p>
                <p className="text-sm text-blue-600 mt-1">
                  Review your answers before submitting. You cannot change answers after submission.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Desktop Question Navigation */}
        {!isMobile && (
          <div className="mt-8">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Question Navigation</h3>
              <div className="grid grid-cols-10 gap-2">
                {quiz.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentQuestion(index)}
                    className={`aspect-square rounded-md flex items-center justify-center text-sm font-medium transition-colors ${
                      currentQuestion === index
                        ? 'bg-blue-600 text-white ring-2 ring-blue-300'
                        : getAnswerStatus(index) === 'correct'
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : getAnswerStatus(index) === 'incorrect'
                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                            : getAnswerStatus(index) === 'answered'
                              ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    aria-label={`Question ${index + 1}`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Submission Confirmation Modal */}
      {!submitted && allAnswered && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full animate-fade-in">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mx-auto mb-4">
                <AlertCircle className="w-6 h-6 text-blue-600" />
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
                Ready to submit?
              </h3>
              
              <p className="text-gray-600 text-center mb-6">
                You've answered all {quiz.length} questions. This action cannot be undone.
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Time taken:</span>
                  <span className="font-medium text-gray-900">{formatTime(timeTaken)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Questions answered:</span>
                  <span className="font-medium text-gray-900">{answeredCount}/{quiz.length}</span>
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setCurrentQuestion(0)}
                  className="flex-1 py-2.5 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Review Answers
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 py-2.5 text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Submit Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Submitted Success State */}
      {submitted && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full animate-fade-in">
            <div className="p-6 text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto mb-4">
                <Check className="w-6 h-6 text-green-600" />
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Quiz Submitted
              </h3>
              
              <p className="text-gray-600 mb-6">
                Your answers have been recorded successfully. Processing results...
              </p>
              
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}