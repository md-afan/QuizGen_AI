import { useState, useRef } from "react";
import { Upload, FileText, File, X, Loader, FileText as DocxIcon } from "lucide-react";
import * as mammoth from 'mammoth';

export default function DocumentUpload({ onTextExtracted }) {
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState(0);
  const [fileType, setFileType] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB in bytes

  const isValidFileType = (file) => {
    const allowedTypes = [
      'text/plain', 
      'application/pdf', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    const allowedExtensions = ['.txt', '.pdf', '.docx'];
    const fileExtension = file.name.toLowerCase().slice((file.name.lastIndexOf(".") - 1 >>> 0) + 2);
    
    return allowedTypes.includes(file.type) || allowedExtensions.includes('.' + fileExtension);
  };

  const extractTextFromDocx = async (file) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      return result.value;
    } catch (error) {
      throw new Error(`Failed to extract text from DOCX: ${error.message}`);
    }
  };

  const extractTextFromPDF = async (file) => {
    try {
      // Dynamic import to avoid including pdf-parse in initial bundle
      const pdfModule = await import('pdf-parse/lib/pdf-parse.js');
      const pdf = pdfModule.default || pdfModule;
      
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async function(e) {
          try {
            const typedArray = new Uint8Array(e.target.result);
            const pdfData = await pdf(typedArray);
            resolve(pdfData.text);
          } catch (error) {
            reject(error);
          }
        };
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
      });
    } catch (error) {
      throw new Error(`Failed to parse PDF: ${error.message}`);
    }
  };

  const handleFile = async (file) => {
    if (!file) return;

    setError("");
    setIsLoading(true);

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      const errorMsg = `File size too large. Please upload a file smaller than 20MB. Your file: ${(file.size / (1024 * 1024)).toFixed(2)}MB`;
      setError(errorMsg);
      setIsLoading(false);
      return;
    }

    // Check file type
    if (!isValidFileType(file)) {
      const errorMsg = "Please upload a valid TXT, PDF, or DOCX file.";
      setError(errorMsg);
      setIsLoading(false);
      return;
    }

    try {
      let textContent = "";
      let shouldSendAsFile = false;

      // Handle different file types
      if (file.type === 'text/plain' || file.name.toLowerCase().endsWith('.txt')) {
        // TXT file - read as text
        textContent = await file.text();
      } 
      else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
               file.name.toLowerCase().endsWith('.docx')) {
        // DOCX file - extract text using mammoth
        textContent = await extractTextFromDocx(file);
        
        // Validate extracted text
        if (!textContent || textContent.trim().length < 10) {
          throw new Error("The DOCX file appears to be empty or contains insufficient text.");
        }
      }
      else if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
        // PDF file - send as base64 to Gemini for better processing
        shouldSendAsFile = true;
        textContent = await extractTextFromPDF(file);
        
        // Validate PDF text extraction
        if (!textContent || textContent.trim().length < 10) {
          console.warn("PDF text extraction may be limited. Sending file to Gemini for better processing.");
        }
      }

      // Store file info
      setFileName(file.name);
      setFileSize(file.size);
      setFileType(file.type);

      if (shouldSendAsFile) {
        // For PDF files, send as base64 to Gemini
        const base64String = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const base64 = reader.result.split(',')[1];
            resolve(base64);
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        onTextExtracted({
          type: 'file',
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          base64Data: base64String,
          mimeType: file.type
        });
      } else {
        // For TXT and DOCX files, send as text
        onTextExtracted(textContent);
      }
      
    } catch (error) {
      console.error("Error processing file:", error);
      setError(error.message || "Error processing file. Please try again.");
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
    if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
        fileName.toLowerCase().endsWith('.docx')) {
      return <DocxIcon className="w-12 h-12 text-blue-600" />;
    }
    return <FileText className="w-12 h-12 text-green-500" />;
  };

  const getFileTypeText = () => {
    if (fileType === 'application/pdf' || fileName.toLowerCase().endsWith('.pdf')) {
      return "PDF Document";
    }
    if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
        fileName.toLowerCase().endsWith('.docx')) {
      return "Word Document";
    }
    if (fileType === 'text/plain' || fileName.toLowerCase().endsWith('.txt')) {
      return "Text Document";
    }
    return "Document";
  };

  const getFileTypeColor = () => {
    if (fileType === 'application/pdf' || fileName.toLowerCase().endsWith('.pdf')) {
      return "text-red-600 bg-red-50 border-red-200";
    }
    if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
        fileName.toLowerCase().endsWith('.docx')) {
      return "text-blue-600 bg-blue-50 border-blue-200";
    }
    return "text-green-600 bg-green-50 border-green-200";
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
        <Upload className="w-5 h-5 text-blue-600" />
        Upload Document (.txt, .pdf, or .docx)
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
          accept=".txt,.pdf,.docx"
          onChange={handleFileChange}
          className="absolute opacity-0 w-0 h-0"
          id="file-upload"
          disabled={isLoading}
        />
        
        {isLoading ? (
          <div className="flex flex-col items-center">
            <Loader className="w-12 h-12 text-blue-600 animate-spin mb-4" />
            <p className="text-gray-600">Processing document...</p>
            <p className="text-sm text-gray-500 mt-1">
              {fileName.toLowerCase().endsWith('.docx') 
                ? "Extracting text from Word document..." 
                : "Reading file content..."}
            </p>
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
                {getFileTypeText()} • {(fileSize / (1024 * 1024)).toFixed(2)} MB
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
              TXT, PDF, or DOCX files only (max 20MB)
            </p>
            <div className="mt-4 flex justify-center gap-4 text-xs text-gray-500">
              <span className="bg-gray-100 px-2 py-1 rounded">.txt</span>
              <span className="bg-gray-100 px-2 py-1 rounded">.pdf</span>
              <span className="bg-gray-100 px-2 py-1 rounded">.docx</span>
            </div>
          </>
        )}
      </div>
      
      {fileName && !isLoading && !error && (
        <div className={`mt-3 p-3 border rounded-lg ${getFileTypeColor()}`}>
          <div className="flex items-center gap-2">
            {getFileIcon()}
            <span className="font-medium">{fileName}</span>
          </div>
          <p className="text-sm mt-1">
            {(fileSize / (1024 * 1024)).toFixed(2)} MB • Ready for quiz generation
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {fileName.toLowerCase().endsWith('.docx') 
              ? "Text extracted from Word document" 
              : "File will be processed by Gemini AI"}
          </p>
        </div>
      )}

      {/* File Requirements */}
      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-blue-800 mb-2">File Requirements:</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Supported formats: TXT, PDF, DOCX</li>
          <li>• Maximum file size: 20MB</li>
          <li>• DOCX files will be converted to text for processing</li>
          <li>• PDF files should have selectable text for best results</li>
        </ul>
      </div>

      {/* DOCX Specific Tips */}
      <div className="mt-3 p-4 bg-green-50 rounded-lg">
        <h4 className="font-semibold text-green-800 mb-2">DOCX Support:</h4>
        <ul className="text-sm text-green-700 space-y-1">
          <li>• Word documents (.docx) are fully supported</li>
          <li>• Text, formatting, and basic structure are preserved</li>
          <li>• Images and complex tables may not be fully extracted</li>
          <li>• For best results, ensure text is selectable in your document</li>
        </ul>
      </div>
    </div>
  );
}