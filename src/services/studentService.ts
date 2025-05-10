
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

export const studentService = {
  getCurrentStudent: () => api.get<Student>("/students/current/"),
  
  registerStudent: (data: RegisterStudentData) => 
    api.post<Student>("/students/", data, false),
  
  getStudentById: (id: number) => api.get<Student>(`/students/${id}/`),
  
  getStudentTickets: (studentId: number) => 
    api.get(`/students/${studentId}/tickets/`),
  
  getStudentClubs: (studentId: number) => 
    api.get(`/students/${studentId}/clubs/`),
  
  getStudentSubscriptions: (studentId: number) => 
    api.get(`/students/${studentId}/subscriptions/`)
};
