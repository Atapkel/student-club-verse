import { api } from "./api";

export interface Ticket {
  id: number;
  student: number;
  student_username: string;
  event: number;
  event_title: string;
  purchased_at: string;
}

export const ticketService = {
  getAllTickets: () => api.get<Ticket[]>("/tickets/"),
  
  getTicketById: (id: number) => api.get<Ticket>(`/tickets/${id}/`),
  
  purchaseTicket: (eventId: number, studentId: number) => 
    api.post<Ticket>("/tickets/", {
      event: eventId,
      student: studentId
    }),
  
  cancelTicket: (id: number) => api.delete(`/tickets/${id}/`)
};