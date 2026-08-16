export type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export interface Appointment {
  id?: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  service: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  notes?: string;
  createdAt: any; // Firestore Timestamp or Date
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  image?: string;
}

export interface ClinicInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
  hours: {
    [key: string]: string;
  };
}

export interface Testimonial {
  id?: string;
  patientName: string;
  location?: string;
  condition: string;
  category: 'pain' | 'fertility' | 'stress' | 'wellness' | 'digestive';
  treatment?: string;
  rating: number;
  comment: string;
  verified?: boolean;
  date?: string;
  createdAt?: any;
}
