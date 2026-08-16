import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Calendar, Sparkles, Mic } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../lib/utils';
import { CLINIC_INFO, IMAGES } from '../constants';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const handleOpenAiAssistant = () => {
    window.dispatchEvent(new CustomEvent('open-ai-chat'));
    setIsOpen(false);
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/#services' },
    { name: 'About', path: '/#about' },
    { name: 'Reviews', path: '/#testimonials' },
    { name: 'Contact', path: '/#contact' },
  ];

  const isActive = (path: string) => {
    if (path.includes('#')) {
      return location.pathname + location.hash === path;
    }
    return location.pathname === path && location.hash === '';
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                Ac
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-gray-900 leading-tight">AcuMeD Clinic</span>
                <span className="text-[10px] uppercase tracking-widest text-teal-600 font-semibold">Acupuncture & Herbs</span>
              </div>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-teal-600",
                  isActive(link.path) ? "text-teal-600" : "text-gray-600"
                )}
              >
                {link.name}
              </Link>
            ))}

            <button
              onClick={handleOpenAiAssistant}
              className="inline-flex items-center gap-2 bg-teal-50/90 hover:bg-teal-100/90 text-teal-900 border border-teal-200/90 pl-1.5 pr-3 py-1 rounded-full text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
              title="Open Care Guide & Voice Assistant"
            >
              <div className="w-5 h-5 rounded-full overflow-hidden border border-teal-300 shrink-0">
                <img
                  src={IMAGES.aiAvatar}
                  alt="Care Guide"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <span>Ask Care Guide</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </button>

            <div className="flex items-center gap-3 pl-3 border-l border-gray-100">
              <a href={`tel:${CLINIC_INFO.phone}`} className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 hover:text-teal-600 transition-colors">
                <Phone className="w-3.5 h-3.5 text-teal-600" />
                {CLINIC_INFO.phone}
              </a>
              <Link
                to="/book"
                className="inline-flex items-center gap-1.5 bg-teal-600 text-white px-4 py-2 rounded-full text-xs font-bold hover:bg-teal-700 transition-all shadow-md shadow-teal-600/20 active:scale-95"
              >
                <Calendar className="w-3.5 h-3.5" />
                Book Now
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={handleOpenAiAssistant}
              className="inline-flex items-center gap-1.5 bg-teal-50 text-teal-800 border border-teal-200 pl-1 pr-2.5 py-1 rounded-full text-xs font-bold"
            >
              <div className="w-4 h-4 rounded-full overflow-hidden border border-teal-300 shrink-0">
                <img
                  src={IMAGES.aiAvatar}
                  alt="Care Guide"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <span>Care Guide</span>
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-teal-600 p-2"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 animate-in slide-in-from-top duration-300">
          <div className="px-4 pt-2 pb-6 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "block px-3 py-4 text-base font-medium rounded-md",
                  isActive(link.path) ? "bg-teal-50 text-teal-600" : "text-gray-600 hover:bg-gray-50"
                )}
              >
                {link.name}
              </Link>
            ))}

            <button
              onClick={handleOpenAiAssistant}
              className="w-full flex items-center justify-center gap-2.5 bg-teal-50 text-teal-900 border border-teal-200 py-3 rounded-xl font-bold text-sm"
            >
              <div className="w-6 h-6 rounded-full overflow-hidden border border-teal-300 shrink-0">
                <img
                  src={IMAGES.aiAvatar}
                  alt="Care Guide"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <span>Ask Our Holistic Care Guide</span>
            </button>

            <div className="pt-4 space-y-4">
              <a href={`tel:${CLINIC_INFO.phone}`} className="flex items-center gap-3 px-3 py-2 text-gray-700 font-semibold">
                <Phone className="w-5 h-5 text-teal-600" />
                {CLINIC_INFO.phone}
              </a>
              <Link
                to="/book"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center bg-teal-600 text-white px-6 py-4 rounded-xl font-bold hover:bg-teal-700 transition-colors"
              >
                Book Appointment
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
