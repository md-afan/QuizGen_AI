import { useRef, useState } from "react";
import { CheckCircle2, XCircle, Clock, RotateCcw, Download, FileText, Award, Percent, Timer } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function QuizResults({ results, onNewQuiz, quiz, userData }) {
  const resultsRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);

  if (!results) return null;

  const percentage = results.percentage || Math.round((results.score / results.total) * 100);
  
  const getPerformanceMessage = () => {
    if (percentage >= 90) return "Outstanding Performance";
    if (percentage >= 80) return "Excellent Work";
    if (percentage >= 70) return "Great Job";
    if (percentage >= 60) return "Good Effort";
    if (percentage >= 50) return "Keep Practicing";
    return "Needs Improvement";
  };

  const getPerformanceColor = () => {
    if (percentage >= 90) return "#059669";
    if (percentage >= 80) return "#10b981";
    if (percentage >= 70) return "#3b82f6";
    if (percentage >= 60) return "#f59e0b";
    if (percentage >= 50) return "#f97316";
    return "#ef4444";
  };

  const getAnswerData = (index) => {
    if (!results || !quiz || !quiz[index]) return { userAnswer: "", correctAnswer: "", isCorrect: false };
    
    const userAnswer = 
      results.answers?.[index] || 
      results.userAnswers?.[index] || 
      "";
    
    const correctAnswerKey = 
      results.correctAnswers?.[index] ||
      quiz[index]?.correctAnswer ||
      quiz[index]?.answer ||
      "";
    
    let correctAnswerText = correctAnswerKey;
    
    if (quiz[index]?.options && Array.isArray(quiz[index].options)) {
      const correctOption = quiz[index].options.find(opt => 
        opt.toString().charAt(0).toUpperCase() === correctAnswerKey.toString().charAt(0).toUpperCase()
      );
      
      if (correctOption) {
        correctAnswerText = correctOption;
      }
    }
    
    const isCorrect = 
      results.correctQuestions?.[index] !== undefined 
        ? results.correctQuestions[index] 
        : userAnswer && correctAnswerKey && 
          userAnswer.toString().charAt(0).toUpperCase() === correctAnswerKey.toString().charAt(0).toUpperCase();
    
    return { 
      userAnswer: userAnswer || "Not answered", 
      correctAnswer: correctAnswerText, 
      isCorrect 
    };
  };

  const downloadPDF = async () => {
    if (!resultsRef.current) return;

    setIsDownloading(true);
    try {
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      // Professional academic color scheme
      const colors = {
        primary: "#6c3bb5ff",       // Dark blue for headers
        secondary: "#3b82f6",     // Blue for accents
        dark: "#1f2937",          // Dark gray for text
        medium: "#4b5563",        // Medium gray
        light: "#9ca3af",         // Light gray
        success: "#059669",       // Green for correct
        warning: "#d97706",       // Orange for average
        danger: "#dc2626",        // Red for incorrect
        border: "#d1d5db",        // Border color
        background: "#ffffff",    // White background
        highlight: "#f0f9ff"      // Light blue for highlights
      };

      // Set professional font
      pdf.setFont("helvetica");
      
      let currentPage = 1;
      let yPosition = 25; // Start position for content

      // Function to add header
      const addHeader = (pdf, pageNumber) => {
        // Title
        pdf.setTextColor(colors.primary);
        pdf.setFontSize(16);
        pdf.setFont("helvetica", "bold");
        pdf.text("MCQ QUIZ ANALYSIS REPORT", pageWidth / 2, 15, { align: "center" });
        
        // Subtitle
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(colors.medium);
        pdf.text("Student Performance Report", pageWidth / 2, 20, { align: "center" });
        
        // Page number
        pdf.setFontSize(9);
        pdf.setTextColor(colors.light);
        pdf.text(`Page ${pageNumber}`, pageWidth - 20, 20);
      };

      // Function to add student info (clean table format)
      const addStudentInfo = (pdf, yPos) => {
        const sectionWidth = pageWidth - 40;
        const sectionX = 20;
        
        // Section title
        pdf.setTextColor(colors.dark);
        pdf.setFontSize(11);
        pdf.setFont("helvetica", "bold");
        pdf.text("Student Information", sectionX, yPos);
        
        yPos += 7;
        
        // Create clean table structure
        const infoData = [
          ["Name:", userData?.userName || "N/A"],
          ["Course:", userData?.courseName || "N/A"],
          ["Date:", new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })],
          ["Questions:", `${quiz?.length || 0}`]
        ];
        
        // Draw table
        const rowHeight = 7;
        const col1Width = 25;
        const col2Width = sectionWidth - col1Width;
        
        infoData.forEach((row, index) => {
          const rowY = yPos + (index * rowHeight);
          
          // Draw background for alternate rows
          if (index % 2 === 0) {
            pdf.setFillColor(colors.highlight);
            pdf.rect(sectionX, rowY - 4, sectionWidth, rowHeight, 'F');
          }
          
          // Labels
          pdf.setTextColor(colors.medium);
          pdf.setFontSize(10);
          pdf.setFont("helvetica", "bold");
          pdf.text(row[0], sectionX + 2, rowY);
          
          // Values
          pdf.setTextColor(colors.dark);
          pdf.setFont("helvetica", "normal");
          pdf.text(row[1], sectionX + col1Width, rowY);
        });
        
        return yPos + (infoData.length * rowHeight) + 5;
      };

      // Function to add performance summary
      const addPerformanceSummary = (pdf, yPos) => {
        const sectionWidth = pageWidth - 40;
        const sectionX = 20;
        
        // Section title
        pdf.setTextColor(colors.dark);
        pdf.setFontSize(11);
        pdf.setFont("helvetica", "bold");
        pdf.text("Performance Summary", sectionX, yPos);
        
        yPos += 7;
        
        // Main performance metrics
        const metrics = [
          ["Score:", `${results.score}/${results.total}`],
          ["Percentage:", `${percentage}%`],
          ["Performance:", getPerformanceMessage()],
          ["Time Taken:", `${results.timeTaken} seconds`]
        ];
        
        // Create two-column layout
        const colWidth = (sectionWidth - 10) / 2;
        const rowHeight = 7;
        
        metrics.forEach((metric, index) => {
          const col = index % 2;
          const row = Math.floor(index / 2);
          const xPos = sectionX + (col * colWidth);
          const yRowPos = yPos + (row * rowHeight);
          
          // Metric label
          pdf.setTextColor(colors.medium);
          pdf.setFontSize(10);
          pdf.setFont("helvetica", "bold");
          pdf.text(metric[0], xPos, yRowPos);
          
          // Metric value
          pdf.setTextColor(colors.dark);
          pdf.setFont("helvetica", "normal");
          
          if (metric[0] === "Performance:") {
            pdf.setTextColor(getPerformanceColor());
          }
          
          pdf.text(metric[1], xPos + 25, yRowPos);
        });
        
        yPos += (Math.ceil(metrics.length / 2) * rowHeight) + 10;
        
        // Progress bar for visualization
        const barWidth = sectionWidth;
        const barHeight = 8;
        const barX = sectionX;
        
        // Background bar
        pdf.setFillColor(colors.border);
        pdf.rect(barX, yPos, barWidth, barHeight, 'F');
        
        // Progress fill
        const progressWidth = (percentage / 100) * barWidth;
        pdf.setFillColor(getPerformanceColor());
        pdf.rect(barX, yPos, progressWidth, barHeight, 'F');
        
        // Percentage text on bar
        pdf.setTextColor("#ffffff");
        pdf.setFontSize(9);
        pdf.setFont("helvetica", "bold");
        pdf.text(`${percentage}%`, barX + barWidth / 2, yPos + 5.5, { align: "center" });
        
        // Bar labels
        pdf.setTextColor(colors.medium);
        pdf.setFontSize(7);
        pdf.setFont("helvetica", "normal");
        pdf.text("0%", barX, yPos + barHeight + 4);
        pdf.text("100%", barX + barWidth - 10, yPos + barHeight + 4);
        
        return yPos + barHeight + 15;
      };

      // Function to add detailed analysis title
      const addAnalysisTitle = (pdf, yPos) => {
        pdf.setTextColor(colors.dark);
        pdf.setFontSize(11);
        pdf.setFont("helvetica", "bold");
        pdf.text("Question-by-Question Analysis", 20, yPos);
        
        yPos += 5;
        
        // Subtle separator line
        pdf.setDrawColor(colors.border);
        pdf.setLineWidth(0.3);
        pdf.line(20, yPos, pageWidth - 20, yPos);
        
        return yPos + 8;
      };

      // Function to add MCQ question in clean format
      const addMCQQuestion = (pdf, question, index, yPos) => {
        const { userAnswer, correctAnswer, isCorrect } = getAnswerData(index);
        const questionWidth = pageWidth - 40;
        const questionX = 20;
        
        // Check page break
        if (yPos > pageHeight - 60) {
          pdf.addPage();
          currentPage++;
          yPos = 30;
          addHeader(pdf, currentPage);
        }
        
        // Question number and status
        pdf.setFillColor(isCorrect ? colors.success : colors.danger);
        pdf.setDrawColor(isCorrect ? colors.success : colors.danger);
        pdf.rect(questionX, yPos, 3, 3, 'F');
        
        pdf.setTextColor(colors.dark);
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "bold");
        pdf.text(`Question ${index + 1}`, questionX + 8, yPos + 2.5);
        
        // Status text
        pdf.setFontSize(8);
        pdf.setTextColor(isCorrect ? colors.success : colors.danger);
        pdf.text(isCorrect ? "Correct" : "Incorrect", questionX + questionWidth - 25, yPos + 2.5);
        
        yPos += 6;
        
        // Question text
        pdf.setTextColor(colors.dark);
        pdf.setFontSize(9);
        pdf.setFont("helvetica", "normal");
        const questionText = question.question || "No question text available";
        
        // Split long questions
        const questionLines = pdf.splitTextToSize(questionText, questionWidth - 5);
        questionLines.forEach(line => {
          pdf.text(line, questionX, yPos);
          yPos += 4.5;
        });
        
        yPos += 2;
        
        // Display options in clean format
        if (question.options && Array.isArray(question.options)) {
          const optionLetters = ["A", "B", "C", "D", "E", "F"];
          
          question.options.forEach((option, optIndex) => {
            if (optIndex < 6) {
              const isSelected = userAnswer && userAnswer.toString().charAt(0).toUpperCase() === optionLetters[optIndex];
              const isCorrectOption = correctAnswer && correctAnswer.toString().charAt(0).toUpperCase() === optionLetters[optIndex];
              
              // Option container with consistent indentation
              const optionIndent = 5;
              const optionStartY = yPos;
              
              // Option letter with indicator
              pdf.setDrawColor(colors.border);
              pdf.setLineWidth(0.5);
              pdf.rect(questionX + optionIndent, yPos - 2, 8, 8, 'D');
              
              // Fill for selected/correct options
              if (isSelected || isCorrectOption) {
                let fillColor = colors.border;
                if (isSelected && isCorrectOption) {
                  fillColor = colors.success;
                } else if (isSelected && !isCorrectOption) {
                  fillColor = colors.danger;
                } else if (isCorrectOption && !isSelected) {
                  fillColor = colors.success;
                  pdf.setLineWidth(0.8);
                  pdf.setDrawColor(colors.success);
                }
                
                if (isSelected) {
                  pdf.setFillColor(fillColor);
                  pdf.rect(questionX + optionIndent, yPos - 2, 8, 8, 'F');
                }
              }
              
              // Option letter
              pdf.setTextColor(isSelected && (isCorrectOption ? "#ffffff" : "#ffffff"));
              pdf.setFontSize(8);
              pdf.setFont("helvetica", "bold");
              pdf.text(optionLetters[optIndex], questionX + optionIndent + 2.5, yPos + 2.5);
              
              // Option text
              pdf.setTextColor(colors.dark);
              pdf.setFontSize(9);
              pdf.setFont("helvetica", "normal");
              
              const optionText = option.toString();
              const optionLines = pdf.splitTextToSize(optionText, questionWidth - 30);
              
              optionLines.forEach((line, lineIndex) => {
                pdf.text(line, questionX + optionIndent + 12, yPos + (lineIndex * 4.5));
              });
              
              yPos += Math.max(8, optionLines.length * 4.5) + 2;
            }
          });
        }
        
        yPos += 2;
        
        // Answer analysis section
        pdf.setDrawColor(colors.border);
        pdf.setLineWidth(0.2);
        pdf.line(questionX, yPos, questionX + questionWidth, yPos);
        
        yPos += 4;
        
        // Your Answer
        pdf.setFontSize(8);
        pdf.setTextColor(colors.medium);
        pdf.setFont("helvetica", "bold");
        pdf.text("Your Answer:", questionX, yPos);
        
        pdf.setFontSize(9);
        pdf.setTextColor(isCorrect ? colors.success : colors.danger);
        pdf.text(userAnswer, questionX + 22, yPos);
        
        yPos += 4;
        
        // Correct Answer
        pdf.setFontSize(8);
        pdf.setTextColor(colors.medium);
        pdf.text("Correct Answer:", questionX, yPos);
        
        pdf.setFontSize(9);
        pdf.setTextColor(colors.success);
        pdf.text(correctAnswer, questionX + 28, yPos);
        
        // Add spacing for next question
        return yPos + 12;
      };

      // Function to add performance insights
      const addInsights = (pdf, yPos) => {
        const sectionWidth = pageWidth - 40;
        const sectionX = 20;
        
        // Check page break
        if (yPos > pageHeight - 50) {
          pdf.addPage();
          currentPage++;
          yPos = 30;
          addHeader(pdf, currentPage);
        }
        
        // Section title
        pdf.setTextColor(colors.dark);
        pdf.setFontSize(11);
        pdf.setFont("helvetica", "bold");
        pdf.text("Performance Insights", sectionX, yPos);
        
        yPos += 7;
        
        // Generate insights based on score
        let strengths = [];
        let recommendations = [];
        
        if (percentage >= 80) {
          strengths = [
            "Strong conceptual understanding",
            "Good time management",
            "Accurate answer selection"
          ];
          recommendations = [
            "Continue regular practice",
            "Challenge with advanced questions",
            "Review occasional mistakes"
          ];
        } else if (percentage >= 60) {
          strengths = [
            "Fair knowledge base",
            "Partial concept mastery",
            "Room for improvement"
          ];
          recommendations = [
            "Focus on weak areas",
            "Review incorrect answers",
            "Increase practice frequency"
          ];
        } else {
          strengths = [
            "Identified learning gaps",
            "Foundation established",
            "Clear improvement path"
          ];
          recommendations = [
            "Study fundamental concepts",
            "Practice basic questions",
            "Seek additional resources"
          ];
        }
        
        // Strengths section
        pdf.setFontSize(9);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(colors.primary);
        pdf.text("Strengths:", sectionX, yPos);
        
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(colors.dark);
        strengths.forEach((item, i) => {
          pdf.text(`• ${item}`, sectionX + 5, yPos + 5 + (i * 4.5));
        });
        
        const strengthsHeight = strengths.length * 4.5 + 10;
        
        // Recommendations section
        const recY = yPos + strengthsHeight;
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(colors.primary);
        pdf.text("Recommendations:", sectionX, recY);
        
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(colors.dark);
        recommendations.forEach((item, i) => {
          pdf.text(`• ${item}`, sectionX + 5, recY + 5 + (i * 4.5));
        });
        
        return recY + (recommendations.length * 4.5) + 15;
      };

      // Function to add footer
      const addFooter = (pdf) => {
        pdf.setFontSize(8);
        pdf.setTextColor(colors.light);
        pdf.setFont("helvetica", "normal");
        
        // Footer separator
        pdf.setDrawColor(colors.border);
        pdf.setLineWidth(0.3);
        pdf.line(20, pageHeight - 20, pageWidth - 20, pageHeight - 20);
        
        // Footer text
        pdf.text(`Generated by QuizGen AI | Developed by MD AFAN  • ${new Date().toLocaleDateString()}`, pageWidth / 2, pageHeight - 15, { align: "center" });
        pdf.text("https://md-afan.github.io/QuizGen_AI/", pageWidth / 2, pageHeight - 10, { align: "center" });
      };

      // Generate the PDF
      addHeader(pdf, currentPage);
      
      yPosition = addStudentInfo(pdf, yPosition);
      yPosition = addPerformanceSummary(pdf, yPosition);
      yPosition = addAnalysisTitle(pdf, yPosition);
      
      // Add all questions
      if (quiz && Array.isArray(quiz)) {
        quiz.forEach((question, index) => {
          yPosition = addMCQQuestion(pdf, question, index, yPosition);
        });
      }
      
      yPosition = addInsights(pdf, yPosition);
      
      // Add footer to all pages
      const pageCount = pdf.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        addFooter(pdf);
      }

      pdf.save(`MCQ_Report_${userData?.userName || "Student"}_${new Date().toLocaleDateString().replace(/\//g, '-')}.pdf`);

    } catch (error) {
      console.error("Error generating PDF:", error);
      await generateSimplePDF();
    } finally {
      setIsDownloading(false);
    }
  };

  // Simple fallback PDF
  const generateSimplePDF = async () => {
    try {
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const colors = getPerformanceColor();
      
      pdf.setFont("helvetica");
      
      // Header
      pdf.setTextColor(30, 58, 138);
      pdf.setFontSize(16);
      pdf.setFont("helvetica", "bold");
      pdf.text("Quiz Results Summary", pageWidth / 2, 20, { align: "center" });
      
      // Content
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(12);
      let yPos = 35;
      
      // Student info
      pdf.text(`Student: ${userData?.userName || "N/A"}`, 20, yPos);
      pdf.text(`Course: ${userData?.courseName || "N/A"}`, 20, yPos + 7);
      pdf.text(`Date: ${new Date().toLocaleDateString()}`, 20, yPos + 14);
      
      yPos += 30;
      
      // Performance
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text("Performance Summary", pageWidth / 2, yPos, { align: "center" });
      
      yPos += 15;
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "normal");
      
      const summary = [
        `Score: ${results.score}/${results.total} (${percentage}%)`,
        `Performance: ${getPerformanceMessage()}`,
        `Time Taken: ${results.timeTaken} seconds`
      ];
      
      summary.forEach((line, index) => {
        pdf.text(line, 20, yPos + (index * 7));
      });
      
      yPos += 30;
      
      // Questions
      if (quiz && Array.isArray(quiz)) {
        pdf.setFontSize(11);
        pdf.setFont("helvetica", "bold");
        pdf.text("Question Analysis:", 20, yPos);
        
        yPos += 10;
        
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "normal");
        
        quiz.forEach((question, index) => {
          if (yPos > 250) {
            pdf.addPage();
            yPos = 20;
          }
          
          const { userAnswer, correctAnswer, isCorrect } = getAnswerData(index);
          
          pdf.text(`Q${index + 1}: ${question.question}`, 20, yPos);
          pdf.text(`Your Answer: ${userAnswer} ${isCorrect ? '✓' : '✗'}`, 25, yPos + 5);
          pdf.text(`Correct Answer: ${correctAnswer}`, 25, yPos + 10);
          yPos += 20;
        });
      }
      
      // Footer
      pdf.setFontSize(9);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`Generated by QuizGen AI | Developed by MD AFAN  • ${new Date().toLocaleDateString()}`, pageWidth / 2, 280, { align: "center" });
      
      pdf.save(`Quiz_Report_${new Date().getTime()}.pdf`);
    } catch (error) {
      console.error("Error in fallback PDF:", error);
    }
  };

  const downloadTextReport = () => {
    const textContent = generateTextReport();
    const blob = new Blob([textContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = `mcq-quiz-results-${userData?.userName || "student"}.txt`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  const generateTextReport = () => {
    const date = new Date().toLocaleString();
    let report = `MCQ QUIZ RESULTS REPORT\n`;
    report += `========================\n\n`;
    report += `STUDENT INFORMATION\n`;
    report += `-------------------\n`;
    report += `Name: ${userData?.userName || "N/A"}\n`;
    report += `Course: ${userData?.courseName || "N/A"}\n`;
    report += `Date: ${date}\n\n`;
    
    report += `PERFORMANCE SUMMARY\n`;
    report += `-------------------\n`;
    report += `Total Questions: ${quiz?.length || 0}\n`;
    report += `Score: ${results.score}/${results.total}\n`;
    report += `Percentage: ${percentage}%\n`;
    report += `Performance: ${getPerformanceMessage()}\n`;
    report += `Time Taken: ${results.timeTaken} seconds\n\n`;
    
    report += `QUESTION ANALYSIS\n`;
    report += `================\n\n`;

    if (quiz && Array.isArray(quiz)) {
      quiz.forEach((q, i) => {
        const { userAnswer, correctAnswer, isCorrect } = getAnswerData(i);

        report += `Question ${i + 1}:\n`;
        report += `Q: ${q.question || "No question text"}\n`;
        
        if (q.options && Array.isArray(q.options)) {
          q.options.forEach((opt, idx) => {
            const letter = String.fromCharCode(65 + idx);
            report += `  ${letter}) ${opt}\n`;
          });
        }
        
        report += `Your Answer: ${userAnswer} ${isCorrect ? "✓" : "✗"}\n`;
        report += `Correct Answer: ${correctAnswer}\n\n`;
      });
    }

    report += `\n---\n`;
    report += `Generated by QuizGen AI | Developed by MD AFAN \n`;
    report += `${new Date().toLocaleDateString()}\n`;
    
    return report;
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      {/* Download Options */}
      <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          Download Report
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <button
            onClick={downloadPDF}
            disabled={isDownloading}
            className="flex items-center justify-center gap-3 p-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
          >
            <FileText className="w-4 h-4" />
            {isDownloading ? "Generating..." : "Download PDF Report"}
          </button>
          
          <button
            onClick={downloadTextReport}
            className="flex items-center justify-center gap-3 p-3 bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors duration-200"
          >
            <Download className="w-4 h-4" />
            Download Text Report
          </button>
        </div>
        
        {userData && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-sm text-gray-700">
              <span className="font-medium">Student:</span> {userData.userName} | 
              <span className="font-medium ml-3">Course:</span> {userData.courseName}
            </p>
          </div>
        )}
      </div>

      {/* Main Results */}
      <div ref={resultsRef} className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            MCQ Quiz Results
          </h1>
          {userData && (
            <div className="mt-2 text-sm text-gray-600">
              <p>{userData.userName} • {userData.courseName}</p>
            </div>
          )}
        </div>

        {/* Summary Card */}
        <div className="text-center p-6 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl border border-gray-200">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <svg className="w-24 h-24 transform rotate-[-90deg]" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke={getPerformanceColor()}
                  strokeWidth="3"
                  strokeDasharray={`${percentage}, 100`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-gray-900">{percentage}%</span>
              </div>
            </div>
          </div>
          
          <h2 className={`text-xl font-bold mb-2`} style={{ color: getPerformanceColor() }}>
            {getPerformanceMessage()}
          </h2>
          
          <div className="flex justify-center items-center gap-4 mb-3">
            <div className="flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-gray-700">{results.score} Correct</span>
            </div>
            <div className="flex items-center gap-1">
              <XCircle className="w-4 h-4 text-red-600" />
              <span className="text-sm font-medium text-gray-700">{results.total - results.score} Incorrect</span>
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-1 text-gray-600 text-sm">
            <Clock className="w-4 h-4" />
            <span>Time: {results.timeTaken}s</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-center">
            <Percent className="w-6 h-6 mx-auto mb-2 text-blue-600" />
            <div className="text-xl font-bold text-gray-900">
              {percentage}%
            </div>
            <div className="text-sm text-gray-600">Overall Score</div>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-center">
            <Award className="w-6 h-6 mx-auto mb-2 text-green-600" />
            <div className="text-xl font-bold text-gray-900">
              {results.score}/{results.total}
            </div>
            <div className="text-sm text-gray-600">Correct Answers</div>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-center">
            <Timer className="w-6 h-6 mx-auto mb-2 text-purple-600" />
            <div className="text-xl font-bold text-gray-900">
              {results.timeTaken}s
            </div>
            <div className="text-sm text-gray-600">Time Taken</div>
          </div>
        </div>

        {/* Detailed Results */}
        <div className="pt-4">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Question Analysis
          </h3>
          <div className="space-y-3">
            {quiz && Array.isArray(quiz) && quiz.map((q, i) => {
              const { userAnswer, correctAnswer, isCorrect } = getAnswerData(i);

              return (
                <div key={i} className={`p-3 border rounded-lg ${
                  isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                }`}>
                  <div className="flex items-start gap-2">
                    <div className={`flex-shrink-0 w-5 h-5 rounded flex items-center justify-center mt-0.5 ${
                      isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                    }`}>
                      {isCorrect ? '✓' : '✗'}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-800 mb-1">
                        Q{i + 1}: {q.question}
                      </div>
                      <div className="text-sm space-y-1">
                        <div>
                          <span className="text-gray-600">Your answer: </span>
                          <span className={isCorrect ? "text-green-700 font-medium" : "text-red-700 font-medium"}>
                            {userAnswer}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Correct answer: </span>
                          <span className="text-green-700 font-medium">
                            {correctAnswer}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={onNewQuiz}
        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors duration-200"
      >
        <RotateCcw className="w-4 h-4" />
        Create New Quiz
      </button>
    </div>
  );
}