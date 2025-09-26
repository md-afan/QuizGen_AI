// src/components/ConfirmationModal.jsx
import { X, Zap, FileText, User, Book } from "lucide-react";

export default function ConfirmationModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  userData, 
  numQuestions, 
  fileName 
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Confirm Quiz Generation</h2>
            <p className="text-sm text-gray-600 mt-1">Review your settings before generating</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Details */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-3 rounded-lg">
              <User className="w-5 h-5 text-blue-600 mb-1" />
              <p className="text-sm font-medium text-blue-900">Student</p>
              <p className="text-blue-700 truncate">{userData.userName}</p>
            </div>
            
            <div className="bg-green-50 p-3 rounded-lg">
              <Book className="w-5 h-5 text-green-600 mb-1" />
              <p className="text-sm font-medium text-green-900">Course</p>
              <p className="text-green-700 truncate">{userData.courseName}</p>
            </div>
          </div>

          <div className="bg-purple-50 p-3 rounded-lg">
            <FileText className="w-5 h-5 text-purple-600 mb-1" />
            <p className="text-sm font-medium text-purple-900">Document</p>
            <p className="text-purple-700 text-sm truncate">{fileName}</p>
          </div>

          <div className="bg-orange-50 p-3 rounded-lg">
            <Zap className="w-5 h-5 text-orange-600 mb-1" />
            <p className="text-sm font-medium text-orange-900">Questions</p>
            <p className="text-orange-700 font-semibold">{numQuestions} questions will be generated</p>
          </div>

          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 text-center">
              The AI will analyze your document and create a customized quiz
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Go Back
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-colors flex items-center justify-center gap-2"
          >
            <Zap className="w-4 h-4" />
            Generate Smart Quiz
          </button>
        </div>
      </div>
    </div>
  );
}