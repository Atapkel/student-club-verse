
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
  getCurrentStudent: () => api.get<Student>("/students/current/"),
  
  registerStudent: (data: RegisterStudentData) => 
    api.post<Student>("/students/", data, false),
  
  getStudentById: (id: number) => api.get<Student>(`/students/${id}/`),
  
  getStudentTickets: (studentId: number) => 
    api.get<StudentTicket[]>(`/students/${studentId}/tickets/`),
  
  getStudentClubs: (studentId: number) => 
    api.get<ClubMembership[]>(`/students/${studentId}/clubs/`),
  
  getStudentSubscriptions: (studentId: number) => 
    api.get<Subscription[]>(`/students/${studentId}/subscriptions/`)
};
