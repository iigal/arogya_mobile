import { Doctor, Specialty, AppointmentSlot } from '../types';
import { API_BASE_URL as ROOT_BASE_URL } from '../../config/api';

const API_BASE_URL = `${ROOT_BASE_URL}/api`;

export const fetchDoctors = async (): Promise<Doctor[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/doctors/`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const responseData = await response.json();
    const data = Array.isArray(responseData?.data) ? responseData.data : (Array.isArray(responseData) ? responseData : []);
    return data.map((doctor: any): Doctor => ({
      id: doctor.id || doctor.pk,
      name: doctor.name || doctor.doctor_name || 'Unknown Doctor',
      specialty_name: doctor.specialty_name || doctor.specialty?.name || 'General Practitioner',
      specialty: doctor.specialty,
      rating: doctor.rating || '4.5',
      reviews: doctor.reviews || '100+',
      price: doctor.price || 500,
      opd_time: doctor.opd_time || 'Mon-Fri 9AM-5PM',
      bio: doctor.bio || 'Experienced healthcare professional',
      experience: doctor.experience || '5+ years',
      education: doctor.education || 'MBBS',
      location: doctor.location || 'Kathmandu'
    }));
  } catch (error) {
    console.error('Error in fetchDoctors:', error);
    return [];
  }
};

export const fetchSpecialties = async (): Promise<Specialty[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/specialties/`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const responseData = await response.json();
    const data = Array.isArray(responseData?.data) ? responseData.data : (Array.isArray(responseData) ? responseData : []);
    return data.map((item: any): Specialty => ({
      id: item.id || item.pk,
      name: item.name || item.specialty_name || 'Unnamed Specialty'
    }));
  } catch (error) {
    console.error('Error in fetchSpecialties:', error);
    return [];
  }
};

export const fetchAvailableSlots = async (doctorId: number, date: string): Promise<AppointmentSlot[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/appointments/available-slots/?doctor_id=${doctorId}&date=${date}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.slots || [];
  } catch (error) {
    console.error('Error fetching available slots:', error);
    return [];
  }
};
