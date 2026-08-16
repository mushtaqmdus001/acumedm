import emailjs from '@emailjs/browser';

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const PATIENT_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_PATIENT_TEMPLATE_ID;
const ADMIN_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_ADMIN_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

if (PUBLIC_KEY) {
  try {
    emailjs.init(PUBLIC_KEY);
  } catch (e) {
    console.warn("EmailJS init warning:", e);
  }
}

export interface EmailResult {
  success: boolean;
  status?: number;
  text?: string;
  error?: string;
  isGmailAuthError?: boolean;
}

const checkIsGmailAuthError = (error: any): boolean => {
  const errStr = typeof error === 'string' ? error : JSON.stringify(error || {});
  return (
    errStr.includes('Invalid grant') ||
    errStr.includes('reconnect your Gmail') ||
    errStr.includes('Gmail_API') ||
    error?.status === 412
  );
};

export const sendPatientBookingEmail = async (data: {
  patient_name: string;
  patient_email: string;
  patient_phone?: string;
  service: string;
  date: string;
  time: string;
  notes?: string;
  booking_id?: string;
  timestamp?: string;
}): Promise<EmailResult> => {
  if (!SERVICE_ID || !PATIENT_TEMPLATE_ID || !PUBLIC_KEY) {
    console.warn("EmailJS credentials not fully configured, skipping email notification.");
    return { success: false, error: "Email configuration not provided" };
  }
  try {
    const templateParams = {
      ...data,
      to_email: data.patient_email,
      email: data.patient_email,
      recipient_email: data.patient_email,
      patient_email: data.patient_email,
      user_email: data.patient_email,
      to_name: data.patient_name,
      patient_name: data.patient_name,
      name: data.patient_name,
      user_name: data.patient_name,
      service: data.service,
      service_name: data.service,
      date: data.date,
      booking_date: data.date,
      appointment_date: data.date,
      time: data.time,
      booking_time: data.time,
      appointment_time: data.time,
      patient_phone: data.patient_phone || '',
      phone: data.patient_phone || '',
      notes: data.notes || '',
      clinic_name: 'AcuMeD Clinic',
      clinic_phone: '(617) 393-1998',
      clinic_address: '124 Watertown St, Watertown, MA 02472',
    };
    const response = await emailjs.send(SERVICE_ID, PATIENT_TEMPLATE_ID, templateParams);
    return { success: true, status: response.status, text: response.text };
  } catch (error: any) {
    const isAuth = checkIsGmailAuthError(error);
    const errorText = error?.text || error?.message || (typeof error === 'object' ? JSON.stringify(error) : String(error));
    console.warn("EmailJS patient delivery notice:", isAuth ? "Gmail reconnect required in EmailJS dashboard" : errorText);
    return {
      success: false,
      status: error?.status,
      error: errorText,
      isGmailAuthError: isAuth
    };
  }
};

export const sendAdminBookingEmail = async (data: {
  patient_name: string;
  patient_email: string;
  patient_phone: string;
  service: string;
  date: string;
  time: string;
  notes?: string;
  booking_id?: string;
  timestamp?: string;
}): Promise<EmailResult> => {
  if (!SERVICE_ID || !ADMIN_TEMPLATE_ID || !PUBLIC_KEY) {
    console.warn("EmailJS admin template not configured, skipping admin email.");
    return { success: false, error: "Email configuration not provided" };
  }
  try {
    const templateParams = {
      ...data,
      to_name: "Clinic Admin",
      patient_name: data.patient_name,
      patient_email: data.patient_email,
      patient_phone: data.patient_phone,
      phone: data.patient_phone,
      reply_to: data.patient_email,
      service: data.service,
      service_name: data.service,
      date: data.date,
      booking_date: data.date,
      time: data.time,
      booking_time: data.time,
      notes: data.notes || '',
      clinic_name: 'AcuMeD Clinic',
    };
    const response = await emailjs.send(SERVICE_ID, ADMIN_TEMPLATE_ID, templateParams);
    return { success: true, status: response.status, text: response.text };
  } catch (error: any) {
    const isAuth = checkIsGmailAuthError(error);
    const errorText = error?.text || error?.message || (typeof error === 'object' ? JSON.stringify(error) : String(error));
    console.warn("EmailJS admin delivery notice:", isAuth ? "Gmail reconnect required in EmailJS dashboard" : errorText);
    return {
      success: false,
      status: error?.status,
      error: errorText,
      isGmailAuthError: isAuth
    };
  }
};

export const sendConfirmationEmail = async (data: {
  patient_name: string;
  patient_email: string;
  service: string;
  date: string;
  time: string;
}): Promise<EmailResult> => {
  if (!SERVICE_ID || !PATIENT_TEMPLATE_ID || !PUBLIC_KEY) {
    return { success: false, error: "Email configuration not provided" };
  }
  try {
    const response = await emailjs.send(SERVICE_ID, PATIENT_TEMPLATE_ID, {
      ...data,
      to_email: data.patient_email,
      email: data.patient_email,
      recipient_email: data.patient_email,
      to_name: data.patient_name,
      patient_name: data.patient_name,
      name: data.patient_name,
      service: data.service,
      service_name: data.service,
      date: data.date,
      booking_date: data.date,
      time: data.time,
      booking_time: data.time,
      subject: "Appointment Confirmed - AcuMeD Clinic",
      message: `Your appointment for ${data.service} on ${data.date} at ${data.time} has been confirmed.`,
      clinic_name: 'AcuMeD Clinic',
      clinic_phone: '(617) 393-1998',
      clinic_address: '124 Watertown St, Watertown, MA 02472',
    });
    return { success: true, status: response.status, text: response.text };
  } catch (error: any) {
    const isAuth = checkIsGmailAuthError(error);
    const errorText = error?.text || error?.message || String(error);
    console.warn("EmailJS confirmation delivery notice:", errorText);
    return {
      success: false,
      status: error?.status,
      error: errorText,
      isGmailAuthError: isAuth
    };
  }
};
