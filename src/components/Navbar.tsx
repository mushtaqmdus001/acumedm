import { Link, useLocation } from 'react-router-dom';
import { Calendar, Menu, Phone, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../lib/utils';
import { CLINIC_INFO } from '../constants';
import acumedLogo from '../assets/images/acumed-logo.png';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Navigation mirrors the section order in the attached AcuMeD HTML.
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/#services' },
    { name: 'About', path: '/#about' },
    { name: 'Conditions', path: '/#conditions' },
    { name: 'FAQ', path: '/#faq' },
    { name: 'Location', path: '/#location' },
    { name: 'Insurance', path: '/#insurance' },
  ];

  const isActive = (path: string) => {
    if (path.includes('#')) {
      return location.pathname + location.hash === path;
    }
    return location.pathname === path && location.hash === '';
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-[72px] gap-4">
          <Link to="/" className="flex items-center shrink-0" aria-label="AcuMeD Clinic Home">
            <img
              src={acumedLogo}
              alt="AcuMeD Clinic"
              className="h-11 w-auto object-contain"
            />
          </Link>

          <div className="hidden xl:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={cn(
                  'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  isActive(link.path)
                    ? 'text-teal-700 bg-teal-50'
                    : 'text-gray-600 hover:text-teal-700 hover:bg-teal-50'
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3 shrink-0">
            <a
              href={`tel:${CLINIC_INFO.phone}`}
              className="hidden lg:inline-flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-teal-700"
            >
              <Phone className="w-4 h-4 text-teal-600" />
              {CLINIC_INFO.phone}
            </a>
            <Link
              to="/book"
              className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-md shadow-teal-600/20"
            >
              <Calendar className="w-4 h-4" />
              Book Appointment
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen((open) => !open)}
            className="xl:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg text-gray-700 hover:bg-teal-50 hover:text-teal-700"
            aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="xl:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    'px-4 py-3 rounded-xl font-medium',
                    isActive(link.path)
                      ? 'bg-teal-50 text-teal-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col sm:flex-row gap-3">
              <a
                href={`tel:${CLINIC_INFO.phone}`}
                className="flex items-center justify-center gap-2 border border-gray-200 rounded-xl px-4 py-3 font-semibold text-gray-700"
              >
                <Phone className="w-4 h-4 text-teal-600" />
                {CLINIC_INFO.phone}
              </a>
              <Link
                to="/book"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 bg-teal-600 text-white rounded-xl px-4 py-3 font-bold"
              >
                <Calendar className="w-4 h-4" />
                Book Appointment
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
