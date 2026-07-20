import React from "react";
import { Link } from "react-router-dom";
import Logo from "@/assets/home/logo.png";

const MainFooter: React.FC = () => {
  return (
    <>
      {/* Footer */}
      <footer className="bg-black border-t border-[#d4af37]/20 py-6 px-6 pb-5">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between flex-wrap gap-5 mb-4">
            <div className="flex items-center gap-3.5">
              <img src={Logo} alt="The Black Roundtable" className="h-8 w-auto object-contain" />
              <div className="text-[11px] font-normal text-white/35">Africa's premier founder &amp; investor networking platform</div>
            </div>
            <div className="flex items-center gap-6 flex-wrap">
              {['Privacy Policy', 'Terms & Conditions', 'Site Notice', 'Contact Us'].map((text) => (
                <a key={text} href="#" className="text-xs font-medium text-white/35 no-underline transition-colors hover:text-white/60">{text}</a>
              ))}
            </div>
            {/* <div className="flex items-center gap-2.5">
              {[Linkedin, Twitter, Youtube].map((Icon, idx) => (
                <div key={idx} className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center cursor-pointer transition-all duration-200 hover:bg-[#d4af37]/10 hover:border-[#d4af37]/30">
                  <Icon size={13} className="text-white/40 hover:text-[#d4af37]" />
                </div>
              ))}
            </div> */}
          </div>
          <div className="border-t border-white/5 pt-[14px] text-center">
            <span className="text-[11px] font-normal text-white/25">© 2026 The Black Round Table. All rights reserved. · BRT150 · 21 November 2026 · Ethereal, Newcastle, KwaZulu-Natal</span>
          </div>
        </div>
      </footer>
    </>
  );
};

export default MainFooter;