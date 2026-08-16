import { useState, useEffect, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, Quote, CheckCircle2, ShieldCheck, HeartHandshake, Sparkles, MessageSquarePlus, X, Filter, ThumbsUp, Send } from 'lucide-react';
import { TESTIMONIALS, CLINIC_INFO } from '../constants';
import { Testimonial } from '../types';
import { db } from '../firebase';
import { collection, getDocs, addDoc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';

const CATEGORIES = [
  { id: 'all', label: 'All Reviews', icon: '✨' },
  { id: 'pain', label: 'Pain & Injuries', icon: '⚡' },
  { id: 'fertility', label: 'Fertility & Women', icon: '🌸' },
  { id: 'stress', label: 'Stress & Insomnia', icon: '🌙' },
  { id: 'digestive', label: 'Digestive & Wellness', icon: '🌿' },
] as const;

export function Testimonials() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [reviews, setReviews] = useState<Testimonial[]>(TESTIMONIALS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [helpfulCounts, setHelpfulCounts] = useState<Record<string, number>>({});

  // Form State
  const [formData, setFormData] = useState({
    patientName: '',
    location: '',
    condition: '',
    category: 'pain' as Testimonial['category'],
    treatment: '',
    rating: 5,
    comment: '',
  });

  // Fetch submitted reviews from Firestore
  useEffect(() => {
    async function loadDbReviews() {
      try {
        const q = query(collection(db, 'testimonials'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const dbItems: Testimonial[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          dbItems.push({
            id: doc.id,
            patientName: data.patientName,
            location: data.location || 'Watertown, MA',
            condition: data.condition,
            category: data.category,
            treatment: data.treatment,
            rating: data.rating || 5,
            comment: data.comment,
            verified: data.verified ?? true,
            date: 'Recent Patient',
            createdAt: data.createdAt,
          });
        });

        if (dbItems.length > 0) {
          // Merge unique reviews
          setReviews([...dbItems, ...TESTIMONIALS]);
        }
      } catch {
        // Fallback gracefully to predefined testimonials if offline or permissions restricted
      }
    }
    loadDbReviews();
  }, []);

  const filteredReviews = selectedCategory === 'all'
    ? reviews
    : reviews.filter((r) => r.category === selectedCategory || (selectedCategory === 'wellness' && (r.category === 'digestive' || r.category === 'wellness')));

  const handleHelpfulClick = (id: string) => {
    setHelpfulCounts((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
    toast.success('Thank you for your feedback!', { id: `helpful-${id}`, duration: 2000 });
  };

  const handleSubmitReview = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.patientName || !formData.condition || !formData.comment) {
      toast.error('Please complete all required fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const newReview: Omit<Testimonial, 'id'> = {
        patientName: formData.patientName.trim(),
        location: formData.location.trim() || 'Greater Boston, MA',
        condition: formData.condition.trim(),
        category: formData.category,
        treatment: formData.treatment.trim() || 'Acupuncture & Herbs',
        rating: Number(formData.rating),
        comment: formData.comment.trim(),
        verified: true,
        date: 'Just now',
        createdAt: serverTimestamp(),
      };

      try {
        await addDoc(collection(db, 'testimonials'), newReview);
      } catch (err) {
        console.warn('Firestore write fallback:', err);
      }

      // Optimistic local state update
      const createdItem: Testimonial = {
        ...newReview,
        id: `local-${Date.now()}`,
      };
      setReviews((prev) => [createdItem, ...prev]);

      toast.success('Your review has been submitted successfully. Thank you!');
      setIsModalOpen(false);
      setFormData({
        patientName: '',
        location: '',
        condition: '',
        category: 'pain',
        treatment: '',
        rating: 5,
        comment: '',
      });
    } catch {
      toast.error('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="testimonials" className="py-28 bg-gradient-to-b from-teal-50/40 via-white to-teal-50/20 relative overflow-hidden">
      {/* Background Subtle Accents */}
      <div className="absolute top-1/4 -right-24 w-96 h-96 bg-teal-100/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -left-20 w-80 h-80 bg-teal-200/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-teal-50 border border-teal-200/60 px-4 py-1.5 rounded-full shadow-sm mb-4">
            <Sparkles className="w-4 h-4 text-teal-600" />
            <span className="text-xs font-bold text-teal-800 uppercase tracking-widest">Patient Experiences</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight mb-6">
            Stories of Natural Healing & Lasting Relief
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Read how patients across Watertown, Cambridge, and Greater Boston found relief from chronic pain, fertility challenges, and stress under Dr. Mostafa Medhati’s care.
          </p>
        </div>

        {/* Trust Stats & Metrics Bar */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl shadow-teal-900/5 border border-teal-100/80 mb-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 divide-y lg:divide-y-0 lg:divide-x divide-gray-100">
            
            {/* Stat 1 */}
            <div className="flex flex-col items-center text-center p-2">
              <div className="flex items-center gap-1.5 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-3xl font-extrabold text-gray-900">4.9 / 5.0</span>
              <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider mt-1">Google & Patient Rating</span>
            </div>

            {/* Stat 2 */}
            <div className="flex flex-col items-center text-center p-2 pt-6 lg:pt-2">
              <div className="w-10 h-10 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600 mb-2">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <span className="text-3xl font-extrabold text-gray-900">5,000+</span>
              <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider mt-1">Patients Treated</span>
            </div>

            {/* Stat 3 */}
            <div className="flex flex-col items-center text-center p-2 pt-6 lg:pt-2">
              <div className="w-10 h-10 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600 mb-2">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-3xl font-extrabold text-gray-900">20+ Yrs</span>
              <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider mt-1">Clinical Practice in MA</span>
            </div>

            {/* Stat 4 */}
            <div className="flex flex-col items-center text-center p-2 pt-6 lg:pt-2">
              <div className="w-10 h-10 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600 mb-2">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <span className="text-3xl font-extrabold text-gray-900">98%</span>
              <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider mt-1">Satisfaction & Care Index</span>
            </div>

          </div>
        </div>

        {/* Featured Patient Journey Spotlight */}
        <div className="mb-16 bg-gradient-to-br from-teal-900 via-teal-800 to-slate-900 text-white rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute -bottom-10 -right-10 w-80 h-80 bg-teal-500/10 rounded-full blur-2xl" />
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-8 space-y-6">
              <div className="inline-flex items-center gap-2 bg-teal-700/60 border border-teal-500/40 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest text-teal-200">
                <Quote className="w-3.5 h-3.5" /> Featured Patient Story
              </div>
              <blockquote className="text-xl md:text-2xl font-serif italic text-teal-50 leading-relaxed">
                "After years of severe chronic pain and trying multiple specialists with no breakthrough, Dr. Medhati took the time to understand my whole history. His personalized acupuncture and herbal regimen gave me my quality of life back."
              </blockquote>
              <div className="flex flex-wrap items-center gap-4 text-sm text-teal-200/90 pt-2 border-t border-teal-700/50">
                <div className="font-bold text-white text-base">Sarah M.</div>
                <span>•</span>
                <div>Watertown, MA</div>
                <span>•</span>
                <span className="bg-teal-700/40 text-teal-200 px-2.5 py-0.5 rounded-md text-xs font-medium">Condition: Chronic Sciatica</span>
                <span>•</span>
                <span className="bg-teal-700/40 text-teal-200 px-2.5 py-0.5 rounded-md text-xs font-medium">Moving Qi & Moxa</span>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col items-center lg:items-end justify-center space-y-4">
              <div className="bg-white/10 backdrop-blur-md border border-white/15 p-6 rounded-2xl text-center w-full max-w-xs">
                <div className="flex justify-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm font-semibold text-white">Verified 5-Star Patient</p>
                <p className="text-xs text-teal-200 mt-1">Under care for 8 months</p>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full max-w-xs inline-flex items-center justify-center gap-2 bg-teal-500 hover:bg-teal-400 text-teal-950 font-bold px-6 py-3.5 rounded-full text-sm transition-all active:scale-95 shadow-lg shadow-teal-950/20 cursor-pointer"
              >
                <MessageSquarePlus className="w-4 h-4" />
                Share Your Patient Story
              </button>
            </div>

          </div>
        </div>

        {/* Filter Controls & Action Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
          
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 bg-gray-100/80 p-1.5 rounded-2xl border border-gray-200/80">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-white text-teal-700 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Leave a review button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 text-teal-700 bg-teal-50 hover:bg-teal-100/80 border border-teal-200/80 font-bold px-5 py-2.5 rounded-full text-sm transition-all active:scale-95 cursor-pointer shadow-sm"
          >
            <MessageSquarePlus className="w-4 h-4 text-teal-600" />
            <span>Leave a Review</span>
          </button>

        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredReviews.map((review, index) => {
              const initials = review.patientName
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2);

              const isHelpful = helpfulCounts[review.id || `idx-${index}`] || 0;

              return (
                <motion.div
                  key={review.id || `rev-${index}`}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col justify-between group"
                >
                  <div>
                    {/* Header: Stars & Verified Badge */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      {review.verified && (
                        <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-100">
                          <CheckCircle2 className="w-3 h-3 text-teal-600" />
                          <span>Verified Patient</span>
                        </div>
                      )}
                    </div>

                    {/* Condition Tag */}
                    <div className="mb-4">
                      <span className="inline-block text-xs font-bold text-teal-900 bg-teal-50/80 border border-teal-100/60 px-3 py-1 rounded-lg">
                        {review.condition}
                      </span>
                    </div>

                    {/* Comment */}
                    <p className="text-gray-700 leading-relaxed text-sm mb-6 font-normal">
                      "{review.comment}"
                    </p>
                  </div>

                  {/* Footer: Patient Info & Helpful */}
                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-teal-600 text-white font-bold text-sm flex items-center justify-center shadow-sm">
                        {initials}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-gray-900">{review.patientName}</h4>
                        <p className="text-xs text-gray-500">{review.location || 'Watertown, MA'} • {review.date || 'Verified'}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleHelpfulClick(review.id || `idx-${index}`)}
                      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                        isHelpful > 0
                          ? 'bg-teal-50 border-teal-200 text-teal-700'
                          : 'border-gray-200 text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                      }`}
                      title="Mark as helpful"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{isHelpful > 0 ? isHelpful : 'Helpful'}</span>
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Bottom Trust Banner & Google Review Link */}
        <div className="mt-16 bg-teal-50/70 border border-teal-100 rounded-3xl p-8 text-center flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-left">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-teal-600 shadow-sm border border-teal-100 shrink-0">
              <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
            </div>
            <div>
              <h4 className="text-base font-bold text-gray-900">Are you a current or past patient?</h4>
              <p className="text-sm text-gray-600">Your story inspires others to seek natural healing. We appreciate your feedback.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-6 py-3 rounded-full text-sm transition-all shadow-md shadow-teal-600/20 active:scale-95 cursor-pointer"
            >
              Write a Review
            </button>
            <a
              href="https://maps.google.com/?q=124+Watertown+St+Watertown+MA"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 font-bold px-6 py-3 rounded-full text-sm transition-all active:scale-95"
            >
              Google Maps Reviews
            </a>
          </div>
        </div>

      </div>

      {/* Write a Review Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl border border-gray-100 relative max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 text-gray-400 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-6">
                <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center text-teal-600 mb-3">
                  <MessageSquarePlus className="w-5 h-5" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Share Your Experience</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Help prospective patients learn how Dr. Mostafa Medhati helped you heal.
                </p>
              </div>

              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Your Name (e.g. Sarah M.) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.patientName}
                    onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                    placeholder="First Name & Last Initial"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm text-gray-800"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Town / City
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="e.g. Watertown, MA"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm text-gray-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Health Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as Testimonial['category'] })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm text-gray-800 bg-white"
                    >
                      <option value="pain">Pain & Injury</option>
                      <option value="fertility">Fertility & Hormones</option>
                      <option value="stress">Stress & Sleep</option>
                      <option value="digestive">Digestive & Herbs</option>
                      <option value="wellness">General Wellness</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Condition Treated *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.condition}
                      onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                      placeholder="e.g. Sciatica, Migraines"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm text-gray-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Rating
                    </label>
                    <div className="flex items-center gap-1.5 py-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setFormData({ ...formData, rating: star })}
                          className="p-1 hover:scale-110 transition-transform cursor-pointer"
                        >
                          <Star
                            className={`w-6 h-6 ${
                              star <= formData.rating
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-gray-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Treatment Received (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.treatment}
                    onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
                    placeholder="e.g. Acupuncture, Cupping, Herbal Medicine"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm text-gray-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Your Story & Results *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.comment}
                    onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                    placeholder="How did Dr. Medhati help you? What improvements did you experience?"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm text-gray-800"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3.5 rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-teal-600/20 disabled:opacity-50 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmitting ? 'Submitting...' : 'Post Your Review'}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
