import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Appointment } from '../types';
import { sendConfirmationEmail } from '../lib/emailjs';
import { toast } from 'react-hot-toast';
import { CheckCircle, XCircle, Clock, Calendar, User, Phone, Mail, MessageSquare, Loader2, Trash2, Search, Filter } from 'lucide-react';
import { cn } from '../lib/utils';

export function Admin() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled' | 'completed'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'appointments'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const appts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Appointment[];
      setAppointments(appts);
      setLoading(false);
    }, (error) => {
      console.error("Firestore error:", error);
      toast.error("Failed to load appointments. Check permissions.");
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleStatusUpdate = async (id: string, status: Appointment['status'], appt: Appointment) => {
    try {
      await updateDoc(doc(db, 'appointments', id), { status });
      toast.success(`Appointment marked as ${status}`);

      if (status === 'confirmed') {
        const emailRes = await sendConfirmationEmail({
          patient_name: appt.patientName,
          patient_email: appt.patientEmail,
          service: appt.service,
          date: appt.date,
          time: appt.time
        });
        if (emailRes.success) {
          toast.success("Confirmation email sent to patient.");
        } else if (emailRes.isGmailAuthError) {
          toast("Status updated. Reconnect Gmail in EmailJS dashboard to send automated emails.", { icon: 'ℹ️' });
        }
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update status.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this appointment?")) return;
    try {
      await deleteDoc(doc(db, 'appointments', id));
      toast.success("Appointment deleted.");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete appointment.");
    }
  };

  const filteredAppointments = appointments.filter(appt => {
    const matchesFilter = filter === 'all' || appt.status === filter;
    const matchesSearch = 
      appt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appt.patientEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appt.service.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Manage patient appointments and confirmations.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search patients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-100 focus:border-teal-600 outline-none transition-all bg-white"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="pl-12 pr-10 py-3 rounded-xl border-2 border-gray-100 focus:border-teal-600 outline-none transition-all bg-white appearance-none font-bold text-gray-700"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-12 h-12 text-teal-600 animate-spin" />
            <p className="text-gray-500 font-bold">Loading appointments...</p>
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="bg-white rounded-3xl p-20 text-center border-2 border-dashed border-gray-200">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No appointments found</h3>
            <p className="text-gray-500">Try adjusting your filters or search terms.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredAppointments.map((appt, index) => (
              <motion.div
                key={appt.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-3xl p-8 shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col lg:flex-row gap-8 items-start lg:items-center"
              >
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full">
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase tracking-wider font-bold text-teal-600">Patient</p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-teal-50 rounded-full flex items-center justify-center text-teal-600 font-bold">
                        {appt.patientName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{appt.patientName}</p>
                        <p className="text-xs text-gray-500">{appt.patientPhone}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[10px] uppercase tracking-wider font-bold text-teal-600">Service & Status</p>
                    <div className="flex flex-col gap-2">
                      <p className="font-bold text-gray-900">{appt.service}</p>
                      <span className={cn(
                        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider w-fit",
                        appt.status === 'pending' ? "bg-amber-100 text-amber-700" :
                        appt.status === 'confirmed' ? "bg-teal-100 text-teal-700" :
                        appt.status === 'cancelled' ? "bg-red-100 text-red-700" :
                        "bg-gray-100 text-gray-700"
                      )}>
                        {appt.status === 'pending' ? <Clock className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />}
                        {appt.status}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[10px] uppercase tracking-wider font-bold text-teal-600">Schedule</p>
                    <div className="flex flex-col gap-1">
                      <p className="font-bold text-gray-900">{appt.date}</p>
                      <p className="text-sm text-gray-500">{appt.time}</p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[10px] uppercase tracking-wider font-bold text-teal-600">Contact</p>
                    <div className="flex flex-col gap-1">
                      <a href={`mailto:${appt.patientEmail}`} className="text-sm font-bold text-teal-600 hover:underline truncate block">
                        {appt.patientEmail}
                      </a>
                      <p className="text-xs text-gray-400 italic truncate block">
                        {appt.notes || "No notes provided"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full lg:w-auto pt-6 lg:pt-0 border-t lg:border-t-0 border-gray-100">
                  {appt.status === 'pending' && (
                    <button
                      onClick={() => handleStatusUpdate(appt.id!, 'confirmed', appt)}
                      className="flex-1 lg:flex-none bg-teal-600 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-teal-700 transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Confirm
                    </button>
                  )}
                  {appt.status !== 'cancelled' && appt.status !== 'completed' && (
                    <button
                      onClick={() => handleStatusUpdate(appt.id!, 'cancelled', appt)}
                      className="flex-1 lg:flex-none bg-white text-red-600 border-2 border-red-50 px-6 py-3 rounded-xl font-bold text-sm hover:border-red-600 transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                      <XCircle className="w-4 h-4" />
                      Cancel
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(appt.id!)}
                    className="w-12 h-12 flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
