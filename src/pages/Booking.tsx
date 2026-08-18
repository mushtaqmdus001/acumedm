import { useState, FormEvent } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { CLINIC_INFO } from '../constants';
import { sendPatientBookingEmail, sendAdminBookingEmail } from '../lib/emailjs';
import { toast } from 'react-hot-toast';
import { Calendar, Clock, User, Phone, Mail, MessageSquare, CheckCircle, ArrowRight, Loader2 } from 'lucide-react';
import { format, addDays, startOfToday, isAfter, isBefore, setHours, setMinutes } from 'date-fns';
import { cn } from '../lib/utils';
import { ServiceIcon } from '../components/ServiceIcon';


// Keep the booking catalog synchronized with the services displayed on Home.tsx.
// The title is what is stored in Firestore and sent in booking emails.
// iconId maps each service to the existing ServiceIcon component.
const BOOKING_SERVICES = [
  {
    id: 'initial-acupuncture',
    iconId: 'acupuncture',
    title: 'Initial Acupuncture',
    duration: '60 min session',
  },
  {
    id: 'follow-up-acupuncture',
    iconId: 'acupuncture',
    title: 'Follow-up Acupuncture',
    duration: '30 min session',
  },
  {
    id: 'herbal-medicine',
    iconId: 'herbs',
    title: 'Herbal Medicine',
    duration: '45 min session',
  },
  {
    id: 'hijama-cupping',
    iconId: 'cupping',
    title: 'Cupping / Hijama',
    duration: '45 min session',
  },
] as const;

export function Booking() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    service: '',
    date: '',
    time: '',
    patientName: '',
    patientEmail: '',
    patientPhone: '',
    notes: ''
  });

  const steps = [
    { id: 1, name: 'Select Service', icon: '🪡' },
    { id: 2, name: 'Choose Date & Time', icon: '📅' },
    { id: 3, name: 'Your Details', icon: '👤' },
    { id: 4, name: 'Confirm', icon: '✅' }
  ];

  const handleServiceSelect = (serviceTitle: string) => {
    setFormData({ ...formData, service: serviceTitle });
    setStep(2);
  };

  const handleDateTimeSelect = (date: string, time: string) => {
    setFormData({ ...formData, date, time });
    setStep(3);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (step < 4) {
      setStep(4);
      return;
    }

    setLoading(true);
    try {
      // 1. Save to Firestore
      const docRef = await addDoc(collection(db, 'appointments'), {
        ...formData,
        status: 'pending',
        createdAt: serverTimestamp()
      });

      console.log("Appointment saved with ID:", docRef.id);

      // 2. Send Emails via EmailJS (Graceful & Non-blocking)
      const emailData = {
        patient_name: formData.patientName,
        patient_email: formData.patientEmail,
        patient_phone: formData.patientPhone,
        service: formData.service,
        date: formData.date,
        time: formData.time,
        notes: formData.notes,
        booking_id: docRef.id,
        timestamp: new Date().toLocaleString()
      };

      try {
        const [patientRes] = await Promise.all([
          sendPatientBookingEmail(emailData),
          sendAdminBookingEmail(emailData)
        ]);

        if (patientRes.success) {
          toast.success('Appointment booked successfully! Confirmation email sent.');
        } else {
          // Appointment is safely stored in Firestore
          toast.success('Appointment booked and recorded in clinic schedule! We will contact you to confirm.');
        }
      } catch (emailError: any) {
        console.warn("Email delivery notice:", emailError);
        toast.success('Appointment booked successfully and recorded in clinic schedule!');
      }

      setStep(5); // Success step
    } catch (error) {
      console.error("Booking error:", error);
      toast.error('Failed to book appointment. Please try again or call us.');
    } finally {
      setLoading(false);
    }
  };

  // Generate available dates (next 14 days)
  const availableDates = Array.from({ length: 14 }, (_, i) => {
    const date = addDays(startOfToday(), i + 1);
    return {
      value: format(date, 'yyyy-MM-dd'),
      label: format(date, 'EEE, MMM d'),
      isClosed: date.getDay() === 0 // Sunday closed
    };
  });

  // Generate available times
  const availableTimes = [
    '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM',
    '4:00 PM', '4:30 PM', '5:00 PM'
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Book Your Appointment</h1>
          <p className="text-gray-600">Follow the steps below to schedule your visit at AcuMeD Clinic.</p>
        </div>

        {/* Progress Bar */}
        {step <= 4 && (
          <div className="mb-12">
            <div className="flex justify-between items-center relative">
              <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -translate-y-1/2 z-0" />
              {steps.map((s) => (
                <div key={s.id} className="relative z-10 flex flex-col items-center">
                  <div
                    className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all duration-300",
                      step >= s.id ? "bg-teal-600 text-white shadow-lg shadow-teal-600/30" : "bg-white text-gray-400 border-2 border-gray-100"
                    )}
                  >
                    {step > s.id ? <CheckCircle className="w-6 h-6" /> : s.icon}
                  </div>
                  <span className={cn(
                    "mt-3 text-xs font-bold uppercase tracking-wider",
                    step >= s.id ? "text-teal-600" : "text-gray-400"
                  )}>
                    {s.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 overflow-hidden border border-gray-100">
          <form onSubmit={handleSubmit} className="p-8 md:p-12">
            {/* Step 1: Service */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Choose Your Service</h2>
                  <p className="text-gray-500 mt-2">
                    Select one of the four appointment services below to continue.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {BOOKING_SERVICES.map((service) => (
                    <button
                      key={service.id}
                      type="button"
                      onClick={() => handleServiceSelect(service.title)}
                      className={cn(
                        "flex items-center gap-4 p-6 rounded-2xl border-2 transition-all text-left group",
                        formData.service === service.title ? "border-teal-600 bg-teal-50" : "border-gray-100 hover:border-teal-200 hover:bg-gray-50"
                      )}
                    >
                      <ServiceIcon serviceId={service.iconId} className="w-12 h-12 rounded-xl shadow-sm group-hover:scale-110 shrink-0" iconClassName="w-6 h-6" />
                      <div>
                        <p className="font-bold text-gray-900">{service.title}</p>
                        <p className="text-xs text-gray-500 mt-1">{service.duration}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 2: Date & Time */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">Select Date</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
                    {availableDates.map((date) => (
                      <button
                        key={date.value}
                        type="button"
                        disabled={date.isClosed}
                        onClick={() => setFormData({ ...formData, date: date.value })}
                        className={cn(
                          "p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-1",
                          date.isClosed ? "opacity-30 cursor-not-allowed bg-gray-50" :
                          formData.date === date.value ? "border-teal-600 bg-teal-50 text-teal-600" : "border-gray-100 hover:border-teal-200"
                        )}
                      >
                        <span className="text-[10px] font-bold uppercase">{date.label.split(',')[0]}</span>
                        <span className="text-lg font-bold">{date.label.split(',')[1].trim()}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {formData.date && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <label className="block text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">Select Time</label>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                      {availableTimes.map((time) => (
                        <button
                          key={time}
                          type="button"
                          onClick={() => setFormData({ ...formData, time })}
                          className={cn(
                            "p-3 rounded-xl border-2 transition-all text-sm font-bold",
                            formData.time === time ? "border-teal-600 bg-teal-50 text-teal-600" : "border-gray-100 hover:border-teal-200"
                          )}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                <div className="flex justify-between pt-8">
                  <button type="button" onClick={() => setStep(1)} className="text-gray-500 font-bold hover:text-gray-900">← Back</button>
                  <button
                    type="button"
                    disabled={!formData.date || !formData.time}
                    onClick={() => setStep(3)}
                    className="bg-teal-600 text-white px-8 py-3 rounded-full font-bold hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continue
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Details */}
            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Full Name *</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        required
                        value={formData.patientName}
                        onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                        className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-100 focus:border-teal-600 outline-none transition-all"
                        placeholder="Jane Doe"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Phone Number *</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        required
                        value={formData.patientPhone}
                        onChange={(e) => setFormData({ ...formData, patientPhone: e.target.value })}
                        className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-100 focus:border-teal-600 outline-none transition-all"
                        placeholder="(617) 000-0000"
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Email Address *</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      required
                      value={formData.patientEmail}
                      onChange={(e) => setFormData({ ...formData, patientEmail: e.target.value })}
                      className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-100 focus:border-teal-600 outline-none transition-all"
                      placeholder="jane@example.com"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Notes / Concerns (Optional)</label>
                  <div className="relative">
                    <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-100 focus:border-teal-600 outline-none transition-all min-h-[120px]"
                      placeholder="Tell us about your health concerns..."
                    />
                  </div>
                </div>

                <div className="flex justify-between pt-8">
                  <button type="button" onClick={() => setStep(2)} className="text-gray-500 font-bold hover:text-gray-900">← Back</button>
                  <button
                    type="submit"
                    className="bg-teal-600 text-white px-8 py-3 rounded-full font-bold hover:bg-teal-700"
                  >
                    Review Appointment
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 4: Confirm */}
            {step === 4 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <div className="bg-teal-50 rounded-3xl p-8 border border-teal-100 space-y-6">
                  <h3 className="text-xl font-bold text-teal-900">Appointment Summary</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-teal-600 shadow-sm">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wider font-bold text-teal-600">Date</p>
                        <p className="font-bold text-gray-900">{formData.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-teal-600 shadow-sm">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wider font-bold text-teal-600">Time</p>
                        <p className="font-bold text-gray-900">{formData.time}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-teal-600 shadow-sm">
                        <CheckCircle className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wider font-bold text-teal-600">Service</p>
                        <p className="font-bold text-gray-900">{formData.service}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-teal-600 shadow-sm">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wider font-bold text-teal-600">Patient</p>
                        <p className="font-bold text-gray-900">{formData.patientName}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-8">
                  <button type="button" onClick={() => setStep(3)} className="text-gray-500 font-bold hover:text-gray-900">← Back</button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-teal-600 text-white px-10 py-4 rounded-full font-bold hover:bg-teal-700 flex items-center gap-2 shadow-xl shadow-teal-600/20 active:scale-95 disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirm Booking'}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 5: Success */}
            {step === 5 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12 space-y-8"
              >
                <div className="w-24 h-24 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 mx-auto">
                  <CheckCircle className="w-12 h-12" />
                </div>
                <div className="space-y-4">
                  <h3 className="text-3xl font-bold text-gray-900">Appointment Requested!</h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    Thank you, {formData.patientName.split(' ')[0]}. We've received your request for {formData.service} on {formData.date} at {formData.time}.
                  </p>
                  <p className="text-sm text-teal-600 font-bold">
                    A confirmation email has been sent to {formData.patientEmail}.
                  </p>
                </div>
                <div className="pt-8">
                  <Link
                    to="/"
                    className="inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-full font-bold hover:bg-gray-800 transition-all"
                  >
                    Return Home
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </motion.div>
            )}
          </form>
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            Need to change or cancel? Call us at <a href={`tel:${CLINIC_INFO.phone}`} className="text-teal-600 font-bold hover:underline">{CLINIC_INFO.phone}</a>
          </p>
        </div>
      </div>
    </div>
  );
}