import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Calendar,
  CheckCircle,
  Clock,
  HeartPulse,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Star,
} from 'lucide-react';
import { CLINIC_INFO, IMAGES } from '../constants';
import { ServiceIcon } from '../components/ServiceIcon';

// Service images migrated from the attached AcuMeD HTML.
// Keep these files under src/assets/images/services/.
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

const SERVICES = [
  {
    id: 'acupuncture',
    iconId: 'acupuncture',
    title: 'Acupuncture',
    description:
      "Stimulate your body's natural healing by targeting specific meridian points. Effective for pain relief, stress, infertility, and systemic conditions.",
    image: acupunctureImg,
  },
  {
    id: 'herbal-medicine',
    iconId: 'herbs',
    title: 'Herbal Medicine',
    description:
      "Herbal medicine has been used for centuries to support health, restore balance, and promote the body's natural healing processes.",
    image: herbalMedicineImg,
  },
  {
    id: 'hijama-cupping',
    iconId: 'cupping',
    title: 'Hijama / Cupping',
    description:
      'An ancient therapeutic technique using suction cups to improve blood circulation, release muscle tension, and clear toxins from the body.',
    image: hijamaCuppingImg,
  },
  {
    id: 'ear-acupuncture-microsystem',
    iconId: 'microsystem',
    title: 'Ear Acupuncture (Microsystem)',
    description:
      "A specialized technique where the entire body is mapped on the ear. Precise needling of ear points treats systemic conditions through the body's microsystem.",
    image: earAcupunctureImg,
  },
  {
    id: 'neuro-meridian-acupuncture',
    iconId: 'movingqi',
    title: 'Neuro Meridian Acupuncture',
    description:
      'A refined, ultra-gentle style of acupuncture focused on moving and balancing Qi. Uses thinner needles and palpation-based diagnosis for precision care.',
    image: neuroMeridianImg,
  },
  {
    id: 'neuro-acupuncture-scalp-acupuncture',
    iconId: 'neroscalp',
    title: 'Neuro-Acupuncture (Scalp Acupuncture)',
    description:
      'Neuro-acupuncture, also known as scalp acupuncture, is an advanced treatment approach that combines traditional acupuncture principles with modern neuroscience.',
    image: neuroScalpImg,
  },
  {
    id: 'japanese-acupuncture',
    iconId: 'movingqi',
    title: 'Japanese Acupuncture',
    description:
      'A refined, ultra-gentle style of acupuncture focused on moving and balancing Qi. Uses thinner needles and palpation-based diagnosis for precision care.',
    image: japaneseAcupunctureImg,
  },
  {
    id: 'traditional-persian-medicine',
    iconId: 'avicenna',
    title: 'Traditional Persian Medicine',
    description:
      "Rooted in Avicenna's Canon of Medicine, this ancient system uses diet, herbal remedies, and lifestyle medicine to restore harmony between mind, body, and spirit.",
    image: persianMedicineImg,
  },
  {
    id: 'non-insertion-needling',
    iconId: 'moxibustion',
    title: 'Non-insertion Needling',
    description:
      'Also called contact needling, this gentle technique touches, taps, strokes, presses, or lightly stimulates acupuncture points without penetrating the skin.',
    image: nonInsertionImg,
  },
  {
    id: 'combination-therapy',
    iconId: 'combination',
    title: 'Combination Therapy',
    description:
      'Synergistic treatment plans combining acupuncture and herbal medicine for enhanced, faster, and longer-lasting therapeutic outcomes.',
    image: combinationTherapyImg,
  },
] as const;

const CONDITIONS = [
  'Chronic Pain',
  'Back & Neck Pain',
  'Headaches & Migraines',
  'Infertility & IVF Support',
  'Mens Issue',
  'PMS & Menstrual Disorders',
  'Anxiety & Stress',
  'Depression & Fatigue',
  'Low Mood',
  'Neuropathy',
  'Shoulder Disorder',
  'Insomnia & Sleep Issues',
  'Gastrointestinal (GI) / Digestive Disorders',
  'Arthritis & Joint Pain',
  'Fibromyalgia',
  'Allergies & Sinusitis',
  'Immune System Support',
  'Post-Stroke Recovery',
  'Sports Injuries',
  'Carpal Tunnel Syndrome',
  'Sciatica',
  'Thyroid Disorders',
  'Skin Conditions',
  'Weight Management',
  'Smoking Cessation',
  'High Blood Pressure',
  'Respiratory Conditions',
] as const;

const TESTIMONIALS = [
  {
    quote:
      "After years of chronic back pain and failed conventional treatments, Dr. Medhati's acupuncture sessions gave me my life back. Within 6 visits I felt a dramatic improvement.",
    initials: 'SR',
    name: 'Sarah R.',
    detail: 'Chronic Back Pain · Watertown, MA',
  },
  {
    quote:
      'Dr. Medhati helped me through our IVF journey with acupuncture and herbal support. His holistic approach made all the difference — we now have a healthy baby boy!',
    initials: 'LP',
    name: 'Lisa P.',
    detail: 'Infertility Support · Boston, MA',
  },
  {
    quote:
      'I was skeptical at first, but the millimeter wave therapy combined with acupuncture completely resolved my migraines. The booking process was also very easy and convenient.',
    initials: 'MK',
    name: 'Michael K.',
    detail: 'Migraines · Newton, MA',
  },
] as const;

const FAQS = [
  {
    question: 'Does acupuncture hurt?',
    answer:
      'Most patients experience minimal to no discomfort. Acupuncture needles are ultra-thin — about the width of a human hair. You may feel warmth, tingling, or heaviness, and many patients relax deeply or fall asleep during treatment.',
  },
  {
    question: 'How should I prepare for my appointment?',
    answer:
      'Eat a light meal 1–2 hours before your visit, wear loose comfortable clothing, avoid caffeine and alcohol, bring a list of medications or supplements, and arrive about 10 minutes early for your first visit.',
  },
  {
    question: 'How many sessions will I need?',
    answer:
      'It varies by condition and severity. Acute conditions may resolve in 4–6 sessions, while chronic conditions may require 8–12 or more. Dr. Medhati creates a personalized treatment plan and reassesses progress regularly.',
  },
  {
    question: 'What should I know before a Hijama/Cupping session?',
    answer:
      'Fast for 2–3 hours beforehand, avoid heavy exercise for 24 hours, and wear loose clothing. After treatment, avoid cold water and heavy meals for a few hours. Circular marks are normal and usually fade within a few days.',
  },
  {
    question: 'What is Neuro Acupuncture or Scalp Acupuncture?',
    answer:
      'Neuro-acupuncture is a specialized technique that integrates traditional Chinese needling with modern knowledge of neurology, neuroscience, and neuroplasticity. Specific scalp areas are stimulated to support central nervous system conditions.',
  },
  {
    question: 'What is Chinese Acupuncture?',
    answer:
      'Chinese acupuncture is a key part of Traditional Chinese Medicine. Thin sterile needles are inserted at specific points to influence the flow of qi along meridians and stimulate the nervous system.',
  },
  {
    question: 'Do you accept insurance?',
    answer:
      'We accept several major insurance plans. Please call the clinic to verify your specific coverage. Self-pay options are also available.',
  },
  {
    question: 'Can acupuncture help with infertility?',
    answer:
      'Acupuncture may support reproductive health by improving circulation, helping regulate hormonal balance, reducing stress, and complementing IVF protocols. Dr. Medhati has experience with fertility-focused acupuncture.',
  },
  {
    question: 'What is Japanese Acupuncture and how is it different?',
    answer:
      'Japanese Acupuncture Style uses finer needles, lighter stimulation, and detailed palpation-based diagnosis. It is often preferred by patients who are sensitive or anxious about needles.',
  },
] as const;

const INSURANCE = [
  'Blue Cross Blue Shield',
  'Car Accident Insurance',
  'Whole Health Plan',
  'Aetna',
  'United Healthcare',
  'Harvard Pilgrim',
  'Mass General Brigham',
  'Tufts Health Plan',
  'Mass Health',
  'Self-Pay Available',
] as const;

const BOOKING_STEPS = [
  ['1', 'Choose Your Service', 'Tap any service to instantly proceed'],
  ['2', 'Pick a Date & Time', 'View real-time availability'],
  ['3', 'Enter Your Details', 'Quick form — just the essentials'],
  ['4', 'Confirm & Get Email', 'Instant confirmation sent to you and Dr. Medhati'],
] as const;

export function Home() {
  return (
    <div className="flex flex-col bg-white">
      {/* HERO */}
      <section
        id="hero"
        className="relative min-h-[calc(100vh-5rem)] flex items-center overflow-hidden bg-gradient-to-br from-teal-50 via-emerald-50 to-white"
      >
        <div className="absolute inset-0 pointer-events-none">
          <img
            src={IMAGES.hero}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover opacity-[0.08]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/70 to-teal-50/70" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr] gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="bg-white/85 backdrop-blur-xl border border-white rounded-[2rem] shadow-xl shadow-teal-900/5 p-7 sm:p-10 lg:p-12"
            >
              <div className="inline-flex items-center gap-2 bg-white border border-teal-200 px-4 py-2 rounded-full text-sm font-semibold text-teal-800 mb-7">
                <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
                Accepting New Patients · Watertown, MA
              </div>

              <h1 className="text-5xl md:text-6xl xl:text-7xl font-bold tracking-tight text-gray-900 leading-[1.04]">
                Heal Naturally.
                <span className="block text-teal-600 font-serif italic">Live Fully.</span>
              </h1>

              <p className="mt-6 text-lg sm:text-xl text-gray-600 leading-relaxed max-w-2xl">
                Experience the power of integrative medicine with Dr. Mostafa Medhati — combining ancient wisdom with modern science to restore your health and vitality.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link
                  to="/book"
                  className="inline-flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-7 py-4 rounded-full font-bold shadow-lg shadow-teal-600/20 transition-all active:scale-95"
                >
                  <Calendar className="w-5 h-5" />
                  Book Appointment
                </Link>
                <a
                  href="#services"
                  className="inline-flex items-center justify-center gap-2 border-2 border-teal-600 text-teal-700 hover:bg-teal-50 px-7 py-4 rounded-full font-bold transition-all"
                >
                  Explore Services
                  <ArrowRight className="w-5 h-5" />
                </a>
              </div>

              <div className="mt-9 pt-7 border-t border-teal-100 grid grid-cols-3 gap-4">
                {[
                  ['20+', 'Years Experience'],
                  ['5,000+', 'Patients Helped'],
                  ['8', 'Therapies Offered'],
                ].map(([value, label]) => (
                  <div key={label}>
                    <p className="text-2xl sm:text-3xl font-bold text-teal-600">{value}</p>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">{label}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="relative"
            >
              <div className="bg-white rounded-[2rem] shadow-2xl shadow-teal-900/10 overflow-hidden border border-teal-100">
                <div className="aspect-[4/4.2] sm:aspect-[4/3.7] overflow-hidden">
                  <img
                    src={IMAGES.drMedhati}
                    alt="Dr. Mostafa Medhati"
                    className="w-full h-full object-cover object-top"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-7 text-center">
                  <h2 className="text-2xl font-bold text-gray-900">Dr. Mostafa Medhati</h2>
                  <p className="text-teal-600 font-semibold mt-1">PhD, MD, Lic.Ac, MAOM</p>
                  <div className="flex flex-wrap justify-center gap-2 mt-5">
                    {['Acupuncture', 'Herbal Medicine', 'Holistic MD'].map((item) => (
                      <span key={item} className="bg-teal-50 text-teal-800 px-3 py-1.5 rounded-full text-xs font-bold">
                        {item}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 mt-5">
                    124 Watertown St, Suite #3A<br />
                    Watertown, MA 02472
                  </p>
                </div>
              </div>

              {/* Trust cards are placed below the doctor card instead of absolutely
                  positioning them over the photo/content. This keeps them responsive
                  and prevents overlap at desktop and intermediate screen widths. */}
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-white border border-teal-100 shadow-lg rounded-2xl px-4 py-3 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
                    <Star className="w-5 h-5 fill-current" />
                  </div>
                  <span className="text-sm font-bold text-gray-800 leading-snug">
                    Top Rated in Watertown Area
                  </span>
                </div>

                <div className="bg-white border border-teal-100 shadow-lg rounded-2xl px-4 py-3 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                    <HeartPulse className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800">Holistic & Natural</p>
                    <p className="text-xs text-gray-500">Mind · Body · Spirit</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* BOOKING */}
      <section id="book" className="py-24 bg-teal-600 relative overflow-hidden">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-white/5" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="text-white">
              <span className="inline-flex px-4 py-2 rounded-full bg-white/10 text-teal-50 text-xs font-bold uppercase tracking-[0.18em]">
                Easy Scheduling
              </span>
              <h2 className="text-4xl md:text-5xl font-bold mt-5">Book Your Healing Journey in Minutes</h2>
              <p className="text-teal-50/90 text-lg mt-5 leading-relaxed">
                Select your treatment, choose a time that works for you, and confirm — all in one seamless experience.
              </p>

              <div className="mt-9 space-y-5">
                {BOOKING_STEPS.map(([num, title, desc]) => (
                  <div key={num} className="flex gap-4">
                    <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center font-bold shrink-0">
                      {num}
                    </div>
                    <div>
                      <p className="font-bold text-white">{title}</p>
                      <p className="text-sm text-teal-50/75">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-4 text-sm font-semibold">
                <a href={`tel:${CLINIC_INFO.phone}`} className="inline-flex items-center gap-2 text-white">
                  <Phone className="w-4 h-4" />
                  {CLINIC_INFO.phone}
                </a>
                <span className="text-white/50">•</span>
                <span className="text-white">(857) 928-7678</span>
              </div>
            </div>

            <div className="bg-white rounded-[2rem] shadow-2xl p-7 sm:p-9">
              <div className="mb-7">
                <h3 className="text-2xl font-bold text-gray-900">Schedule Your Visit</h3>
                <p className="text-gray-500 mt-1">Choose a service to continue to the appointment calendar.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  ['Initial Acupuncture', '60 min'],
                  ['Follow-up Acupuncture', '30 min'],
                  ['Herbal Medicine', '45 min'],
                  ['Cupping / Hijama', '45 min'],
                ].map(([service, duration]) => (
                  <Link
                    key={service}
                    to="/book"
                    className="text-left border-2 border-gray-100 hover:border-teal-300 hover:bg-teal-50 rounded-2xl p-4 transition-all group"
                  >
                    <p className="font-bold text-gray-900 group-hover:text-teal-700">{service}</p>
                    <p className="text-sm text-gray-400 mt-1">{duration}</p>
                  </Link>
                ))}
              </div>

              <Link
                to="/book"
                className="mt-6 w-full inline-flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white py-4 rounded-xl font-bold transition-all"
              >
                Continue to Booking
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="py-24 lg:py-28 bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="inline-flex bg-teal-50 text-teal-700 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-[0.18em]">
              What We Offer
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-5">Holistic Healing Services</h2>
            <p className="text-lg text-gray-600 mt-5">
              Each treatment is personalized to your unique health needs, combining centuries-old wisdom with evidence-informed modern practice.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {SERVICES.map((service, index) => (
              <motion.article
                key={service.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ delay: Math.min(index * 0.05, 0.3) }}
                className="group rounded-3xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all"
              >
                <div className="aspect-[16/10] overflow-hidden relative">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute bottom-4 left-4 w-11 h-11 rounded-xl bg-white/95 shadow-lg flex items-center justify-center">
                    <ServiceIcon serviceId={service.iconId} className="w-9 h-9 rounded-lg" iconClassName="w-4 h-4" />
                  </div>
                </div>
                <div className="p-7">
                  <h3 className="text-xl font-bold text-gray-900">{service.title}</h3>
                  <p className="text-gray-600 leading-relaxed mt-3">{service.description}</p>
                  <Link to="/book" className="inline-flex items-center gap-2 text-teal-600 font-bold mt-6">
                    Learn More
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-24 lg:py-28 bg-teal-50/60 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">
            <div className="relative">
              <div className="rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white aspect-[4/5]">
                <img
                  src={IMAGES.drMedhati}
                  alt="Dr. Mostafa Medhati"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="absolute -bottom-7 right-4 sm:-right-7 bg-white rounded-2xl shadow-xl px-7 py-5 border border-teal-100">
                <p className="text-3xl font-bold text-teal-600">20+</p>
                <p className="text-xs uppercase tracking-wider text-gray-500 font-bold">Years of Clinical Practice</p>
              </div>
            </div>

            <div>
              <span className="inline-flex bg-white text-teal-700 border border-teal-100 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-[0.18em]">
                Your Practitioner
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-5">Dr. Mostafa Medhati</h2>

              <blockquote className="mt-6 bg-white/80 border-l-4 border-teal-600 rounded-r-2xl p-6 text-lg text-teal-900 font-serif italic">
                “My mission is to help every patient unlock their body's innate power to heal — through a personalized journey that honors the whole person.”
              </blockquote>

              <p className="mt-6 text-gray-600 text-lg leading-relaxed">
                Dr. Medhati holds a PhD and MD alongside his Master of Acupuncture and Oriental Medicine (MAOM) and Licensed Acupuncturist (Lic.Ac) credentials. He brings a rare integration of Western medical training with Traditional Chinese Medicine, Persian healing traditions inspired by Avicenna, and Japanese acupuncture systems.
              </p>

              <p className="mt-4 text-gray-600 leading-relaxed">
                His approach treats every patient as a whole — addressing root causes rather than just symptoms — through a combination of acupuncture, herbal medicine, and counseling in every session.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-7">
                {[
                  'PhD — Biomedical Sciences',
                  'MD — Medical Doctor',
                  'Lic.Ac — Licensed Acupuncturist',
                  'MAOM — Oriental Medicine',
                  'TCM Practitioner',
                  'Japanese Acupuncture (JAS)',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-teal-500 shrink-0" />
                    <span className="text-sm font-semibold text-gray-700">{item}</span>
                  </div>
                ))}
              </div>

              <Link
                to="/book"
                className="mt-8 inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-7 py-4 rounded-full font-bold"
              >
                Book a Consultation
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CONDITIONS */}
      <section id="conditions" className="py-24 lg:py-28 bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-flex bg-teal-50 text-teal-700 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-[0.18em]">
              We Can Help With
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-5">Conditions We Treat</h2>
            <p className="text-lg text-gray-600 mt-5">
              Acupuncture and holistic medicine can be used to support care for a wide range of health conditions.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {CONDITIONS.map((condition) => (
              <div
                key={condition}
                className="flex items-center gap-3 bg-gray-50 hover:bg-teal-50 border border-gray-100 hover:border-teal-100 rounded-xl px-4 py-3 transition-colors"
              >
                <CheckCircle className="w-4 h-4 text-teal-500 shrink-0" />
                <span className="text-sm font-semibold text-gray-700">{condition}</span>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              to="/book"
              className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-7 py-4 rounded-full font-bold"
            >
              Book a Consultation — We Can Help
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="py-24 lg:py-28 bg-slate-950 text-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-flex bg-white/10 text-teal-300 border border-white/10 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-[0.18em]">
              Patient Stories
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mt-5">Real Healing, Real Results</h2>
          </div>

          <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {TESTIMONIALS.map((item) => (
              <article key={item.name} className="bg-white/5 border border-white/10 rounded-3xl p-7 sm:p-8">
                <div className="flex gap-1 text-amber-400">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star key={idx} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="mt-6 text-gray-200 leading-relaxed">“{item.quote}”</p>
                <div className="mt-7 flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-teal-600 flex items-center justify-center font-bold">
                    {item.initials}
                  </div>
                  <div>
                    <p className="font-bold text-white">{item.name}</p>
                    <p className="text-xs text-gray-400 mt-1">{item.detail}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 lg:py-28 bg-white scroll-mt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="inline-flex bg-teal-50 text-teal-700 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-[0.18em]">
              Common Questions
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-5">Frequently Asked Questions</h2>
          </div>

          <div className="mt-12 space-y-3">
            {FAQS.map((item) => (
              <details
                key={item.question}
                className="group border border-gray-200 rounded-2xl bg-white overflow-hidden shadow-sm"
              >
                <summary className="list-none cursor-pointer flex items-center justify-between gap-4 px-5 sm:px-6 py-5 font-bold text-gray-900">
                  <span>{item.question}</span>
                  <span className="w-8 h-8 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center text-xl group-open:rotate-45 transition-transform">
                    +
                  </span>
                </summary>
                <div className="px-5 sm:px-6 pb-6 text-gray-600 leading-relaxed">
                  {item.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* INSURANCE */}
      <section id="insurance" className="py-24 lg:py-28 bg-teal-50/60 scroll-mt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-flex bg-white text-teal-700 border border-teal-100 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-[0.18em]">
              Coverage & Payments
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-5">Insurance & Payment Options</h2>
            <p className="text-lg text-gray-600 mt-5">
              We work with many insurance providers and offer flexible payment options to help make care accessible.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {INSURANCE.map((provider) => (
              <div
                key={provider}
                className="bg-white border border-teal-100 rounded-2xl px-4 py-5 text-center shadow-sm"
              >
                <ShieldCheck className="w-6 h-6 text-teal-600 mx-auto" />
                <p className="text-sm font-bold text-gray-800 mt-3">{provider}</p>
              </div>
            ))}
          </div>

          <div className="mt-9 bg-white border border-teal-100 rounded-2xl p-6 text-center">
            <p className="font-bold text-gray-900">Not sure about your coverage?</p>
            <p className="text-gray-600 mt-2">
              Call us to verify: <a className="text-teal-700 font-bold" href={`tel:${CLINIC_INFO.phone}`}>{CLINIC_INFO.phone}</a>
              {' '}or email:{' '}
              <a className="text-teal-700 font-bold" href="mailto:mostafmed@acumedm.com">mostafmed@acumedm.com</a>
            </p>
          </div>
        </div>
      </section>

      {/* LOCATION */}
      <section id="location" className="py-24 lg:py-28 bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            <div>
              <span className="inline-flex bg-teal-50 text-teal-700 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-[0.18em]">
                Find Us
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-5">Location & Office Hours</h2>

              <div className="mt-10 space-y-7">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Address</h3>
                    <p className="text-gray-600 mt-1">
                      124 Watertown St, Suite #3A<br />
                      Watertown, MA 02472
                    </p>
                    <a
                      href="https://maps.google.com/?q=124+Watertown+St+Watertown+MA"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-teal-600 font-bold text-sm mt-2"
                    >
                      Get Directions
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Office Hours</h3>
                    <div className="text-gray-600 mt-2 space-y-1">
                      <p><strong className="text-gray-800">Monday – Friday:</strong> 9:00 AM – 6:00 PM</p>
                      <p><strong className="text-gray-800">Saturday:</strong> 9:00 AM – 2:00 PM</p>
                      <p><strong className="text-gray-800">Sunday:</strong> Closed</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Contact</h3>
                    <div className="text-gray-600 mt-2 space-y-1">
                      <p><a href={`tel:${CLINIC_INFO.phone}`} className="hover:text-teal-600">{CLINIC_INFO.phone}</a></p>
                      <p><a href="tel:+18579287678" className="hover:text-teal-600">(857) 928-7678</a></p>
                      <p><a href="mailto:mostafmed@acumedm.com" className="hover:text-teal-600">mostafmed@acumedm.com</a></p>
                    </div>
                  </div>
                </div>
              </div>

              <Link
                to="/book"
                className="mt-9 inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-7 py-4 rounded-full font-bold"
              >
                <Calendar className="w-5 h-5" />
                Book Your Appointment
              </Link>
            </div>

            <div className="rounded-[2rem] overflow-hidden shadow-2xl border-8 border-white min-h-[520px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2949.1!2d-71.183!3d42.364!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89e377!2s124+Watertown+St+Watertown+MA!5e0!3m2!1sen!2sus!4v1"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '520px' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="AcuMeD Clinic location"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            <div>
              <h3 className="text-xl font-bold">AcuMeD Clinic</h3>
              <p className="text-gray-400 text-sm leading-relaxed mt-4">
                Holistic healing for mind, body, and spirit. Serving the greater Boston & Watertown area with evidence-informed integrative medicine since 2004.
              </p>
            </div>

            <div>
              <h3 className="font-bold">Services</h3>
              <div className="mt-4 space-y-2 text-sm text-gray-400">
                {['Acupuncture', 'Herbal Medicine', 'Cupping / Hijama', 'Japanese Acupuncture', 'Neuro Acupuncture'].map((item) => (
                  <a key={item} href="#services" className="block hover:text-teal-300">{item}</a>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-bold">Quick Links</h3>
              <div className="mt-4 space-y-2 text-sm text-gray-400">
                <a href="#about" className="block hover:text-teal-300">About Dr. Medhati</a>
                <a href="#conditions" className="block hover:text-teal-300">Conditions Treated</a>
                <a href="#faq" className="block hover:text-teal-300">FAQ & Preparation</a>
                <a href="#insurance" className="block hover:text-teal-300">Insurance & Payments</a>
                <a href="#location" className="block hover:text-teal-300">Location & Hours</a>
                <Link to="/book" className="block hover:text-teal-300">Book Appointment</Link>
              </div>
            </div>

            <div>
              <h3 className="font-bold">Contact</h3>
              <div className="mt-4 space-y-3 text-sm text-gray-400">
                <p className="flex gap-2"><MapPin className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />124 Watertown St, Suite #3A, Watertown, MA 02472</p>
                <p className="flex gap-2"><Phone className="w-4 h-4 text-teal-400 shrink-0" />{CLINIC_INFO.phone}</p>
                <p className="flex gap-2"><Mail className="w-4 h-4 text-teal-400 shrink-0" />mostafmed@acumedm.com</p>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row gap-3 justify-between text-xs text-gray-500">
            <p>© 2025 AcuMed Clinic. All rights reserved.</p>
            <p>Not a substitute for emergency medical care.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}