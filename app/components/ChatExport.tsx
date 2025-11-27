

"use client";
import React from "react";

interface ChatExportProps {
  chatRef: React.RefObject<HTMLDivElement>;
}

export default function ChatExport({ chatRef }: ChatExportProps) {
  const handleExport = async () => {
    if (!chatRef.current) return;

    try {
      // Use jsPDF directly for better control
      const { jsPDF } = await import("jspdf");
      
      // Create a new PDF instance
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "in",
        format: "letter"
      });

      // Set basic PDF info
      doc.setProperties({
        title: 'Chat Session',
        subject: 'AI Chat Conversation',
        creator: 'AI Chatbot'
      });

      // Add title
      doc.setFontSize(20);
      doc.text('Chat Session', 1, 1);
      
      // Add date
      doc.setFontSize(10);
      doc.text(`Exported on: ${new Date().toLocaleDateString()}`, 1, 1.5);

      // Get chat content as text
      const chatContent = chatRef.current.innerText || chatRef.current.textContent || '';
      
      // Split text into lines that fit the page
      const pageWidth = 7.5; // inches minus margins
      const lines = doc.splitTextToSize(chatContent, pageWidth);
      
      // Add chat content
      doc.setFontSize(12);
      let yPosition = 2;
      const lineHeight = 0.2;

      lines.forEach((line: string) => {
        if (yPosition > 10) { // Near bottom of page
          doc.addPage();
          yPosition = 1;
        }
        doc.text(line, 1, yPosition);
        yPosition += lineHeight;
      });

      // Save the PDF
      doc.save('chat-session.pdf');
      
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export chat. Please try again.');
    }
  };

  return (
    
    <button
      onClick={handleExport}
      className="p-2 rounded-md bg-green-500 text-white hover:bg-green-600 text-sm transition-colors duration-200"
      title="Export chat as PDF"
    >
      📤 Export
    </button>
  );
}