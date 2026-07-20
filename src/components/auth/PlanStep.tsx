// components/auth/PlanStep.tsx
import React, { useState } from "react";
import { Crown, Check, Phone, Smartphone, Mail, ArrowRight, X } from "lucide-react";
import { TICKET_PRICE, calculatePayment } from "@/utils/paymentUtils";

interface PlanStepProps {
  selectedPlan: "full" | "partial" | null;
  setSelectedPlan: (plan: "full" | "partial") => void;
  onContinue?: () => void;
  setError?: (error: string | null) => void;
}

interface CallbackFormData {
  whatsapp: string;
  phone: string;
  email: string;
}

interface CallbackResponse {
  whatsapp: string;
  phone: string;
  email: string;
  reference: string;
}

const PlanStep: React.FC<PlanStepProps> = ({ 
  selectedPlan, 
  setSelectedPlan,
  onContinue,
  setError
}) => {
  const [callbackData, setCallbackData] = useState<CallbackFormData>({
    whatsapp: "",
    phone: "",
    email: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [callbackError, setCallbackError] = useState<string | null>(null);
  const [callbackSuccess, setCallbackSuccess] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [callbackResponse, setCallbackResponse] = useState<CallbackResponse>({
    whatsapp: "",
    phone: "",
    email: "",
    reference: "BRT150-CB-2026",
  });

  // Calculate amounts for each plan
  const fullPlan = calculatePayment("full");
  const partialPlan = calculatePayment("partial");
  
  // Constants
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const plans = [
    {
      id: "full" as const,
      title: "Full Payment",
      badge: "Save on fees",
      badgeColor: "rgba(34, 197, 94, 0.12)",
      badgeBorder: "rgba(34, 197, 94, 0.25)",
      badgeText: "#22C55E",
      price: `R${fullPlan.totalDueToday.toLocaleString()}`,
      priceLabel: "today",
      deposit: `R${fullPlan.totalDueToday.toLocaleString()}`,
      balance: `R${fullPlan.remainingBalance.toLocaleString()}`,
      chargeDate: "None",
      description: "Single payment today",
    },
    {
      id: "partial" as const,
      title: "Partial Payment",
      badge: "Flexible",
      badgeColor: "rgba(201, 162, 39, 0.1)",
      badgeBorder: "rgba(201, 162, 39, 0.25)",
      badgeText: "#C9A227",
      price: `R${partialPlan.totalDueToday.toLocaleString()}`,
      priceLabel: "today",
      deposit: `R${partialPlan.totalDueToday.toLocaleString()}`,
      balance: `R${partialPlan.remainingBalance.toLocaleString()}`,
      chargeDate: "25 June 2026",
      description: "Deposit now · balance later",
    },
  ];

  const features = [
    "Full Event Access",
    "All Keynote & Demo Sessions",
    "Networking Dinners",
    "Digital Ticket",
    "Post-Event Report",
    "1:1 Meeting Bookings",
  ];

  const handleCallbackChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setCallbackData(prev => ({ ...prev, [id]: value }));
    if (callbackError) setCallbackError(null);
    if (callbackSuccess) setCallbackSuccess(false);
  };

  const handleRequestCallback = async () => {
    const hasContact = callbackData.whatsapp || callbackData.phone || callbackData.email;
    
    if (!hasContact) {
      setCallbackError("Please provide at least one contact method");
      return;
    }

    setIsSubmitting(true);
    setCallbackError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/request-callback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...callbackData,
          plan: "partial",
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to request callback");
      }

      const result = await response.json();

      // Set response data for modal
      setCallbackResponse({
        whatsapp: callbackData.whatsapp || "Not provided",
        phone: callbackData.phone || "Not provided",
        email: callbackData.email || "Not provided",
        reference: result.reference || "BRT150-CB-2026",
      });

      setCallbackSuccess(true);
      setShowSuccessModal(true); // Show the success modal
      setCallbackData({ whatsapp: "", phone: "", email: "" });
      
      // Clear any parent error
      if (setError) setError(null);
      
    } catch (error) {
      setCallbackError(error instanceof Error ? error.message : "Failed to request callback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isCallbackFormValid = () => {
    return !!(callbackData.whatsapp || callbackData.phone || callbackData.email);
  };

  const handleButtonClick = () => {
    if (selectedPlan === "full") {
      // Full payment - go to payment step
      onContinue?.();
    } else if (selectedPlan === "partial") {
      // Partial payment - always request callback, never navigate
      handleRequestCallback();
    }
  };

  const getButtonText = () => {
    if (!selectedPlan) return "Select a Plan to Continue";
    if (selectedPlan === "full") return "Continue to Payment";
    if (selectedPlan === "partial" && isSubmitting) return "Requesting Callback...";
    if (selectedPlan === "partial") return "Request Callback";
    return "Continue";
  };

  const isButtonDisabled = () => {
    if (!selectedPlan) return true;
    if (selectedPlan === "full") return false;
    if (selectedPlan === "partial" && isSubmitting) return true;
    if (selectedPlan === "partial") return !isCallbackFormValid();
    return true;
  };

  const closeModal = () => {
    setShowSuccessModal(false);
    // Do NOT navigate to payment - stay on plan step
  };

  return (
    <div className="max-w-[780px] mx-auto">
      <div className="text-center mb-12">
        <div className="text-[10px] font-bold uppercase tracking-[0.25em] mb-3 text-[#C9A227]">
          Select Your Plan
        </div>
        <h1 className="text-white font-bold text-3xl mb-3">Choose How You'd Like to Pay</h1>
        <p className="text-sm font-medium max-w-xs mx-auto leading-relaxed text-white/38">
          One seat. One pass. Pick the payment option that works for you.
        </p>
      </div>

      {/* Event Card */}
      <div className="rounded-2xl p-7 mb-6 bg-gradient-to-br from-[#151010] to-[#0E0909] border border-[#C9A227]/35 shadow-[0_0_40px_rgba(201,162,39,0.12),0_20px_60px_rgba(0,0,0,0.5)]">
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] mb-1.5 text-[#C9A227]">
              BRT150 Networking Event - 21st November 2026
            </div>
            <h2 className="text-white font-bold text-xl">Purchase tickets for the BRT150 2026 Event</h2>
          </div>
          <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 bg-[#C9A227]/15">
            <Crown className="w-5 h-5 text-[#C9A227]" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5 mb-6">
          {features.map((feature) => (
            <div key={feature} className="flex items-center gap-2.5">
              <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 bg-[#C9A227]/18">
                <Check className="w-[9px] h-[9px] stroke-[3] text-[#C9A227]" />
              </div>
              <span className="text-xs font-medium text-white/60">{feature}</span>
            </div>
          ))}
        </div>

        <div className="flex items-end gap-2 pt-5 border-t border-[#C9A227]/15">
          <span className="font-black text-[38px] leading-none tracking-[-0.03em] bg-gradient-to-r from-[#C9A227] to-[#DFBA3A] bg-clip-text text-transparent">
            R{TICKET_PRICE.toLocaleString()}
          </span>
          <span className="text-sm font-bold mb-1 text-white/30">ZAR</span>
        </div>
      </div>

      {/* Plan Selection */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {plans.map((plan) => {
          const isSelected = selectedPlan === plan.id;
          
          return (
            <button
              key={plan.id}
              onClick={() => {
                setSelectedPlan(plan.id);
                // Reset callback success when switching plans
                if (plan.id !== "partial") {
                  setCallbackSuccess(false);
                }
                // Clear any parent error
                if (setError) setError(null);
              }}
              className={`p-6 rounded-2xl text-left transition-all duration-200 ${
                isSelected
                  ? 'bg-gradient-to-br from-[#C9A227]/15 to-[#C9A227]/5 border border-[#C9A227] shadow-[0_0_30px_rgba(201,162,39,0.1)] scale-[1.02]'
                  : 'bg-gradient-to-br from-[#151010] to-[#0E0909] border border-white/6'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white font-bold text-base">{plan.title}</span>
                    <span 
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{
                        background: plan.badgeColor,
                        border: `1px solid ${plan.badgeBorder}`,
                        color: plan.badgeText
                      }}
                    >
                      {plan.badge}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-white/30">{plan.description}</p>
                </div>
                <div 
                  className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                    isSelected ? 'bg-[#C9A227] border-0' : 'border border-white/18 bg-transparent'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 stroke-[3] text-[#050505]" />}
                </div>
              </div>

              <div className="mb-4 pb-4 border-b border-white/6">
                <span className="font-black text-[28px] text-white tracking-[-0.02em]">{plan.price}</span>
                <span className="text-xs font-semibold ml-1.5 text-white/28">{plan.priceLabel}</span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-[11px] font-medium text-white/28">Amount Due Today</span>
                  <span className="text-[11px] font-bold text-white/50">{plan.deposit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[11px] font-medium text-white/28">Remaining Balance</span>
                  <span className="text-[11px] font-bold text-white/50">{plan.balance}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[11px] font-medium text-white/28">Auto-Charge Date</span>
                  <span className="text-[11px] font-bold text-white/50">{plan.chargeDate}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Callback Form - Only shown when Partial Payment is selected */}
      {selectedPlan === "partial" && (
        <div className="rounded-2xl p-6 mt-6 bg-gradient-to-br from-[#151010] to-[#0E0909] border border-[#C9A227]/25 shadow-[0_0_30px_rgba(201,162,39,0.08)]">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-[#C9A227]/15">
              <Phone className="w-4 h-4 text-[#C9A227]" />
            </div>
            <div>
              <div className="text-white font-bold text-sm">
                Get a link for partial payment · Request a Callback
              </div>
              <div className="text-xs font-medium mt-0.5 text-white/32">
                Provide at least one contact detail — our team will reach out to assist you
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {/* WhatsApp Number */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.18em] mb-2 text-white/35">
                WhatsApp Number
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/20">
                  <Smartphone className="w-3.5 h-3.5" />
                </div>
                <input
                  id="whatsapp"
                  type="tel"
                  value={callbackData.whatsapp}
                  onChange={handleCallbackChange}
                  placeholder="+27 800 000 000"
                  className="w-full rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-white/20 outline-none transition-all duration-200 bg-[#0A0707] border border-white/7 focus:border-[#C9A227] font-['Manrope']"
                />
              </div>
            </div>

            {/* Direct Contact Number */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.18em] mb-2 text-white/35">
                Direct Contact Number
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/20">
                  <Phone className="w-3.5 h-3.5" />
                </div>
                <input
                  id="phone"
                  type="tel"
                  value={callbackData.phone}
                  onChange={handleCallbackChange}
                  placeholder="+27 800 000 000"
                  className="w-full rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-white/20 outline-none transition-all duration-200 bg-[#0A0707] border border-white/7 focus:border-[#C9A227] font-['Manrope']"
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.18em] mb-2 text-white/35">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/20">
                  <Mail className="w-3.5 h-3.5" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={callbackData.email}
                  onChange={handleCallbackChange}
                  placeholder="you@email.com"
                  className="w-full rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-white/20 outline-none transition-all duration-200 bg-[#0A0707] border border-white/7 focus:border-[#C9A227] font-['Manrope']"
                />
              </div>
            </div>

            {/* Error Message */}
            {callbackError && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {callbackError}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Single Unified Button */}
      <div className="mt-8">
        <button
          onClick={handleButtonClick}
          disabled={isButtonDisabled()}
          className={`inline-flex items-center justify-center gap-2.5 font-bold rounded-xl transition-all duration-200 active:scale-[0.99] w-full px-8 py-4 text-[15px] ${
            isButtonDisabled()
              ? 'bg-white/5 text-white/30 border border-white/10 cursor-not-allowed'
              : selectedPlan === "partial"
              ? 'bg-gradient-to-r from-[#C9A227] to-[#DFBA3A] text-[#050505] shadow-[0_4px_24px_rgba(201,162,39,0.25)]'
              : 'bg-gradient-to-r from-[#C9A227] to-[#DFBA3A] text-[#050505] shadow-[0_4px_24px_rgba(201,162,39,0.25)]'
          }`}
        >
          {isSubmitting && (
            <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin border-current" />
          )}
          {!isSubmitting && selectedPlan === "partial" && (
            <Phone className="w-4 h-4" />
          )}
          {!isSubmitting && selectedPlan === "full" && (
            <ArrowRight className="w-4 h-4" />
          )}
          {getButtonText()}
        </button>

        {/* Footer Note - Only shown for partial payment */}
        {selectedPlan === "partial" && (
          <p className="text-center text-xs mt-4 text-white/18">
            Partial payment ticket issued only after full amount is received.
          </p>
        )}
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{
            background: "rgba(5, 5, 5, 0.88)",
            backdropFilter: "blur(14px)",
          }}
          onClick={closeModal}
        >
          <div 
            className="relative w-full max-w-[440px] rounded-2xl p-8 text-center"
            style={{
              background: "linear-gradient(160deg, rgb(26, 20, 5) 0%, rgb(17, 14, 3) 50%, rgb(14, 9, 9) 100%)",
              border: "1px solid rgb(201, 162, 39)",
              boxShadow: "rgba(201, 162, 39, 0.2) 0px 0px 80px, rgba(0, 0, 0, 0.7) 0px 40px 100px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              onClick={closeModal}
              className="absolute top-4 right-4 transition-colors text-white/22 hover:text-white/60"
            >
              <X className="w-[18px] h-[18px]" />
            </button>

            {/* Success Icon */}
            <div className="flex justify-center mb-6">
              <div 
                className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, rgb(201, 162, 39), rgb(223, 186, 58))",
                  boxShadow: "rgba(201, 162, 39, 0.4) 0px 0px 60px",
                }}
              >
                <Check className="w-[34px] h-[34px] stroke-[2.5] text-[#050505]" />
              </div>
            </div>

            {/* Title */}
            <div className="text-[10px] font-bold uppercase tracking-[0.25em] mb-2 text-[#C9A227]">
              Request Submitted
            </div>
            <h2 className="text-white font-bold text-2xl mb-3">
              Request Successfully Submitted
            </h2>
            <p className="text-sm font-medium leading-relaxed mb-7 max-w-xs mx-auto text-white/45">
              Our team has received your callback request and will be in touch shortly to arrange your partial payment.
            </p>

            {/* Details */}
            <div 
              className="text-left rounded-xl p-4 mb-7 space-y-2.5"
              style={{
                background: "rgba(0, 0, 0, 0.3)",
                border: "1px solid rgba(201, 162, 39, 0.12)",
              }}
            >
              {callbackResponse.whatsapp && callbackResponse.whatsapp !== "Not provided" && (
                <div className="flex justify-between">
                  <span className="text-xs font-medium text-white/35">WhatsApp</span>
                  <span className="text-xs font-bold text-white/70">{callbackResponse.whatsapp}</span>
                </div>
              )}
              {callbackResponse.phone && callbackResponse.phone !== "Not provided" && (
                <div className="flex justify-between">
                  <span className="text-xs font-medium text-white/35">Direct Contact</span>
                  <span className="text-xs font-bold text-white/70">{callbackResponse.phone}</span>
                </div>
              )}
              {callbackResponse.email && callbackResponse.email !== "Not provided" && (
                <div className="flex justify-between">
                  <span className="text-xs font-medium text-white/35">Email</span>
                  <span className="text-xs font-bold text-white/70">{callbackResponse.email}</span>
                </div>
              )}
              <div className="flex justify-between pt-1 border-t border-white/6">
                <span className="text-xs font-medium text-white/35">Reference</span>
                <span className="text-xs font-bold text-[#C9A227]">{callbackResponse.reference}</span>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={closeModal}
              className="inline-flex items-center justify-center gap-2 font-semibold rounded-xl px-6 py-3.5 text-sm transition-all duration-200 w-full"
              style={{
                border: "1px solid rgba(255, 255, 255, 0.1)",
                color: "rgba(255, 255, 255, 0.55)",
                background: "transparent",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanStep;