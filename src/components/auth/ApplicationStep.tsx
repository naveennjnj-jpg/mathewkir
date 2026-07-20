// components/auth/ApplicationStep.tsx
import React from "react";
import { User, Mail, Phone, Building2, Globe, Zap, Check, Briefcase, Users, TrendingUp } from "lucide-react";

interface ApplicationStepProps {
  formData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    projectDescription: string;
    selectedRole: string; // "entrepreneur" | "professional" | "investor"
    businessUrl: string;
    companyName: string;
    companyUrl: string;
    linkedInUrl: string;
    investmentFocus: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  setSelectedRole: (role: string) => void;
  error?: string | null;
}

const ApplicationStep: React.FC<ApplicationStepProps> = ({
  formData,
  handleInputChange,
  setSelectedRole,
  error,
}) => {
  const roles = [
    {
      id: "entrepreneur",
      title: "Entrepreneur",
      icon: Zap,
      description: "Building or leading a business or startup",
    },
    {
      id: "professional",
      title: "Professional",
      icon: Briefcase,
      description: "Qualified professional with capacity to engage or invest",
    },
    {
      id: "investor",
      title: "Investor",
      icon: TrendingUp,
      description: "Angel investor, venture capitalist, or investment professional",
    },
  ];

  const isEntrepreneur = formData.selectedRole === "entrepreneur";

  return (
    <div className="space-y-0">
      {/* Section 1: Personal Details */}
      <div>
        <div className="mb-4">
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] mb-1 text-[#C9A227]">01</div>
          <div className="text-white font-bold text-base">Personal Details</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* First Name */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-[0.18em] mb-2 text-white/35">
              First Name *
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-[14px] h-[14px] text-white/30" />
              <input
                id="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="James"
                className="w-full rounded-xl py-3.5 pl-11 pr-4 text-sm text-white placeholder-white/30 outline-none transition-all duration-200 bg-[#0A0707] border border-white/7 focus:border-[#C9A227] font-['Manrope']"
              />
            </div>
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-[0.18em] mb-2 text-white/35">
              Last Name *
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-[14px] h-[14px] text-white/30" />
              <input
                id="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Mokoena"
                className="w-full rounded-xl py-3.5 pl-11 pr-4 text-sm text-white placeholder-white/30 outline-none transition-all duration-200 bg-[#0A0707] border border-white/7 focus:border-[#C9A227] font-['Manrope']"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-[0.18em] mb-2 text-white/35">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-[14px] h-[14px] text-white/30" />
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="james@company.co.za"
                className="w-full rounded-xl py-3.5 pl-11 pr-4 text-sm text-white placeholder-white/30 outline-none transition-all duration-200 bg-[#0A0707] border border-white/7 focus:border-[#C9A227] font-['Manrope']"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-[0.18em] mb-2 text-white/35">
              Phone Number *
            </label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-[14px] h-[14px] text-white/30" />
              <input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+27 800 000 000"
                className="w-full rounded-xl py-3.5 pl-11 pr-4 text-sm text-white placeholder-white/30 outline-none transition-all duration-200 bg-[#0A0707] border border-white/7 focus:border-[#C9A227] font-['Manrope']"
              />
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Divider */}
      <div className="my-8 border-t border-white/5" />

      {/* Section 2: Project Description */}
      <div>
        <div className="mb-4">
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] mb-1 text-[#C9A227]">02</div>
          <div className="text-white font-bold text-base">Which project are you currently working on?</div>
        </div>

        <textarea
          id="projectDescription"
          rows={3}
          value={formData.projectDescription}
          onChange={handleInputChange}
          placeholder="Describe what you're building — product, stage, traction…"
          className="w-full rounded-xl px-4 py-3.5 text-sm text-white placeholder-white/30 outline-none resize-none transition-all duration-200 bg-[#0A0707] border border-white/7 focus:border-[#C9A227] font-['Manrope']"
        />
      </div>

      {/* Divider */}
      <div className="my-8 border-t border-white/5" />

      {/* Section 3: Role Selection */}
      <div>
        <div className="mb-4">
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] mb-1 text-[#C9A227]">03</div>
          <div className="text-white font-bold text-base">Select Your Role</div>
          <div className="text-xs font-medium mt-0.5 text-white/28">Choose the role that best describes you</div>
        </div>

        <div className="space-y-3">
          {roles.map((role) => {
            const Icon = role.icon;
            const isSelected = formData.selectedRole === role.id;

            return (
              <button
                key={role.id}
                onClick={() => setSelectedRole(role.id)}
                className={`w-full flex items-center gap-4 p-4 rounded-xl text-left transition-all duration-200 ${
                  isSelected 
                    ? 'bg-[#C9A227]/10 border border-[#C9A227] shadow-[0_0_28px_rgba(201,162,39,0.15)]' 
                    : 'bg-[#0A0707] border border-white/5 hover:border-white/15'
                }`}
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  isSelected ? 'bg-[#C9A227]/20' : 'bg-white/5'
                }`}>
                  <Icon className={`w-[18px] h-[18px] ${isSelected ? 'text-[#C9A227]' : 'text-white/35'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`font-bold text-sm ${isSelected ? 'text-[#C9A227]' : 'text-white/80'}`}>
                    I'm a {role.title}
                  </div>
                  <div className="text-xs font-medium mt-0.5 text-white/30">
                    {role.description}
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                  isSelected 
                    ? 'bg-gradient-to-r from-[#C9A227] to-[#DFBA3A]' 
                    : 'border border-white/15'
                }`}>
                  {isSelected && <Check className="w-[10px] h-[10px]" strokeWidth={3} style={{ color: '#050505' }} />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Divider - Only show if Entrepreneur is selected */}
      {isEntrepreneur && (
        <div className="my-8 border-t border-white/5" />
      )}

      {/* Section 4: Business Details - Only show for Entrepreneur */}
      {isEntrepreneur && (
        <div>
          <div className="mb-4">
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] mb-1 text-[#C9A227]">04</div>
            <div className="text-white font-bold text-base">Business Details</div>
            <div className="text-xs font-medium mt-0.5 text-white/28">Tell us about your business</div>
          </div>

          <div className="space-y-4">
            {/* Business URL */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.18em] mb-2 text-white/35">
                Business URL *
              </label>
              <div className="relative">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-[14px] h-[14px] text-white/30" />
                <input
                  id="businessUrl"
                  type="url"
                  value={formData.businessUrl}
                  onChange={handleInputChange}
                  placeholder="https://yourbusiness.com or social media page"
                  className="w-full rounded-xl py-3.5 pl-11 pr-4 text-sm text-white placeholder-white/30 outline-none transition-all duration-200 bg-[#0A0707] border border-white/7 focus:border-[#C9A227] font-['Manrope']"
                />
              </div>
              <p className="text-[11px] font-medium mt-1.5 text-white/28">
                You can provide a website link or a social media page link (Facebook, Instagram, LinkedIn, etc.)
              </p>
            </div>

            {/* Company Name */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.18em] mb-2 text-white/35">
                Company / Business Name *
              </label>
              <div className="relative">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-[14px] h-[14px] text-white/30" />
                <input
                  id="companyName"
                  type="text"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  placeholder="e.g. Smith & Associates, TechStartup Inc…"
                  className="w-full rounded-xl py-3.5 pl-11 pr-4 text-sm text-white placeholder-white/30 outline-none transition-all duration-200 bg-[#0A0707] border border-white/7 focus:border-[#C9A227] font-['Manrope']"
                />
              </div>
            </div>

            {/* Company URL */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.18em] mb-2 text-white/35">
                Company URL *
              </label>
              <div className="relative">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-[14px] h-[14px] text-white/30" />
                <input
                  id="companyUrl"
                  type="url"
                  value={formData.companyUrl}
                  onChange={handleInputChange}
                  placeholder="https://yourcompany.co.za or LinkedIn company page"
                  className="w-full rounded-xl py-3.5 pl-11 pr-4 text-sm text-white placeholder-white/30 outline-none transition-all duration-200 bg-[#0A0707] border border-white/7 focus:border-[#C9A227] font-['Manrope']"
                />
              </div>
              <p className="text-[11px] font-medium mt-1.5 text-white/28">
                Website or social media page — whichever best represents your business
              </p>
            </div>

            {/* LinkedIn URL */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.18em] mb-2 text-white/35">
                LinkedIn Profile URL *
              </label>
              <div className="relative">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-[14px] h-[14px] text-white/30" />
                <input
                  id="linkedInUrl"
                  type="text"
                  value={formData.linkedInUrl}
                  onChange={handleInputChange}
                  placeholder="linkedin.com/in/yourprofile"
                  className="w-full rounded-xl py-3.5 pl-11 pr-4 text-sm text-white placeholder-white/30 outline-none transition-all duration-200 bg-[#0A0707] border border-white/7 focus:border-[#C9A227] font-['Manrope']"
                />
              </div>
            </div>

            {/* Investment Focus */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.18em] mb-2 text-white/35">
                Investment Focus (optional)
              </label>
              <textarea
                id="investmentFocus"
                rows={2}
                value={formData.investmentFocus}
                onChange={handleInputChange}
                placeholder="e.g. fintech, property, agri, technology startups…"
                className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 outline-none resize-none transition-all duration-200 bg-[#0A0707] border border-white/7 focus:border-[#C9A227] font-['Manrope']"
              />
            </div>
          </div>
        </div>
      )}

      {/* Message for non-entrepreneurs */}
      {!isEntrepreneur && formData.selectedRole && (
        <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/5">
          <p className="text-sm text-white/40 text-center">
            {formData.selectedRole === "professional" 
              ? "As a Professional, you'll be able to engage with entrepreneurs and explore investment opportunities."
              : "As an Investor, you'll get access to curated investment opportunities and pitch sessions."}
          </p>
        </div>
      )}
    </div>
  );
};

export default ApplicationStep;