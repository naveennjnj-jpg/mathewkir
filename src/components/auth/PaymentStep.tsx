// components/auth/PaymentStep.tsx
import React from "react";
import { CreditCard, Smartphone, Building, Lock, Shield, Check, CircleCheckBig, User, Calendar, Crown } from "lucide-react";

interface PaymentStepProps {
  selectedPlan: "full" | "partial" | null;
  paymentMethod: string | null;
  setPaymentMethod: (method: string) => void;
  acceptedTerms: boolean;
  setAcceptedTerms: (accepted: boolean) => void;
  cardDetails: {
    cardNumber: string;
    cardHolder: string;
    expiryDate: string;
    cvv: string;
  };
  handleCardChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string | null;
  loading?: boolean;
  onPay?: () => void;
  onBack?: () => void; // Add back handler prop
}

const PaymentStep: React.FC<PaymentStepProps> = ({
  selectedPlan,
  paymentMethod,
  setPaymentMethod,
  acceptedTerms,
  setAcceptedTerms,
  cardDetails,
  handleCardChange,
  error,
  loading,
  onPay,
  onBack, // Receive back handler
}) => {
  const paymentMethods = [
    { id: "card", label: "Card", icon: CreditCard, available: true },
    { id: "apple", label: "Apple Pay", icon: Smartphone, available: false },
    { id: "google", label: "Google Pay", icon: Smartphone, available: false },
    { id: "bank", label: "Bank Transfer", icon: Building, available: false },
  ];

  const totalAmount = selectedPlan === "full" ? "R2,040" : "R1,018";
  const remainingBalance = selectedPlan === "full" ? "R0" : "R1,017";

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const groups = cleaned.match(/.{1,4}/g);
    return groups ? groups.join(' ') : cleaned;
  };

  const formatExpiry = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    }
    return cleaned;
  };

  const handleCardInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    let formattedValue = value;
    if (id === 'cardNumber') formattedValue = formatCardNumber(value);
    if (id === 'expiryDate') formattedValue = formatExpiry(value);
    const event = { ...e, target: { ...e.target, id, value: formattedValue } } as React.ChangeEvent<HTMLInputElement>;
    handleCardChange(event);
  };

  const handlePayClick = () => {
    if (!loading && acceptedTerms && paymentMethod) {
      onPay?.();
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="text-[10px] font-bold uppercase tracking-[0.25em] mb-3 text-[#C9A227]">Step 4 of 5</div>
        <h1 className="text-white font-bold text-3xl mb-3">Payment</h1>
        <p className="text-sm font-medium max-w-xs mx-auto leading-relaxed text-white/40">
          Complete your payment to secure your spot
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
      )}

      {/* Grid Layout: Order Summary + Secure Payment */}
      <div className="grid grid-cols-1 lg:grid-cols-[440px_1fr] gap-8">
        {/* Order Summary Card - Left */}
        <div className="flex flex-col gap-5">
          <div className="rounded-2xl p-7 bg-gradient-to-br from-[#151010] to-[#0E0909] border border-white/6 shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] mb-6 text-[#C9A227]">Order Summary</div>
            
            {/* Event Info */}
            <div className="flex items-center gap-4 p-4 rounded-xl mb-6 bg-white/5 border border-white/6">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-[#C9A227]/15">
                <Crown className="w-5 h-5 text-[#C9A227]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-white font-bold text-sm truncate">Purchase tickets for the BRT150 2026 Event</div>
                <div className="text-xs font-medium mt-0.5 text-white/35 truncate">BRT150 Demo Day · Lagos, 2026</div>
              </div>
              <div className="ml-auto font-bold text-base text-white flex-shrink-0">R2,000</div>
            </div>

            {/* Price Breakdown */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-white/38">Subtotal</span>
                <span className="text-sm font-semibold text-white/60">R2,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-white/38">Processing Fee</span>
                <span className="text-sm font-semibold text-white/60">R40</span>
              </div>
            </div>

            {/* Total */}
            <div className="flex items-center justify-between pt-5 border-t border-white/7">
              <span className="text-white font-bold text-lg">Total</span>
              <span className="font-bold text-2xl bg-gradient-to-r from-[#C9A227] to-[#DFBA3A] bg-clip-text text-transparent tracking-[-0.02em]">
                R2,040
              </span>
            </div>
          </div>

          {/* Security Footer */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
            <div className="flex items-center gap-2 flex-1 justify-center">
              <Shield className="w-3.5 h-3.5 text-[#C9A227]/60" />
              <span className="text-[10px] font-semibold text-white/25">SSL Encrypted</span>
            </div>
            <div className="flex items-center gap-2 flex-1 justify-center">
              <Lock className="w-3.5 h-3.5 text-[#C9A227]/60" />
              <span className="text-[10px] font-semibold text-white/25">PCI DSS Secure</span>
            </div>
            <div className="flex items-center gap-2 flex-1 justify-center">
              <CircleCheckBig className="w-3.5 h-3.5 text-[#C9A227]/60" />
              <span className="text-[10px] font-semibold text-white/25">Verified Payment</span>
            </div>
          </div>
        </div>

        {/* Secure Payment Card - Right */}
        <div className="rounded-2xl p-8 bg-gradient-to-br from-[#151010] to-[#0E0909] border border-white/6 shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] mb-7 text-[#C9A227]">Secure Payment</div>

          {/* Payment Summary */}
          <div className="flex items-center justify-between p-3.5 rounded-xl mb-7 bg-[#C9A227]/7 border border-[#C9A227]/20">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#C9A227]">
                {selectedPlan === "full" ? "Full Payment" : "Partial Payment"}
              </div>
              <div className="text-xs font-medium mt-0.5 text-white/40">
                {selectedPlan === "full" ? "R2,040 due today" : `R${totalAmount} due today`}
              </div>
            </div>
            <span className="font-black text-lg bg-gradient-to-r from-[#C9A227] to-[#DFBA3A] bg-clip-text text-transparent">
              {totalAmount}
            </span>
          </div>

          {/* Divider */}
          <div className="border-t border-white/5 mb-7"></div>

          {/* Payment Method */}
          <div className="text-[10px] font-bold uppercase tracking-[0.18em] mb-3 text-white/35">Payment Method</div>
          
          {/* Payment Method Toggle */}
          <div className="flex rounded-xl p-1 mb-7 gap-1 bg-[#0A0707]">
            {paymentMethods.map((method) => {
              const Icon = method.icon;
              const isSelected = paymentMethod === method.id;
              const isAvailable = method.available;

              return (
                <button
                  key={method.id}
                  onClick={() => isAvailable && setPaymentMethod(method.id)}
                  disabled={!isAvailable}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                    isSelected && isAvailable
                      ? "bg-gradient-to-r from-[#C9A227] to-[#DFBA3A] text-[#050505]"
                      : "bg-transparent text-white/30"
                  } ${!isAvailable ? "cursor-not-allowed opacity-50" : ""}`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{method.label}</span>
                </button>
              );
            })}
          </div>

          {/* Card Details Form */}
          {paymentMethod === "card" && (
            <div className="space-y-5">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-[0.18em] mb-2 text-white/35">
                  Cardholder Name
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/20">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <input
                    id="cardHolder"
                    type="text"
                    value={cardDetails.cardHolder}
                    onChange={handleCardChange}
                    placeholder="James Adeyemi"
                    className="w-full rounded-xl py-3.5 pl-11 pr-4 text-sm text-white placeholder-white/20 outline-none transition-all duration-200 bg-[#0A0707] border border-white/7 focus:border-[#C9A227] font-['Manrope']"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-[0.18em] mb-2 text-white/35">
                  Card Number
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/20">
                    <CreditCard className="w-3.5 h-3.5" />
                  </div>
                  <input
                    id="cardNumber"
                    type="text"
                    value={cardDetails.cardNumber}
                    onChange={handleCardInputChange}
                    placeholder="•••• •••• •••• ••••"
                    maxLength={19}
                    className="w-full rounded-xl py-3.5 pl-11 pr-16 text-sm text-white placeholder-white/20 outline-none transition-all duration-200 bg-[#0A0707] border border-white/7 focus:border-[#C9A227] font-['Manrope'] tracking-[0.08em]"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-1">
                    <div className="w-7 h-4 rounded bg-white/10 flex items-center justify-center">
                      <span className="text-[7px] font-bold text-white/50">VISA</span>
                    </div>
                    <div className="w-7 h-4 rounded bg-white/10 flex items-center justify-center">
                      <span className="text-[6px] font-bold text-white/50">MC</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.18em] mb-2 text-white/35">
                    Expiry Date
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/20">
                      <Calendar className="w-3.5 h-3.5" />
                    </div>
                    <input
                      id="expiryDate"
                      type="text"
                      value={cardDetails.expiryDate}
                      onChange={handleCardInputChange}
                      placeholder="MM / YY"
                      maxLength={5}
                      className="w-full rounded-xl py-3.5 pl-11 pr-4 text-sm text-white placeholder-white/20 outline-none transition-all duration-200 bg-[#0A0707] border border-white/7 focus:border-[#C9A227] font-['Manrope']"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.18em] mb-2 text-white/35">
                    CVV
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/20">
                      <Lock className="w-3.5 h-3.5" />
                    </div>
                    <input
                      id="cvv"
                      type="password"
                      value={cardDetails.cvv}
                      onChange={handleCardChange}
                      placeholder="•••"
                      maxLength={4}
                      className="w-full rounded-xl py-3.5 pl-11 pr-4 text-sm text-white placeholder-white/20 outline-none transition-all duration-200 bg-[#0A0707] border border-white/7 focus:border-[#C9A227] font-['Manrope']"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Terms & Pay Button */}
          <div className="mt-8">
            <div className="flex items-start gap-3 mb-6">
              <button
                onClick={() => setAcceptedTerms(!acceptedTerms)}
                className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                  acceptedTerms ? 'bg-[#C9A227]' : 'bg-white/5 border border-white/10'
                }`}
              >
                {acceptedTerms && <Check className="w-3 h-3 stroke-[3] text-[#050505]" />}
              </button>
              <label className="text-xs leading-relaxed cursor-pointer text-white/30">
                I agree to the <span className="text-[#C9A227]">Terms & Conditions</span> and <span className="text-[#C9A227]">Privacy Policy</span>. I understand that tickets are non-refundable.
              </label>
            </div>

            {/* Pay Button */}
            <button
              onClick={handlePayClick}
              disabled={loading || !acceptedTerms || !paymentMethod}
              className="inline-flex items-center justify-center gap-2.5 font-bold rounded-xl transition-all duration-200 active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed w-full px-8 py-4 text-[15px] bg-gradient-to-r from-[#C9A227] to-[#DFBA3A] text-[#050505] shadow-[0_4px_24px_rgba(201,162,39,0.25)]"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin border-[#050505]" />
                  Processing...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  Pay {totalAmount} {selectedPlan === "full" ? "in Full" : "Today"}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentStep;