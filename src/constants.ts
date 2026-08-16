import { Service, ClinicInfo, Testimonial } from './types';
import aiAssistantAvatar from './assets/images/ai_assistant_avatar_1786895152430.jpg';
import avatarOpen from './assets/images/avatar_speaking_mouth_open_1786895777983.jpg';
import avatarSmile from './assets/images/avatar_speaking_mouth_smile_1786895795218.jpg';
import promoPoster from './assets/images/acumed_promo_video_poster_1786895488920.jpg';
import tourReception from './assets/images/acumed_tour_reception_1786895707851.jpg';
import tourTreatment from './assets/images/acumed_tour_treatment_1786895726595.jpg';
import tourHerbal from './assets/images/acumed_tour_herbal_1786895743129.jpg';
import tourCupping from './assets/images/acumed_tour_cupping_1786895757907.jpg';

export const CLINIC_INFO: ClinicInfo = {
  name: "AcuMeD Acupuncture & Herbs Clinic",
  address: "124 Watertown St, Suite #3A, Watertown, MA 02472",
  phone: "(617) 393-1998",
  email: "mostafmed@acumedm.com",
  hours: {
    "Monday": "9:00 AM – 6:00 PM",
    "Tuesday": "9:00 AM – 6:00 PM",
    "Wednesday": "9:00 AM – 6:00 PM",
    "Thursday": "9:00 AM – 6:00 PM",
    "Friday": "9:00 AM – 6:00 PM",
    "Saturday": "9:00 AM – 2:00 PM",
    "Sunday": "Closed"
  }
};

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "test-1",
    patientName: "Sarah M.",
    location: "Watertown, MA",
    condition: "Chronic Sciatica & Lower Back Pain",
    category: "pain",
    treatment: "Moving Qi Acupuncture & Moxibustion",
    rating: 5,
    comment: "I had suffered from severe lower back pain and sciatica for over two years, trying physical therapy and pain injections with minimal lasting relief. After just four sessions with Dr. Medhati, my pain dropped by 80%. His deep medical background and gentle needle technique made me feel completely at ease. I can finally sleep through the night!",
    verified: true,
    date: "2 weeks ago"
  },
  {
    id: "test-2",
    patientName: "Elena R.",
    location: "Cambridge, MA",
    condition: "Fertility Support & Hormonal Balance",
    category: "fertility",
    treatment: "Acupuncture & Custom Herbal Formula",
    rating: 5,
    comment: "Dr. Medhati supported my IVF journey with weekly acupuncture and tailored herbal preparations. He was attentive, knowledgeable, and compassionate. We are now expecting our baby boy! His integrative knowledge combining Western medical pathology with Traditional Chinese Medicine is unmatched in the Boston area.",
    verified: true,
    date: "1 month ago"
  },
  {
    id: "test-3",
    patientName: "David K.",
    location: "Belmont, MA",
    condition: "Severe Migraines & Neck Tension",
    category: "pain",
    treatment: "Microsystem Acupuncture & Cupping (Hijama)",
    rating: 5,
    comment: "I was getting debilitating migraines 3 to 4 times a week from office desk work. The combination of scalp microsystem acupuncture and cupping therapy on my upper back relieved the pressure immediately. My frequency is now down to zero or once a month at most. Truly life-changing care.",
    verified: true,
    date: "3 weeks ago"
  },
  {
    id: "test-4",
    patientName: "Jennifer L.",
    location: "Newton, MA",
    condition: "Anxiety, Insomnia & Chronic Fatigue",
    category: "stress",
    treatment: "Avicenna Healing & Moving Qi",
    rating: 5,
    comment: "The calming atmosphere and Dr. Medhati's holistic Avicenna diagnostic methods restored my nervous system balance. I went from waking up 4 times every night with racing thoughts to 7+ hours of uninterrupted deep sleep. The clinic is pristine, peaceful, and professional.",
    verified: true,
    date: "1 month ago"
  },
  {
    id: "test-5",
    patientName: "Michael B.",
    location: "Boston, MA",
    condition: "Rotator Cuff Tendonitis & Sports Injury",
    category: "pain",
    treatment: "Combination Therapy & Moxa",
    rating: 5,
    comment: "As an avid marathon runner and gym-goer, a shoulder injury sidelined me for months. Dr. Medhati diagnosed the meridian blockages and applied gentle electro-stimulation and moxa heat therapy. Full mobility was restored ahead of my surgeon's timeline.",
    verified: true,
    date: "2 months ago"
  },
  {
    id: "test-6",
    patientName: "Amina T.",
    location: "Waltham, MA",
    condition: "Digestive Issues (IBS) & Acid Reflux",
    category: "digestive",
    treatment: "Herbal Medicine & Abdominal Acupuncture",
    rating: 5,
    comment: "Years of stomach bloating and reflux resolved after Dr. Medhati prescribed natural botanical herbs and balanced my digestive Qi. He listens deeply without rushing and explains the root cause of symptoms clearly.",
    verified: true,
    date: "2 months ago"
  }
];

export const SERVICES: Service[] = [
  {
    id: "moving-qi",
    title: "Moving Qi",
    description: "Traditional Chinese medicine technique using thin needles to stimulate specific points on the body to move Qi, relieve pain, and treat various physical, mental, and emotional conditions.",
    icon: "needle",
    image: "https://o9v.003.mytemp.website/acumed/images/MovingQi.jpg"
  },
  {
    id: "moxa",
    title: "Moxa",
    description: "Traditional therapeutic technique involving the burning of dried mugwort (moxa) near the skin to stimulate flow, facilitate healing, and strengthen the blood.",
    icon: "flame",
    image: "https://o9v.003.mytemp.website/acumed/images/Moxa.jpg"
  },
  {
    id: "cupping",
    title: "Cupping / Hijama",
    description: "Ancient therapeutic technique using suction cups to improve blood circulation, release muscle tension, and clear toxins from the body.",
    icon: "cup",
    image: "https://o9v.003.mytemp.website/acumed/images/Cupping.jpg"
  },
  {
    id: "microsystem",
    title: "Microsystem",
    description: "Specialized acupuncture systems focusing on specific areas like the ear, scalp, or hand to treat the entire body through these microsystems.",
    icon: "zap",
    image: "https://o9v.003.mytemp.website/acumed/images/Microsystem.jpg"
  },
  {
    id: "avicenna",
    title: "Avicenna Healing",
    description: "Traditional Persian medicine inspired by Avicenna (Ibn Sina), focusing on the balance of humors and natural remedies for holistic wellness.",
    icon: "sparkles",
    image: "http://o9v.003.mytemp.website/acumed/images/avicenna.jpg"
  },
  {
    id: "combination-therapy",
    title: "Combination Therapy",
    description: "A synergistic approach combining multiple therapeutic modalities to optimize healing outcomes and address complex health concerns.",
    icon: "radio",
    image: "https://o9v.003.mytemp.website/acumed/images/Combinationtherapy.jpg"
  }
];

export const IMAGES = {
  drMedhati: "https://www.acumedm.net/wp-content/themes/acumed-pro/images/about-avicenna.jpg",
  clinic: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1200&h=800",
  hero: "https://o9v.003.mytemp.website/acumed/images/acumedm.jpg",
  aiAvatar: "https://www.acumedm.net/wp-content/themes/acumed-pro/images/about-avicenna.jpg",
  avatarOpen: "https://www.acumedm.net/wp-content/themes/acumed-pro/images/about-avicenna.jpg",
  avatarSmile: "https://www.acumedm.net/wp-content/themes/acumed-pro/images/about-avicenna.jpg",
  promoPoster: promoPoster,
  tourReception: tourReception,
  tourTreatment: tourTreatment,
  tourHerbal: tourHerbal,
  tourCupping: tourCupping,
  promoVideo: "https://assets.mixkit.co/videos/preview/mixkit-woman-receiving-acupuncture-treatment-in-a-spa-41712-large.mp4",
  promoVideoAlt: "https://assets.mixkit.co/videos/preview/mixkit-close-up-of-hands-doing-acupuncture-41714-large.mp4"
};

export interface TourScene {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  image: string;
  duration: number; // in seconds
  narration: string;
  captions: { start: number; text: string }[];
  highlights: string[];
}

export const CLINIC_TOUR_SCENES: TourScene[] = [
  {
    id: 'reception',
    title: 'Welcome to AcuMeD',
    subtitle: 'A Peaceful Healing Sanctuary in Watertown, MA',
    badge: '1/4 · Welcome & Reception',
    image: tourReception,
    duration: 8,
    narration: "Hello and welcome to AcuMeD. From the moment you step inside, you'll feel the gentle warmth, soothing herbal teas, and a peaceful atmosphere designed to help you relax and heal.",
    captions: [
      { start: 0, text: "Welcome to AcuMeD — your healing sanctuary in Watertown." },
      { start: 3.5, text: "Enjoy warm organic teas in a peaceful, restful atmosphere." },
      { start: 6, text: "A welcoming space designed to help you relax and heal." }
    ],
    highlights: ["Complimentary Organic Herbal Tea", "Tranquil Waiting Sanctuary", "Free Patient Parking"]
  },
  {
    id: 'treatment',
    title: 'Private Treatment Suites',
    subtitle: 'Gentle, Pain-Free Moving Qi Acupuncture',
    badge: '2/4 · Treatment Suites',
    image: tourTreatment,
    duration: 8.5,
    narration: "Come inside our private treatment rooms. With warm linens and soft ambient light, Dr. Medhati uses hair-thin, gentle needles to help you unwind and melt away chronic pain.",
    captions: [
      { start: 0, text: "Step inside our private, peaceful treatment suites." },
      { start: 3.2, text: "Dr. Medhati uses ultra-fine, gentle needles for a pain-free experience." },
      { start: 6, text: "Deeply relaxing care for chronic pain, stress, and wellness." }
    ],
    highlights: ["Ultra-Fine Sterile Needles", "Gentle Moving Qi Technique", "Warm Infrared Care"]
  },
  {
    id: 'herbal',
    title: 'Custom Herbal Apothecary',
    subtitle: 'Personalized Botanical Preparations',
    badge: '3/4 · Herbal Apothecary',
    image: tourHerbal,
    duration: 8,
    narration: "Here is our herbal apothecary. Dr. Medhati blends custom botanical formulas tailored specifically for you, supporting your fertility, digestion, and daily vitality.",
    captions: [
      { start: 0, text: "Discover our authentic botanical herbal apothecary." },
      { start: 3.2, text: "Custom herbal blends prepared specifically for your health needs." },
      { start: 5.8, text: "Natural support for fertility, hormonal balance, and vitality." }
    ],
    highlights: ["Custom Herbal Formulations", "Pure Certified Botanicals", "Holistic Health Support"]
  },
  {
    id: 'cupping',
    title: 'Cupping & Moxa Suite',
    subtitle: 'Deep Myofascial Release & Warming Therapy',
    badge: '4/4 · Cupping & Moxa',
    image: tourCupping,
    duration: 8,
    narration: "In our therapy suite, gentle cupping and soothing moxa heat melt away deep muscle tension, improve your circulation, and leave you feeling completely renewed.",
    captions: [
      { start: 0, text: "Experience gentle cupping and soothing moxa therapy." },
      { start: 3.2, text: "Melts away muscle tension and improves healthy circulation." },
      { start: 5.8, text: "Leave feeling refreshed, balanced, and completely renewed." }
    ],
    highlights: ["Glass & Suction Cupping", "Soothing Moxa Heat", "Deep Muscle Tension Relief"]
  }
];

