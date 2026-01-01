import { useState, useRef } from "react";
import { 
  Upload, 
  FileText, 
  File, 
  X, 
  Loader, 
  FileText as DocxIcon, 
  Image as ImageIcon,
  Zap 
} from "lucide-react";
import * as mammoth from 'mammoth';

export default function DocumentUpload({ onTextExtracted }) {
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState(0);
  const [fileType, setFileType] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB in bytes
  const MAX_IMAGE_SIZE = 6 * 1024 * 1024; // 6MB in bytes

  const isValidFileType = (file) => {
    const allowedTypes = [
      'text/plain', 
      'application/pdf', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/png',
      'image/jpeg',
      'image/jpg',
      'image/gif',
      'image/webp'
    ];
    const allowedExtensions = ['.txt', '.pdf', '.docx', '.png', '.jpg', '.jpeg', '.gif', '.webp'];
    const fileExtension = file.name.toLowerCase().slice((file.name.lastIndexOf(".") - 1 >>> 0) + 2);
    
    return allowedTypes.includes(file.type) || allowedExtensions.includes('.' + fileExtension);
  };

  const isImageFile = (file) => {
    const imageTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'];
    const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp'];
    const fileExtension = file.name.toLowerCase().slice((file.name.lastIndexOf(".") - 1 >>> 0) + 2);
    
    return imageTypes.includes(file.type) || imageExtensions.includes('.' + fileExtension);
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
      const pdfjsLib = await import('pdfjs-dist');
      
      if (typeof window !== 'undefined' && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
        const pdfjsVersion = '3.11.174';
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsVersion}/pdf.worker.min.js`;
      }

      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async function(e) {
          try {
            const typedArray = new Uint8Array(e.target.result);
            const pdf = await pdfjsLib.getDocument(typedArray).promise;
            
            let text = '';
            for (let i = 1; i <= pdf.numPages; i++) {
              const page = await pdf.getPage(i);
              const textContent = await page.getTextContent();
              text += textContent.items.map(item => item.str).join(' ') + '\n';
            }
            
            resolve(text.trim());
          } catch (parseError) {
            console.error('PDF.js parsing error:', parseError);
            try {
              const PDFParse = await import('pdf-parse');
              const pdfParse = PDFParse.default || PDFParse;
              const pdfData = await pdfParse(typedArray);
              resolve(pdfData.text || '');
            } catch (fallbackError) {
              reject(new Error('PDF text extraction failed. The PDF might be image-based.'));
            }
          }
        };
        reader.onerror = () => reject(new Error('Failed to read PDF file'));
        reader.readAsArrayBuffer(file);
      });
    } catch (error) {
      throw new Error(`PDF processing error: ${error.message}`);
    }
  };

  const handleFile = async (file) => {
    if (!file) return;

    setError("");
    setIsLoading(true);
    setPreview(null);

    // Check if it's an image
    const isImage = isImageFile(file);
    
    // Check file size based on type
    const maxSize = isImage ? MAX_IMAGE_SIZE : MAX_FILE_SIZE;
    const sizeLabel = isImage ? "6MB" : "25MB";
    
    if (file.size > maxSize) {
      const errorMsg = `File size too large. ${isImage ? "Images" : "Files"} must be smaller than ${sizeLabel}. Your file: ${(file.size / (1024 * 1024)).toFixed(2)}MB`;
      setError(errorMsg);
      setIsLoading(false);
      return;
    }

    // Check file type
    if (!isValidFileType(file)) {
      const errorMsg = `Please upload a valid ${isImage ? "image (PNG, JPG, JPEG, GIF, WEBP)" : "TXT, PDF, or DOCX file"}.`;
      setError(errorMsg);
      setIsLoading(false);
      return;
    }

    try {
      let textContent = "";
      let shouldSendAsFile = false;

      // Handle images
      if (isImage) {
        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreview(e.target.result);
        };
        reader.readAsDataURL(file);
        
        // Images are always sent as file to Gemini Vision
        shouldSendAsFile = true;
      }
      // Handle text files
      else if (file.type === 'text/plain' || file.name.toLowerCase().endsWith('.txt')) {
        textContent = await file.text();
        
        if (!textContent || textContent.trim().length < 10) {
          throw new Error("The text file is too short. Please upload a file with at least 10 characters of text.");
        }
      } 
      else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
               file.name.toLowerCase().endsWith('.docx')) {
        textContent = await extractTextFromDocx(file);
        
        if (!textContent || textContent.trim().length < 10) {
          throw new Error("The DOCX file appears to be empty or contains insufficient text.");
        }
      }
      else if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
        try {
          textContent = await extractTextFromPDF(file);
          
          if (textContent && textContent.trim().length >= 10) {
            shouldSendAsFile = false;
          } else {
            shouldSendAsFile = true;
            console.warn("PDF text extraction limited. Sending file to Gemini for processing.");
          }
        } catch (pdfError) {
          shouldSendAsFile = true;
          console.warn("PDF text extraction failed. Sending file to Gemini:", pdfError.message);
        }
      }

      // Store file info
      setFileName(file.name);
      setFileSize(file.size);
      setFileType(file.type);

      if (shouldSendAsFile) {
        const base64String = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            try {
              const base64 = reader.result.split(',')[1];
              resolve(base64);
            } catch (error) {
              reject(new Error('Failed to convert file to base64'));
            }
          };
          reader.onerror = () => reject(new Error('Failed to read file'));
          reader.readAsDataURL(file);
        });

        onTextExtracted({
          type: 'file',
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          base64Data: base64String,
          mimeType: file.type,
          isImage: isImage
        });
      } else {
        onTextExtracted(textContent);
      }
      
    } catch (error) {
      console.error("Error processing file:", error);
      setError(error.message || "Error processing file. Please try a different file.");
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
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onTextExtracted("");
  };

  const handleRetry = () => {
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const getFileIcon = () => {
    if (isImageFile({name: fileName, type: fileType})) {
      return <ImageIcon className="w-12 h-12 text-pink-500" />;
    }
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
    if (isImageFile({name: fileName, type: fileType})) {
      return "Image File";
    }
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
    if (isImageFile({name: fileName, type: fileType})) {
      return "text-pink-600 bg-pink-50 border-pink-200";
    }
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
        Upload Content (.txt, .pdf, .docx, .png, .jpg, .jpeg)
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
          accept=".txt,.pdf,.docx,.png,.jpg,.jpeg,.gif,.webp"
          onChange={handleFileChange}
          className="absolute opacity-0 w-0 h-0"
          id="file-upload"
          disabled={isLoading}
        />
        
        {isLoading ? (
          <div className="flex flex-col items-center">
            <Loader className="w-12 h-12 text-blue-600 animate-spin mb-4" />
            <p className="text-gray-600">Processing {isImageFile({name: fileName, type: fileType}) ? "image" : "document"}...</p>
            <p className="text-sm text-gray-500 mt-1">
              {fileName.toLowerCase().endsWith('.docx') 
                ? "Extracting text from Word document..." 
                : fileName.toLowerCase().endsWith('.pdf')
                ? "Analyzing PDF content..."
                : isImageFile({name: fileName, type: fileType})
                ? "Preparing image for AI Vision analysis..."
                : "Reading file content..."}
            </p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center">
            <File className="w-12 h-12 text-red-500 mb-4" />
            <p className="text-red-600 font-medium mb-2">Upload Failed</p>
            <p className="text-sm text-red-600 mb-4 text-center max-w-sm">{error}</p>
            <div className="flex gap-2">
              <button
                onClick={handleRetry}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
              >
                Try Again
              </button>
              <button
                onClick={() => setError("")}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm"
              >
                Try Different File
              </button>
            </div>
          </div>
        ) : fileName ? (
          <div className="flex flex-col items-center">
            {preview ? (
              <div className="mb-4">
                <img 
                  src={preview} 
                  alt="Preview" 
                  className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200 shadow-sm"
                />
              </div>
            ) : (
              getFileIcon()
            )}
            <div className="mt-4 text-center">
              <p className="font-semibold text-gray-800 truncate max-w-xs">{fileName}</p>
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
              Documents (25MB max) or Images (6MB max)
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs text-gray-500">
              <span className="bg-gray-100 px-2 py-1 rounded">.txt</span>
              <span className="bg-gray-100 px-2 py-1 rounded">.pdf</span>
              <span className="bg-gray-100 px-2 py-1 rounded">.docx</span>
              <span className="bg-gray-100 px-2 py-1 rounded">.png</span>
              <span className="bg-gray-100 px-2 py-1 rounded">.jpg</span>
              <span className="bg-gray-100 px-2 py-1 rounded">.jpeg</span>
            </div>
          </>
        )}
      </div>
      
      {fileName && !isLoading && !error && (
        <div className={`mt-3 p-3 border rounded-lg ${getFileTypeColor()}`}>
          <div className="flex items-center gap-2">
            {getFileIcon()}
            <div className="flex-1">
              <span className="font-medium">{fileName}</span>
              <p className="text-sm mt-1">
                {(fileSize / (1024 * 1024)).toFixed(2)} MB • Ready for quiz generation
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {isImageFile({name: fileName, type: fileType}) 
                  ? "Image will be processed by Gemini Vision AI"
                  : fileName.toLowerCase().endsWith('.docx') 
                  ? "Text extracted from Word document" 
                  : fileName.toLowerCase().endsWith('.pdf')
                  ? "PDF will be processed by Gemini AI"
                  : "Text content ready for processing"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* File Requirements */}
      <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
        <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
          <File className="w-4 h-4" />
          File Requirements:
        </h4>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h5 className="text-sm font-medium text-blue-700 mb-1">📄 Documents</h5>
            <ul className="text-xs text-blue-600 space-y-1">
              <li>• Formats: TXT, PDF, DOCX</li>
              <li>• Maximum size: 25MB</li>
              <li>• Minimum text: 10 characters</li>
            </ul>
          </div>
          <div>
            <h5 className="text-sm font-medium text-pink-700 mb-1">🖼️ Images</h5>
            <ul className="text-xs text-pink-600 space-y-1">
              <li>• Formats: PNG, JPG, JPEG, GIF, WEBP</li>
              <li>• Maximum size: 6MB</li>
              <li>• AI Vision processing</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Tips for Best Results */}
      <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
        <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
          <Zap className="w-4 h-4" />
          Tips for Best Results:
        </h4>
        <ul className="text-xs text-green-700 space-y-1">
          <li>• For documents: Use clear, well-structured text</li>
          <li>• For images: Ensure text is legible and well-lit</li>
          <li>• PDFs with OCR work best for text extraction</li>
          <li>• Images with clear text yield better quiz questions</li>
        </ul>
      </div>
    </div>
  );
}