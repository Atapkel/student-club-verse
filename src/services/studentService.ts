
import { api } from "./api";

export interface Student {
  id: number;
  username: string;
  email: string;
  faculty: string;
  speciality: string;
  wallet_balance: number;
}

export interface RegisterStudentData {
  username: string;
  email: string;
  password: string;
  password2: string;
  faculty?: string;
  speciality?: string;
}

export interface ClubMembership {
  id: number;
  user: number;
  username: string;
  club: number;
  club_name: string;
  role: string;
  joined_at: string;
}

export interface StudentTicket {
  id: number;
  student: number;
  student_username: string;
  event: number;
  event_title: string;
  purchased_at: string;
}

export interface Subscription {
  id: number;
  user: number;
  user_username: string;
  club: number;
  club_name: string;
  subscribed_at: string;
}

export const studentService = {
  getCurrentStudent: async () => {
    const response = await api.get<Student>("/students/current/");
    return response;
  },
  
  registerStudent: async (data: RegisterStudentData) => {
    // Explicitly set Content-Type header to avoid OPTIONS preflight
    const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8000/api"}/students/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      mode: 'cors',
      credentials: 'include'
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      const message = errorData.detail || errorData.message || 'Registration failed';
      throw new Error(message);
    }
    
    return response.json();
  },
  
  getStudentById: async (id: number) => {
    const response = await api.get<Student>(`/students/${id}/`);
    return response;
  },
  
  getStudentTickets: async (studentId: number) => {
    const response = await api.get<StudentTicket[]>(`/students/${studentId}/tickets/`);
    return response;
  },
  
  getStudentClubs: async (studentId: number) => {
    const response = await api.get<ClubMembership[]>(`/students/${studentId}/clubs/`);
    return response;
  },
  
  getStudentSubscriptions: async (studentId: number) => {
    const response = await api.get<Subscription[]>(`/students/${studentId}/subscriptions/`);
    return response;
  }
};
