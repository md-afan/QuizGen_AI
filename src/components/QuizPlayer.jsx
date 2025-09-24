import { useState, useEffect, useRef } from "react";
import { CheckCircle2, Clock } from "lucide-react";

export default function QuizPlayer({ quiz, onQuizComplete }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [timeTaken, setTimeTaken] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const startTimeRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    // Start timer when component mounts
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
    }
  };

  const handleSubmit = () => {
    setIsRunning(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    setSubmitted(true);

    // Calculate score properly
    const score = quiz.reduce((acc, q, i) => {
      const userAnswer = answers[i];
      const correctAnswer = q.answer;

      if (!userAnswer || !correctAnswer) return acc;

      // Compare first character (A, B, C, D) to handle different formats
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

  const currentScore = quiz.reduce((acc, q, i) => {
    const userAnswer = answers[i];
    const correctAnswer = q.answer;

    if (!userAnswer || !correctAnswer) return acc;

    const userChoice = userAnswer.charAt(0).toUpperCase();
    const correctChoice = correctAnswer.charAt(0).toUpperCase();

    return userChoice === correctChoice ? acc + 1 : acc;
  }, 0);

  const allAnswered = Object.keys(answers).length === quiz.length;

  // Format time to MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Timer and Progress Header */}
      <div className="flex justify-between items-center p-4 bg-white rounded-2xl shadow-md">
        <div className="flex items-center gap-2 text-gray-600">
          <Clock className="w-5 h-5" />
          <span className="font-mono text-lg font-bold">{formatTime(timeTaken)}</span>
        </div>
        <div className="text-lg font-semibold">
          {Object.keys(answers).length}/{quiz.length} Answered
        </div>
        <div className="text-lg font-semibold text-blue-600">
          Score: {currentScore}/{quiz.length}
        </div>
      </div>

      {/* Questions */}
      {quiz.map((q, i) => (
        <div key={i} className="p-6 bg-white rounded-2xl shadow-md border border-gray-100">
          <h3 className="text-lg font-semibold mb-1 text-gray-800">
            Question {i + 1} of {quiz.length}
          </h3>
          <p className="text-gray-700 mb-4 text-base leading-relaxed">{q.question}</p>
          <div className="space-y-3">
            {q.options && q.options.map((opt, j) => {
              const isSelected = answers[i] === opt;
              const correctAnswer = q.answer;
              const userChoice = answers[i] ? answers[i].charAt(0).toUpperCase() : '';
              const correctChoice = correctAnswer ? correctAnswer.charAt(0).toUpperCase() : '';
              const optionLetter = String.fromCharCode(65 + j);
              const isCorrect = optionLetter === correctChoice;

              return (
                <label
                  key={j}
                  className={`block px-4 py-3 rounded-lg cursor-pointer border transition-all duration-200 ${submitted
                      ? isCorrect
                        ? "bg-green-100 border-green-400 text-green-800"
                        : isSelected
                          ? "bg-red-100 border-red-400 text-red-800"
                          : "border-gray-200 text-gray-600"
                      : isSelected
                        ? "bg-blue-100 border-blue-400 text-blue-800"
                        : "hover:bg-gray-50 border-gray-200 text-gray-700"
                    }`}
                >
                  <input
                    type="radio"
                    name={`q-${i}`}
                    value={opt}
                    checked={isSelected}
                    disabled={submitted}
                    onChange={() => handleSelect(i, opt)}
                    className="hidden"
                  />
                  <span className="font-medium mr-3">{optionLetter}.</span>
                  {opt}
                  {submitted && isCorrect && (
                    <CheckCircle2 className="w-4 h-4 inline ml-2 text-green-600" />
                  )}
                </label>
              );
            })}
          </div>
        </div>
      ))}

      {/* Submit Button */}
      {!submitted && quiz.length > 0 && (
        <button
          onClick={handleSubmit}
          disabled={!allAnswered}
          className={`w-full py-4 text-white rounded-xl font-semibold text-lg transition-all duration-200 ${allAnswered
              ? "bg-green-600 hover:bg-green-700 shadow-lg"
              : "bg-gray-400 cursor-not-allowed"
            }`}
        >
          {allAnswered
            ? "Submit Quiz"  // Changed from showing score to just "Submit Quiz"
            : `Answer all ${quiz.length} questions to submit`}
        </button>
      )}
    </div>
  );
}