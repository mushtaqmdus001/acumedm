import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Phone,
  CheckCircle,
  ArrowRight,
  Star,
  MapPin,
  Clock,
  Mail,
  Sparkles,
  Mic,
  MessageSquare,
  ShieldCheck,
  Award,
  HeartPulse
} from 'lucide-react';
import { CLINIC_INFO, IMAGES } from '../constants';
import { cn } from '../lib/utils';
import { Testimonials } from '../components/Testimonials';
import { ServiceIcon } from '../components/ServiceIcon';

// Service images are stored under src/assets/images/services so Vite bundles them correctly.
import acupunctureImg from '../assets/images/services/acupuncture.png';
import herbalMedicineImg from '../assets/images/services/herbal-medicine.png';
import hijamaCuppingImg from '../assets/images/services/hijama-cupping.png';
import earAcupunctureImg from '../assets/images/services/ear-acupuncture-microsystem.png';
import neuroMeridianImg from '../assets/images/services/neuro-meridian-acupuncture.png';
import neuroScalpImg from '../assets/images/services/neuro-acupuncture-scalp-acupuncture.png';
import japaneseAcupunctureImg from '../assets/images/services/japanese-acupuncture.png';
import persianMedicineImg from '../assets/images/services/traditional-persian-medicine.png';
import nonInsertionImg from '../assets/images/services/non-insertion-needling.png';
import combinationTherapyImg from '../assets/images/services/combination-therapy.png';

// Services migrated from the original AcuMeD HTML site. Images are imported from src/assets/images/services so Vite can bundle them.
const SERVICES = [
  {
    id: 'acupuncture',
    iconId: 'acupuncture',
    title: 'Acupuncture',
    description: 'Stimulate your body\'s natural healing by targeting specific meridian points. Effective for pain relief, stress, infertility, and systemic conditions.',
    image: acupunctureImg,
  },
  {
    id: 'herbal-medicine',
    iconId: 'herbs',
    title: 'Herbal Medicine',
    description: 'Herbal medicine has been used for centuries to support health, restore balance, and promote the body\'s natural healing processes.',
    image: herbalMedicineImg,
  },
  {
    id: 'hijama-cupping',
    iconId: 'cupping',
    title: 'Hijama / Cupping',
    description: 'An ancient therapeutic technique using suction cups to improve blood circulation, release muscle tension, and clear toxins from the body.',
    image: hijamaCuppingImg,
  },
  {
    id: 'ear-acupuncture-microsystem',
    iconId: 'microsystem',
    title: 'Ear Acupuncture (Microsystem)',
    description: 'A specialized technique where the entire body is mapped on the ear. Precise needling of ear points treats systemic conditions through the body\'s microsystem.',
    image: earAcupunctureImg,
  },
  {
    id: 'neuro-meridian-acupuncture',
    iconId: 'movingqi',
    title: 'Neuro Meridian Acupuncture',
    description: 'A refined, ultra-gentle style of acupuncture focused on moving and balancing Qi. Uses thinner needles and palpation-based diagnosis for precision care.',
    image: neuroMeridianImg,
  },
  {
    id: 'neuro-acupuncture-scalp-acupuncture',
    iconId: 'neroscalp',
    title: 'Neuro-Acupuncture (Scalp Acupuncture)',
    description: 'Neuro-acupuncture, also known as scalp acupuncture, is an advanced treatment approach that combines traditional acupuncture principles with modern neuroscience.',
    image: neuroScalpImg,
  },
  {
    id: 'japanese-acupuncture',
    iconId: 'movingqi',
    title: 'Japanese Acupuncture',
    description: 'A refined, ultra-gentle style of acupuncture focused on moving and balancing Qi. Uses thinner needles and palpation-based diagnosis for precision care.',
    image: japaneseAcupunctureImg,
  },
  {
    id: 'traditional-persian-medicine',
    iconId: 'avicenna',
    title: 'Traditional Persian Medicine',
    description: 'Rooted in Avicenna\'s Canon of Medicine, this ancient system uses diet, herbal remedies, and lifestyle medicine to restore harmony between mind, body, and spirit.',
    image: persianMedicineImg,
  },
  {
    id: 'non-insertion-needling',
    iconId: 'moxibustion',
    title: 'Non-insertion needling',
    description: '(Non-insertion needling (also called contact needling) is an acupuncture technique in which the practitioner uses an acupuncture needle or a blunt metal tool to touch, tap, stroke, press, or lightly stimulate the acupoint without penetrating the skin.',
    image: nonInsertionImg,
  },
  {
    id: 'combination-therapy',
    iconId: 'combination',
    title: 'Combination Therapy',
    description: 'Synergistic treatment plans combining acupuncture and herbal medicine for enhanced, faster, and longer-lasting therapeutic outcomes.',
    image: combinationTherapyImg,
  },
] as const;

export function Home() {
  const triggerAiWithPrompt = (prompt: string) => {
    window.dispatchEvent(new CustomEvent('open-ai-chat', { detail: { prompt } }));
  };

  const openAiChat = () => {
    window.dispatchEvent(new CustomEvent('open-ai-chat'));
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden bg-teal-50/50">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-teal-600/5 clip-path-hero hidden lg:block" />
          <img
            src={IMAGES.hero}
            alt="Wellness Background"
            className="absolute top-0 right-0 w-1/2 h-full object-cover opacity-20 hidden lg:block clip-path-hero"
            referrerPolicy="no-referrer"
          />
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-teal-200/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-teal-300/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-2 bg-white border border-teal-100 px-4 py-2 rounded-full shadow-sm">
                <span className="flex h-2 w-2 rounded-full bg-teal-500 animate-ping" />
                <span className="text-xs font-bold text-teal-800 uppercase tracking-widest">Accepting New Patients</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 leading-[1.1] tracking-tight">
                Heal Naturally. <br />
                <span className="text-teal-600 italic font-serif">Live Fully.</span>
              </h1>
              <p className="text-lg text-gray-600 max-w-lg leading-relaxed">
                Experience the power of integrative medicine with Dr. Mostafa Medhati — combining ancient wisdom with modern science to restore your health and vitality in Watertown, MA.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/book"
                  className="inline-flex items-center justify-center gap-2 bg-teal-600 text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-teal-700 transition-all shadow-xl shadow-teal-600/20 active:scale-95"
                >
                  <Calendar className="w-5 h-5" />
                  Book Appointment
                </Link>
                <a
                  href="#about"
                  className="inline-flex items-center justify-center gap-2 bg-white text-teal-800 border-2 border-teal-200 hover:border-teal-600 px-7 py-4 rounded-full text-base font-bold shadow-sm hover:shadow-md transition-all active:scale-95"
                >
                  <span>Meet Dr. Medhati</span>
                  <ArrowRight className="w-4 h-4 text-teal-600" />
                </a>
              </div>
              <div className="flex items-center gap-8 pt-4 border-t border-gray-100">
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-gray-900">20+</span>
                  <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Years Exp.</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-gray-900">5k+</span>
                  <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Patients Helped</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-gray-900">5.0</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Google Rating</span>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              {/* Doctor Showcase Card with Original High-Resolution Photo */}
              <div className="relative z-10 rounded-[2.5rem] overflow-hidden shadow-2xl border-4 sm:border-8 border-white bg-slate-900 aspect-[4/3] sm:aspect-[16/12] group">
                <img
                  src={IMAGES.drMedhati}
                  alt="Dr. Mostafa Medhati, L.Ac - AcuMeD Clinic"
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                
                {/* Subtle Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />
                
                {/* Doctor Bio Overlay Box */}
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <div className="inline-flex items-center gap-1.5 bg-teal-600/90 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider text-teal-100 mb-2 border border-teal-400/30">
                    <Award className="w-3.5 h-3.5 text-teal-200" />
                    <span>Lead Acupuncturist & Herbalist</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    Dr. Mostafa Medhati, L.Ac
                  </h3>
                  <p className="text-xs sm:text-sm text-teal-100/90 mt-0.5 font-medium">
                    MD (Iran) · Lic.Ac · MAOM · Dipl. Ac (NCCAOM)
                  </p>
                </div>

                {/* Floating Experience Badge */}
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-lg border border-teal-100/80 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-sm">
                    20+
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] font-bold text-gray-400 uppercase leading-none">Clinical</p>
                    <p className="text-xs font-extrabold text-teal-900 leading-tight">Expertise</p>
                  </div>
                </div>
              </div>

              {/* Clean Trust Strip Below Doctor Photo */}
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="bg-white/80 backdrop-blur-sm p-3.5 rounded-2xl border border-teal-100/60 shadow-sm flex items-center gap-3">
                  <div className="w-9 h-9 bg-teal-50 text-teal-700 rounded-xl flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5 text-teal-600" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900">100% Sterile & Gentle</p>
                    <p className="text-[11px] text-gray-500">Painless Ultra-Fine Needles</p>
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm p-3.5 rounded-2xl border border-teal-100/60 shadow-sm flex items-center gap-3">
                  <div className="w-9 h-9 bg-teal-50 text-teal-700 rounded-xl flex items-center justify-center shrink-0">
                    <CheckCircle className="w-5 h-5 text-teal-600" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900">Private Suites</p>
                    <p className="text-[11px] text-gray-500">Tranquil Healing Space</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-sm font-bold text-teal-600 uppercase tracking-[0.2em] mb-4">What We Offer</h2>
            <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Holistic Healing Services</h3>
            <p className="text-lg text-gray-600">
              Each treatment is personalized to your unique health needs, combining centuries-old wisdom with evidence-informed modern practice.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {SERVICES.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer border border-gray-100"
              >
                <div className="aspect-video relative overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute bottom-4 left-4 right-4 translate-y-2 group-hover:translate-y-0 transition-transform duration-500 flex items-center justify-between">
                    <div className="w-12 h-12 bg-white/95 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-lg border border-white/60">
                      <ServiceIcon serviceId={service.iconId} className="w-10 h-10 rounded-xl" iconClassName="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold bg-white/90 backdrop-blur-md text-teal-900 px-3 py-1.5 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                      Holistic Care
                    </span>
                  </div>
                </div>
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-3">
                    <ServiceIcon serviceId={service.iconId} className="w-7 h-7 rounded-lg shrink-0" iconClassName="w-3.5 h-3.5" />
                    <h4 className="text-xl font-bold text-gray-900 group-hover:text-teal-600 transition-colors">{service.title}</h4>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    {service.description}
                  </p>
                  <div className="mt-8 flex items-center gap-2 text-teal-600 font-bold">
                    <span>Learn More</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Voice & Chat Patient Assistant Spotlight */}
      <section className="py-20 bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2.5 bg-teal-800/70 border border-teal-500/30 pl-2 pr-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-teal-200">
                <div className="w-5 h-5 rounded-full overflow-hidden border border-teal-300 shrink-0">
                  <img
                    src={IMAGES.aiAvatar}
                    alt="Care Guide"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span>24/7 Holistic Care Guide & Voice Assistant</span>
              </div>
              <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-white leading-tight">
                Have questions before your visit? <br />
                <span className="text-teal-400">Ask or speak with our friendly Care Guide.</span>
              </h3>
              <p className="text-teal-100/90 text-base leading-relaxed max-w-xl">
                Get instant, personalized answers about Dr. Medhati's acupuncture techniques, custom herbal therapies, pain management for sciatica, fertility IVF support, session pricing, and what to expect on your first visit.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={openAiChat}
                  className="inline-flex items-center gap-2.5 bg-teal-500 hover:bg-teal-400 text-teal-950 font-bold px-7 py-3.5 rounded-full text-sm transition-all shadow-lg shadow-teal-500/20 active:scale-95 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Start Chat Consultation</span>
                </button>

                <button
                  onClick={openAiChat}
                  className="inline-flex items-center gap-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-6 py-3.5 rounded-full text-sm transition-all active:scale-95 cursor-pointer"
                >
                  <Mic className="w-4 h-4 text-teal-300 animate-pulse" />
                  <span>Speak by Voice</span>
                </button>
              </div>
            </div>

            {/* Quick Interactive Questions Showcase with Avatar Card */}
            <div className="lg:col-span-5 bg-white/10 backdrop-blur-xl border border-white/15 rounded-3xl p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-teal-300/80 shadow-sm shrink-0">
                    <img
                      src={IMAGES.aiAvatar}
                      alt="Care Guide"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">AcuMeD Care Guide</h4>
                    <p className="text-[11px] text-teal-300">Tap any question to ask</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold bg-emerald-950/50 border border-emerald-500/30 px-2.5 py-1 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>Online</span>
                </div>
              </div>

              <div className="space-y-2.5">
                {[
                  { q: 'Does acupuncture hurt?', tag: 'FAQ' },
                  { q: 'How does Dr. Medhati treat sciatica and back pain?', tag: 'Pain' },
                  { q: 'Can acupuncture support my IVF fertility cycle?', tag: 'Fertility' },
                  { q: 'What is the cost and insurance process?', tag: 'Pricing' },
                  { q: 'How do I prepare for my first acupuncture appointment?', tag: 'Prep' },
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => triggerAiWithPrompt(item.q)}
                    className="w-full text-left bg-white/5 hover:bg-white/15 border border-white/10 hover:border-teal-400/50 p-3 rounded-2xl transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <span className="text-xs sm:text-sm text-gray-200 group-hover:text-white font-medium pr-2">
                      "{item.q}"
                    </span>
                    <span className="text-[10px] uppercase font-bold bg-teal-700/60 text-teal-200 px-2 py-0.5 rounded-md shrink-0">
                      {item.tag}
                    </span>
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-32 bg-teal-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="relative">
              <div className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl">
                <img
                  src={IMAGES.drMedhati}
                  alt="Dr. Medhati at work"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-10 -right-10 bg-white p-8 rounded-3xl shadow-2xl border border-teal-50 hidden md:block">
                <p className="text-4xl font-bold text-teal-600 mb-1">20+</p>
                <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Years of Clinical Practice</p>
              </div>
            </div>

            <div className="space-y-8">
              <h2 className="text-sm font-bold text-teal-600 uppercase tracking-[0.2em]">Your Practitioner</h2>
              <h3 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                Dr. Mostafa Medhati
                <span className="block text-xl font-medium text-teal-600 mt-2">PhD, MD, Lic.Ac, MAOM</span>
              </h3>
              <div className="bg-teal-600/5 border-l-4 border-teal-600 p-6 rounded-r-2xl italic text-lg text-teal-900 font-serif">
                "My mission is to help every patient unlock their body's innate power to heal — through a personalized journey that honors the whole person."
              </div>
              <p className="text-gray-600 leading-relaxed text-lg">
                Dr. Medhati brings a rare integration of Western medical training with deep expertise in Traditional Chinese Medicine, Persian healing traditions inspired by Avicenna, and Japanese acupuncture systems.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  'PhD — Biomedical Sciences',
                  'MD — Medical Doctor',
                  'Lic.Ac — Licensed Acupuncturist',
                  'MAOM — Oriental Medicine',
                  'TCM Practitioner',
                  'Japanese Acupuncture (JAS)'
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-teal-500" />
                    <span className="text-sm font-semibold text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
              <div className="pt-6">
                <Link
                  to="/book"
                  className="inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-full font-bold hover:bg-gray-800 transition-all active:scale-95"
                >
                  Book a Consultation
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Patient Reviews & Testimonials Section */}
      <Testimonials />

      {/* Contact & Location Section */}
      <section id="contact" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            <div className="space-y-12">
              <div>
                <h2 className="text-sm font-bold text-teal-600 uppercase tracking-[0.2em] mb-4">Find Us</h2>
                <h3 className="text-4xl font-bold text-gray-900 mb-6">Location & Office Hours</h3>
                <p className="text-gray-600 text-lg">
                  Conveniently located in Watertown, MA, our clinic provides a peaceful sanctuary for your healing journey.
                </p>
              </div>

              <div className="space-y-8">
                <div className="flex gap-6">
                  <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600 shrink-0">
                    <MapPin className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-2">Address</h4>
                    <p className="text-gray-600 leading-relaxed">
                      {CLINIC_INFO.address}
                    </p>
                    <a href="https://maps.google.com/?q=124+Watertown+St+Watertown+MA" target="_blank" rel="noopener" className="text-teal-600 font-bold text-sm mt-2 inline-block hover:underline">
                      Get Directions →
                    </a>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600 shrink-0">
                    <Clock className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-2">Office Hours</h4>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-sm text-gray-600">
                      {Object.entries(CLINIC_INFO.hours).map(([day, hours]) => (
                        <div key={day} className="contents">
                          <span className="font-bold text-gray-900">{day}</span>
                          <span>{hours}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600 shrink-0">
                    <Phone className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-2">Contact</h4>
                    <p className="text-gray-600">{CLINIC_INFO.phone}</p>
                    <p className="text-gray-600">{CLINIC_INFO.email}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white h-[600px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2949.1!2d-71.183!3d42.364!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89e377!2s124+Watertown+St+Watertown+MA!5e0!3m2!1sen!2sus!4v1"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="AcuMeD Clinic location map"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={IMAGES.clinic}
            alt="Clinic Interior"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-teal-900/90 backdrop-blur-sm" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-8">Ready to start your healing journey?</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/book"
              className="bg-white text-teal-600 px-10 py-5 rounded-full text-xl font-bold hover:bg-teal-50 transition-all active:scale-95 shadow-2xl"
            >
              Book Your Appointment
            </Link>
            <a
              href={`tel:${CLINIC_INFO.phone}`}
              className="bg-teal-700 text-white border-2 border-teal-500 px-10 py-5 rounded-full text-xl font-bold hover:bg-teal-800 transition-all active:scale-95"
            >
              Call Us: {CLINIC_INFO.phone}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}