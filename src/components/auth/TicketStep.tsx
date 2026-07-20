// components/auth/TicketStep.tsx
import React, { useState } from "react";
import { Check, X, Download, FileText, Eye, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";

interface TicketStepProps {
  formData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  selectedPlan: "full" | "partial" | null;
  transactionId?: string;
  ticketData?: {
    _id: string;
    ticketId: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    selectedPlan: string;
    paymentMethod: string;
    paymentStatus: string;
    amountPaid: number;
    totalAmount: number;
    outstandingBalance: number;
    transactionId: string;
    eventName: string;
    eventDate: string;
    status: string;
  };
  onClose?: () => void;
  onViewTicket?: () => void;
  onDownloadReceipt?: () => void;
}

const TicketStep: React.FC<TicketStepProps> = ({ 
  formData, 
  selectedPlan,
  transactionId = "TXN-BRT-2026-7712A",
  ticketData,
  onClose,
  onViewTicket,
  onDownloadReceipt
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingType, setGeneratingType] = useState<'view' | 'download' | null>(null);
  const fullName = `${formData.firstName} ${formData.lastName}`.trim() || 'Attendee';
  
  // Get current date
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-ZA', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  // Amount based on plan or ticket data
  const amountPaid = ticketData?.amountPaid 
    ? `R${ticketData.amountPaid.toLocaleString('en-ZA')}`
    : selectedPlan === 'full' 
      ? 'R2,040'
      : 'R1,018';

  const displayTransactionId = ticketData?.transactionId || transactionId;
  const displayTicketId = ticketData?.ticketId || "BRT-2026-XXXX";
  const displayEventName = ticketData?.eventName || "BRT150 Demo Day";
  const displayEventDate = ticketData?.eventDate 
    ? new Date(ticketData.eventDate).toLocaleDateString('en-ZA', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    : "21 November 2026";
  const displayStatus = ticketData?.status || "confirmed";

  const handleClose = () => {
    if (onClose) onClose();
  };

  const generateTicketPDF = (type: 'view' | 'download') => {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    
    // Background color
    pdf.setFillColor(5, 5, 5);
    pdf.rect(0, 0, pageWidth, pageHeight, 'F');
    
    // Border
    pdf.setDrawColor(201, 162, 39);
    pdf.setLineWidth(0.5);
    pdf.roundedRect(10, 10, pageWidth - 20, pageHeight - 20, 5, 5, 'S');
    
    // Header
    pdf.setFontSize(10);
    pdf.setTextColor(201, 162, 39);
    pdf.text('BRT150 DEMO DAY', pageWidth / 2, 30, { align: 'center' });
    
    pdf.setFontSize(24);
    pdf.setTextColor(255, 255, 255);
    pdf.text('OFFICIAL TICKET', pageWidth / 2, 45, { align: 'center' });
    
    // Divider
    pdf.setDrawColor(201, 162, 39);
    pdf.setLineWidth(0.3);
    pdf.line(40, 55, pageWidth - 40, 55);
    
    // Ticket Details
    pdf.setFontSize(11);
    let yPos = 75;
    const lineHeight = 12;
    const labelX = 30;
    const valueX = 100;
    
    const details = [
      ['Ticket ID', displayTicketId],
      ['Attendee', fullName],
      ['Email', formData.email],
      ['Phone', formData.phone],
      ['Event', displayEventName],
      ['Event Date', displayEventDate],
      ['Amount Paid', amountPaid],
      ['Transaction ID', displayTransactionId],
      ['Status', '✓ CONFIRMED'],
    ];
    
    details.forEach(([label, value]) => {
      // Label
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(128, 128, 128);
      pdf.setFontSize(10);
      pdf.text(label + ':', labelX, yPos);
      
      // Value
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(11);
      
      // Handle long text
      const maxWidth = pageWidth - valueX - 30;
      const lines = pdf.splitTextToSize(value, maxWidth);
      pdf.text(lines, valueX, yPos);
      
      yPos += lineHeight * (lines.length > 1 ? lines.length : 1);
    });
    
    // Status with green color
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(34, 197, 94);
    pdf.setFontSize(11);
    pdf.text('✓ CONFIRMED', valueX, yPos - lineHeight);
    
    // Footer
    const footerY = pageHeight - 25;
    pdf.setFontSize(9);
    pdf.setTextColor(128, 128, 128);
    pdf.text('This ticket grants access to BRT150 Demo Day', pageWidth / 2, footerY, { align: 'center' });
    pdf.text('Presented by BRT150 • Ethereal, Newcastle, KwaZulu-Natal', pageWidth / 2, footerY + 6, { align: 'center' });
    
    const fileName = `ticket-${displayTicketId}.pdf`;
    
    if (type === 'view') {
      const pdfBlob = pdf.output('blob');
      const url = URL.createObjectURL(pdfBlob);
      window.open(url, '_blank');
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } else {
      pdf.save(fileName);
    }
  };

  const generateReceiptPDF = () => {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    
    // Background
    pdf.setFillColor(5, 5, 5);
    pdf.rect(0, 0, pageWidth, 210, 'F');
    
    // Border
    pdf.setDrawColor(201, 162, 39);
    pdf.setLineWidth(0.5);
    pdf.roundedRect(10, 10, pageWidth - 20, 190, 5, 5, 'S');
    
    // Header
    pdf.setFontSize(10);
    pdf.setTextColor(201, 162, 39);
    pdf.text('BRT150 DEMO DAY', pageWidth / 2, 30, { align: 'center' });
    
    pdf.setFontSize(22);
    pdf.setTextColor(255, 255, 255);
    pdf.text('PAYMENT RECEIPT', pageWidth / 2, 45, { align: 'center' });
    
    pdf.setDrawColor(201, 162, 39);
    pdf.line(40, 55, pageWidth - 40, 55);
    
    // Receipt Details
    pdf.setFontSize(11);
    let yPos = 75;
    const lineHeight = 12;
    
    const details = [
      ['Receipt ID', displayTicketId],
      ['Transaction ID', displayTransactionId],
      ['Amount Paid', amountPaid],
      ['Date', formattedDate],
      ['Payment Status', 'COMPLETED'],
      ['Attendee', fullName],
      ['Email', formData.email],
      ['Phone', formData.phone],
    ];
    
    details.forEach(([label, value]) => {
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(128, 128, 128);
      pdf.setFontSize(10);
      pdf.text(label + ':', 30, yPos);
      
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(11);
      
      const maxWidth = pageWidth - 80;
      const lines = pdf.splitTextToSize(value, maxWidth);
      pdf.text(lines, 90, yPos);
      
      yPos += lineHeight * (lines.length > 1 ? lines.length : 1);
    });
    
    // Footer
    const footerY = 190;
    pdf.setFontSize(9);
    pdf.setTextColor(128, 128, 128);
    pdf.text('Thank you for your payment. This receipt is for your records.', pageWidth / 2, footerY, { align: 'center' });
    
    pdf.save(`receipt-${displayTicketId}.pdf`);
  };

  const handleViewTicket = () => {
    if (onViewTicket) {
      onViewTicket();
    } else {
      setGeneratingType('view');
      setIsGenerating(true);
      try {
        generateTicketPDF('view');
      } catch (error) {
        console.error('Error viewing ticket:', error);
      } finally {
        setIsGenerating(false);
        setGeneratingType(null);
      }
    }
  };

  const handleDownloadTicket = () => {
    setGeneratingType('download');
    setIsGenerating(true);
    try {
      generateTicketPDF('download');
    } catch (error) {
      console.error('Error downloading ticket:', error);
    } finally {
      setIsGenerating(false);
      setGeneratingType(null);
    }
  };

  const handleDownloadReceipt = () => {
    if (onDownloadReceipt) {
      onDownloadReceipt();
    } else {
      try {
        generateReceiptPDF();
      } catch (error) {
        console.error('Error downloading receipt:', error);
      }
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8"
      style={{
        background: "rgba(5, 5, 5, 0.85)",
        backdropFilter: "blur(14px)",
      }}
      onClick={handleClose}
    >
      <div 
        className="relative w-full max-w-[480px] rounded-2xl p-8 text-center"
        style={{
          background: "linear-gradient(160deg, rgb(28, 18, 8) 0%, rgb(17, 13, 5) 50%, rgb(14, 9, 9) 100%)",
          border: "1px solid rgb(201, 162, 39)",
          boxShadow: "rgba(201, 162, 39, 0.22) 0px 0px 80px, rgba(0, 0, 0, 0.7) 0px 40px 100px",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button - Navigate to home */}
        <Link 
          to="/"
          onClick={handleClose}
          className="absolute top-4 right-4 transition-colors text-white/22 hover:text-white/60"
        >
          <X className="w-[18px] h-[18px]" />
        </Link>

        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div 
            className="w-20 h-20 rounded-full flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, rgb(201, 162, 39), rgb(223, 186, 58))",
              boxShadow: "rgba(201, 162, 39, 0.45) 0px 0px 60px",
            }}
          >
            <Check className="w-[34px] h-[34px] stroke-[2.5] text-[#050505]" />
          </div>
        </div>

        {/* Title */}
        <div className="text-[10px] font-bold uppercase tracking-[0.25em] mb-2 text-[#C9A227]">
          Payment Confirmed
        </div>
        <h2 className="text-white font-bold text-2xl mb-2">
          Your Spot Is Reserved
        </h2>
        <p className="text-sm font-medium leading-relaxed mb-7 max-w-xs mx-auto text-white/42">
          Welcome to {displayEventName}. Your ticket has been confirmed and your seat is secured.
        </p>

        {/* Ticket ID Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 bg-[#C9A227]/10 border border-[#C9A227]/20">
          <FileText className="w-3.5 h-3.5 text-[#C9A227]" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#C9A227]">
            Ticket #{displayTicketId}
          </span>
        </div>

        {/* Details */}
        <div 
          className="text-left rounded-xl p-4 mb-6 space-y-2.5"
          style={{
            background: "rgba(0, 0, 0, 0.3)",
            border: "1px solid rgba(201, 162, 39, 0.12)",
          }}
        >
          <div className="flex justify-between items-center">
            <span className="text-xs font-medium text-white/35">Ticket ID</span>
            <span className="text-xs font-bold text-white/70">{displayTicketId}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs font-medium text-white/35">Amount Paid</span>
            <span className="text-xs font-bold text-[#C9A227]">{amountPaid}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs font-medium text-white/35">Transaction ID</span>
            <span className="text-xs font-bold text-white/70">{displayTransactionId}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs font-medium text-white/35">Event Date</span>
            <span className="text-xs font-bold text-white/70">{displayEventDate}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs font-medium text-white/35">Attendee</span>
            <span className="text-xs font-bold text-white/70">{fullName}</span>
          </div>
          <div className="flex justify-between items-center pt-1" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <span className="text-xs font-medium text-white/35">Status</span>
            <span className="text-xs font-bold text-[#22C55E]">
              {displayStatus === 'confirmed' ? '✓ Confirmed' : displayStatus.charAt(0).toUpperCase() + displayStatus.slice(1)}
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          {/* View Ticket Button */}
          <button
            onClick={handleViewTicket}
            disabled={isGenerating}
            className="inline-flex items-center justify-center gap-2.5 font-bold rounded-xl transition-all duration-200 active:scale-[0.99] w-full px-8 py-4 text-[15px] disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: "linear-gradient(135deg, rgb(201, 162, 39) 0%, rgb(223, 186, 58) 100%)",
              color: "rgb(5, 5, 5)",
              boxShadow: "rgba(201, 162, 39, 0.25) 0px 4px 24px",
            }}
          >
            {isGenerating && generatingType === 'view' ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" />
                View Ticket
              </>
            )}
          </button>

          {/* Download Ticket Button */}
          <button
            onClick={handleDownloadTicket}
            disabled={isGenerating}
            className="inline-flex items-center justify-center gap-2.5 font-semibold rounded-xl transition-all duration-200 active:scale-[0.99] w-full px-8 py-3.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              border: "1px solid rgba(255, 255, 255, 0.1)",
              color: "rgba(255, 255, 255, 0.55)",
              background: "transparent",
            }}
          >
            {isGenerating && generatingType === 'download' ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Downloading...
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                Download Ticket
              </>
            )}
          </button>

        </div>
      </div>
    </div>
  );
};

export default TicketStep;