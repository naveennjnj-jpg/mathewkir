import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, ChevronDown, X as CloseIcon } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSolutionsOpen, setIsSolutionsOpen] = useState(false);
  const [isCompanyOpen, setIsCompanyOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAnnouncementVisible, setIsAnnouncementVisible] = useState(true);
  const [hoverTimeout, setHoverTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);
  const solutionsRef = useRef<HTMLLIElement | null>(null);
  const companyRef = useRef<HTMLLIElement | null>(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleMouseEnter = (setter: React.Dispatch<React.SetStateAction<boolean>>) => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
    setter(true);
  };

  const handleMouseLeave = (setter: React.Dispatch<React.SetStateAction<boolean>>) => {
    const timeout = setTimeout(() => {
      setter(false);
    }, 200);
    setHoverTimeout(timeout);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (solutionsRef.current && !solutionsRef.current.contains(event.target as Node)) {
        setIsSolutionsOpen(false);
      }
      if (companyRef.current && !companyRef.current.contains(event.target as Node)) {
        setIsCompanyOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
      }
    };
  }, [hoverTimeout]);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  // Solutions data
  const solutionsData = [
    {
      title: "Academics & Research",
      description: "Amplify the reach of your research",
      link: "/solutions/academics-research",
    },
    {
      title: "University Communications",
      description: "Strategic support for campus teams",
      link: "/solutions/university-communications",
    },
    {
      title: "Higher Education Organisations",
      description: "Sector-level advocacy and reputation",
      link: "/solutions/higher-education",
    },
    {
      title: "Global Development & Philanthropy",
      description: "Impact storytelling for development orgs",
      link: "/solutions/global-development",
    },
    {
      title: "Corporate Social Impact Teams",
      description: "Credible CSI and ESG communications",
      link: "/solutions/corporate-social-impact",
    },
    {
      title: "Executive Leaders & Founders",
      description: "Personal communication authority",
      link: "/solutions/executive-leaders",
    },
    {
      title: "Workshops",
      description: "Expert-led training programmes",
      link: "/workshops",
    },
  ];

  return (
    <>
      {/* Top announcement bar */}
      {isAnnouncementVisible && (
        <div className="relative bg-[#1a1a1a] text-center text-[13px] py-2.5 px-5 text-[#a0a0a0] border-b border-white/5">
          <span>
            Tickets for <a href="#" className="text-[#C85A32] font-semibold hover:text-[#a8472a] transition-colors">BRT150 2027</a> are now available ›
          </span>
          <button
            onClick={() => setIsAnnouncementVisible(false)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#a0a0a0] hover:text-white transition-colors"
            aria-label="Close announcement"
          >
            <CloseIcon size={16} />
          </button>
        </div>
      )}

      <header className={`pt-6 transition-all duration-300 ${
        isScrolled ? 'bg-black/80 backdrop-blur-lg shadow-lg' : 'bg-transparent'
      }`}>
        <div className="max-w-[1240px] mx-auto px-6 md:px-10 flex items-center justify-between">
          {/* Logo - Updated to BRT */}
          <Link to="/" className="text-2xl font-bold tracking-wide text-white">
            BRT
          </Link>

          {/* Desktop Menu */}
          <ul className="hidden md:flex items-center gap-8 text-[14.5px] text-[#ece8e0] list-none">
            <li>
              <Link to="/about" className="cursor-pointer hover:text-gold transition">
                About Us
              </Link>
            </li>
            
            {/* Solutions Dropdown */}
            <li 
              className="relative" 
              ref={solutionsRef}
              onMouseEnter={() => handleMouseEnter(setIsSolutionsOpen)}
              onMouseLeave={() => handleMouseLeave(setIsSolutionsOpen)}
            >
              <button
                className="cursor-pointer flex items-center gap-1 hover:text-gold transition outline-none"
                aria-expanded={isSolutionsOpen}
              >
                Solutions <span className="text-xs">▾</span>
              </button>

              {isSolutionsOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 w-[660px] z-50">
                  <div className="bg-white/85 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/60 overflow-hidden">
                    {/* Header */}
                    <div className="bg-gray-50/70 border-b border-white/40 px-6 py-3">
                      <p className="text-[#1C1C1C] font-semibold text-sm">Solutions</p>
                      <p className="text-gray-400 text-xs mt-0.5">Communication strategies for every sector</p>
                    </div>

                    {/* Grid Items */}
                    <div className="grid grid-cols-2 gap-0 p-3">
                      {solutionsData.map((item, index) => (
                        <Link
                          key={index}
                          to={item.link}
                          className="flex items-start gap-3 p-3.5 rounded-xl hover:bg-white/60 transition-colors group"
                        >
                          <div>
                            <p className="text-sm font-semibold text-[#1C1C1C] leading-snug">
                              {item.title}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {item.description}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>

                    {/* Footer CTA */}
                    <div className="border-t border-white/40 px-6 py-3 bg-white/40 flex items-center justify-between">
                      <p className="text-xs text-gray-500">Not sure which solution fits? We'll help.</p>
                      <Link
                        to="/contact"
                        className="text-xs font-semibold text-[#C85A32] hover:text-[#a8472a] transition-colors ml-4"
                      >
                        Talk to us →
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </li>

            <li>
              <Link to="/pricing" className="cursor-pointer hover:text-gold transition">
                Plans & Pricing
              </Link>
            </li>
            
            <li>
              <Link to="/partnerships" className="cursor-pointer hover:text-gold transition">
                Partners & Sponsors
              </Link>
            </li>
            
            <li>
              <Link to="/spotlight" className="cursor-pointer hover:text-gold transition">
                Spotlight
              </Link>
            </li>
            
            <li>
              <Link to="/events" className="cursor-pointer hover:text-gold transition">
                Events & Tickets
              </Link>
            </li>
            
            <li>
              <Link to="/contact" className="cursor-pointer hover:text-gold transition">
                Contact Us
              </Link>
            </li>
          </ul>

          {/* Login Dropdown */}
          <div className="hidden md:flex items-center gap-2 bg-white/[.07] border border-white/[.18] px-4 py-2.5 rounded-full text-sm cursor-pointer hover:bg-white/[.12] transition">
            Login As <span className="text-xs">▾</span>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 transition-colors duration-300 text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden fixed inset-0 top-[72px] bg-black/95 backdrop-blur-lg overflow-y-auto">
            <div className="flex flex-col p-6 space-y-4">
              <Link
                to="/about"
                className="text-sm transition-all duration-300 px-3 py-2 rounded-lg text-white hover:bg-white/10"
                onClick={() => setIsMenuOpen(false)}
              >
                About Us
              </Link>

              {/* Mobile Solutions */}
              <div className="border-b border-white/10 pb-4">
                <button
                  className="text-sm transition-all duration-300 px-3 py-2 rounded-lg flex items-center gap-1 outline-none text-white hover:bg-white/10 w-full justify-between"
                  onClick={() => setIsSolutionsOpen(!isSolutionsOpen)}
                >
                  <span>Solutions</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    isSolutionsOpen ? 'rotate-180' : ''
                  }`} />
                </button>
                {isSolutionsOpen && (
                  <div className="mt-3 space-y-3 pl-3">
                    {solutionsData.map((item, index) => (
                      <Link
                        key={index}
                        to={item.link}
                        className="flex items-start gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <div>
                          <p className="text-sm text-white font-medium">{item.title}</p>
                          <p className="text-xs text-white/60">{item.description}</p>
                        </div>
                      </Link>
                    ))}
                    <Link
                      to="/contact"
                      className="block text-sm text-[#C85A32] font-medium mt-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Talk to us →
                    </Link>
                  </div>
                )}
              </div>

              <Link
                to="/pricing"
                className="text-sm transition-all duration-300 px-3 py-2 rounded-lg text-white hover:bg-white/10"
                onClick={() => setIsMenuOpen(false)}
              >
                Plans & Pricing
              </Link>

              <Link
                to="/partnerships"
                className="text-sm transition-all duration-300 px-3 py-2 rounded-lg text-white hover:bg-white/10"
                onClick={() => setIsMenuOpen(false)}
              >
                Partners & Sponsors
              </Link>

              <Link
                to="/spotlight"
                className="text-sm transition-all duration-300 px-3 py-2 rounded-lg text-white hover:bg-white/10"
                onClick={() => setIsMenuOpen(false)}
              >
                Spotlight
              </Link>

              <Link
                to="/events"
                className="text-sm transition-all duration-300 px-3 py-2 rounded-lg text-white hover:bg-white/10"
                onClick={() => setIsMenuOpen(false)}
              >
                Events & Tickets
              </Link>

              <Link
                to="/contact"
                className="text-sm transition-all duration-300 px-3 py-2 rounded-lg text-white hover:bg-white/10"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact Us
              </Link>

              {/* Mobile Login */}
              <div className="flex items-center justify-center gap-2 bg-white/[.07] border border-white/[.18] px-4 py-2.5 rounded-full text-sm text-white mt-4">
                Login As <span className="text-xs">▾</span>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;