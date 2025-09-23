import { useState, useRef } from "react";
import { Upload, FileText, File, X, Loader } from "lucide-react";

export default function DocumentUpload({ onTextExtracted }) {
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState(0);
  const [fileType, setFileType] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

  const isValidFileType = (file) => {
    const allowedTypes = ['text/plain', 'application/pdf'];
    const allowedExtensions = ['.txt', '.pdf'];
    const fileExtension = file.name.toLowerCase().slice((file.name.lastIndexOf(".") - 1 >>> 0) + 2);
    
    return allowedTypes.includes(file.type) || allowedExtensions.includes('.' + fileExtension);
  };

  const handleFile = async (file) => {
    if (!file) return;

    setError("");
    setIsLoading(true);

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      const errorMsg = `File size too large. Please upload a file smaller than 5MB. Your file: ${(file.size / (1024 * 1024)).toFixed(2)}MB`;
      setError(errorMsg);
      setIsLoading(false);
      return;
    }

    // Check file type
    if (!isValidFileType(file)) {
      const errorMsg = "Please upload a valid TXT or PDF file.";
      setError(errorMsg);
      setIsLoading(false);
      return;
    }

    try {
      // Convert file to base64 for Gemini API
      const base64String = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          // Remove the data URL prefix (e.g., "data:application/pdf;base64,")
          const base64 = reader.result.split(',')[1];
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      // Store file info and base64 data
      setFileName(file.name);
      setFileSize(file.size);
      setFileType(file.type);
      
      // Pass file object to parent component
      onTextExtracted({
        type: 'file',
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        base64Data: base64String,
        mimeType: file.type
      });
      
    } catch (error) {
      console.error("Error processing file:", error);
      setError("Error processing file. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    await handleFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      await handleFile(files[0]);
    }
  };

  const handleRemoveFile = () => {
    setFileName("");
    setFileSize(0);
    setFileType("");
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onTextExtracted(""); // Clear the text
  };

  const handleRetry = () => {
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const getFileIcon = () => {
    if (fileType === 'application/pdf' || fileName.toLowerCase().endsWith('.pdf')) {
      return <File className="w-12 h-12 text-red-500" />;
    }
    return <FileText className="w-12 h-12 text-blue-500" />;
  };

  const getFileTypeText = () => {
    if (fileType === 'application/pdf' || fileName.toLowerCase().endsWith('.pdf')) {
      return "PDF Document";
    }
    if (fileType === 'text/plain' || fileName.toLowerCase().endsWith('.txt')) {
      return "Text Document";
    }
    return "Document";
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
        <Upload className="w-5 h-5 text-blue-600" />
        Upload Document (.txt or .pdf)
      </h2>
      
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
          isDragging 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-gray-300 hover:border-blue-400'
        } ${isLoading ? 'opacity-50' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".txt,.pdf"
          onChange={handleFileChange}
          className="absolute opacity-0 w-0 h-0"
          id="file-upload"
          disabled={isLoading}
        />
        
        {isLoading ? (
          <div className="flex flex-col items-center">
            <Loader className="w-12 h-12 text-blue-600 animate-spin mb-4" />
            <p className="text-gray-600">Processing document...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center">
            <File className="w-12 h-12 text-red-500 mb-4" />
            <p className="text-red-600 font-medium mb-2">Upload Failed</p>
            <p className="text-sm text-red-600 mb-4">{error}</p>
            <button
              onClick={handleRetry}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
            >
              Try Again
            </button>
          </div>
        ) : fileName ? (
          <div className="flex flex-col items-center">
            {getFileIcon()}
            <div className="mt-4 text-center">
              <p className="font-semibold text-gray-800">{fileName}</p>
              <p className="text-sm text-gray-600 mt-1">
                {getFileTypeText()} • {(fileSize / 1024).toFixed(1)} KB
              </p>
              <button
                onClick={handleRemoveFile}
                className="mt-3 px-4 py-2 text-red-600 hover:text-red-800 text-sm flex items-center gap-1 mx-auto"
              >
                <X className="w-4 h-4" />
                Remove File
              </button>
            </div>
          </div>
        ) : (
          <>
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <label htmlFor="file-upload" className="cursor-pointer">
              <span className="text-blue-600 font-semibold">Click to upload</span>
              <span className="text-gray-600"> or drag and drop</span>
            </label>
            <p className="text-sm text-gray-500 mt-2">
              TXT or PDF files only (max 5MB)
            </p>
            <div className="mt-4 flex justify-center gap-4 text-xs text-gray-500">
              <span className="bg-gray-100 px-2 py-1 rounded">.txt</span>
              <span className="bg-gray-100 px-2 py-1 rounded">.pdf</span>
            </div>
          </>
        )}
      </div>
      
      {fileName && !isLoading && !error && (
        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2 text-green-700">
            {getFileIcon()}
            <span className="font-medium">{fileName}</span>
          </div>
          <p className="text-sm text-green-600 mt-1">
            {(fileSize / 1024).toFixed(1)} KB • Ready for quiz generation
          </p>
          <p className="text-xs text-green-500 mt-1">
            File will be processed directly by Gemini AI
          </p>
        </div>
      )}

      {/* File Requirements */}
      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-blue-800 mb-2">File Requirements:</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Supported formats: TXT, PDF</li>
          <li>• Maximum file size: 5MB</li>
          <li>• Gemini AI will process the file directly</li>
          <li>• No text extraction needed on your device</li>
        </ul>
      </div>
    </div>
  );
}