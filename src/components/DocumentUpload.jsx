import { useState } from "react";
import { Upload, FileText } from "lucide-react";

export default function DocumentUpload({ onTextExtracted }) {
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState(0);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (max 1MB)
    if (file.size > 1024 * 1024) {
      alert("File size too large. Please upload a file smaller than 1MB.");
      return;
    }

    setFileName(file.name);
    setFileSize(file.size);

    try {
      const text = await file.text();
      
      // Validate text content
      if (text.trim().length < 10) {
        alert("The document content is too short. Please upload a document with at least 50 characters of text.");
        return;
      }

      console.log("File content extracted:", text.substring(0, 200) + "...");
      onTextExtracted(text);
    } catch (error) {
      console.error("Error reading file:", error);
      alert("Error reading file. Please try again with a different file.");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
        <Upload className="w-5 h-5 text-blue-600" />
        Upload Document (.txt)
      </h2>
      
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        
        <input
          type="file"
          accept=".txt"
          onChange={handleFileChange}
          className="absolute opacity-0 w-full h-full cursor-pointer"
          id="file-upload"
        />
        
        <label htmlFor="file-upload" className="cursor-pointer">
          <span className="text-blue-600 font-semibold">Click to upload</span>
          <span className="text-gray-600"> or drag and drop</span>
        </label>
        
        <p className="text-sm text-gray-500 mt-2">
          TXT files only (max 1MB)
        </p>
      </div>
      
      {fileName && (
        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2 text-green-700">
            <FileText className="w-4 h-4" />
            <span className="font-medium">✓ {fileName}</span>
          </div>
          <p className="text-sm text-green-600 mt-1">
            {(fileSize / 1024).toFixed(1)} KB • Ready for quiz generation
          </p>
        </div>
      )}
    </div>
  );
}