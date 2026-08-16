import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Twitter } from 'lucide-react';
import { CLINIC_INFO, SERVICES } from '../constants';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                Ac
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-white leading-tight">AcuMeD Clinic</span>
                <span className="text-[10px] uppercase tracking-widest text-teal-400 font-semibold">Acupuncture & Herbs</span>
              </div>
            </Link>
            <p className="text-sm leading-relaxed text-gray-400">
              Holistic healing for mind, body, and spirit. Serving the greater Boston & Watertown area with evidence-informed integrative medicine since 2004.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-teal-600 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-teal-600 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-teal-600 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-bold mb-6">Our Services</h4>
            <ul className="space-y-4 text-sm">
              {SERVICES.map((service) => (
                <li key={service.id}>
                  <Link to={`/#services`} className="hover:text-teal-400 transition-colors">
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-6">Quick Links</h4>
            <ul className="space-y-4 text-sm">
              <li><Link to="/" className="hover:text-teal-400 transition-colors">Home</Link></li>
              <li><Link to="/#about" className="hover:text-teal-400 transition-colors">About Dr. Medhati</Link></li>
              <li><Link to="/#testimonials" className="hover:text-teal-400 transition-colors">Patient Reviews</Link></li>
              <li><Link to="/#contact" className="hover:text-teal-400 transition-colors">Contact & Location</Link></li>
              <li><Link to="/book" className="hover:text-teal-400 transition-colors">Book Appointment</Link></li>
              <li><Link to="/admin" className="hover:text-teal-400 transition-colors">Admin Portal</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold mb-6">Contact Us</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-teal-500 shrink-0" />
                <span>{CLINIC_INFO.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-teal-500 shrink-0" />
                <a href={`tel:${CLINIC_INFO.phone}`} className="hover:text-teal-400 transition-colors">{CLINIC_INFO.phone}</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-teal-500 shrink-0" />
                <a href={`mailto:${CLINIC_INFO.email}`} className="hover:text-teal-400 transition-colors">{CLINIC_INFO.email}</a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-teal-500 shrink-0" />
                <div className="space-y-1">
                  <p className="font-semibold text-white">Office Hours</p>
                  <p>Mon-Fri: 9:00 AM – 6:00 PM</p>
                  <p>Sat: 9:00 AM – 2:00 PM</p>
                  <p>Sun: Closed</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-10 border-t border-gray-800 text-center text-xs text-gray-500">
          <p>© {currentYear} AcuMeD Acupuncture & Herbs Clinic. All rights reserved.</p>
          <p className="mt-2">Not a substitute for emergency medical care. If you have a medical emergency, call 911.</p>
        </div>
      </div>
    </footer>
  );
}
