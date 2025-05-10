
import { api } from "./api";

export interface Event {
  id: number;
  title: string;
  description: string;
  club: number;
  club_name: string;
  room: number;
  room_name: string;
  start_date: string;
  end_date: string;
  ticket_price: number;
  total_tickets: number;
  tickets_available: number;
  tickets_sold: number;
  image: string | null;
  created_at: string;
  ticket_type: string;
}

export interface EventReview {
  id: number;
  event: number;
  event_title: string;
  user: number;
  user_username: string;
  rating: number;
  comment: string;
  created_at: string;
}

export const eventService = {
  getAllEvents: async () => {
    const response = await api.get<Event[]>("/events/");
    return response;
  },
  
  getUpcomingEvents: async () => {
    const response = await api.get<Event[]>("/events/?upcoming=true");
    return response;
  },
  
  getEventById: async (id: number) => {
    const response = await api.get<Event>(`/events/${id}/`);
    return response;
  },
  
  getEventTickets: async (eventId: number) => {
    const response = await api.get(`/events/${eventId}/tickets/`);
    return response;
  },
  
  getEventReviews: async (eventId: number) => {
    const response = await api.get<EventReview[]>(`/events/${eventId}/reviews/`);
    return response;
  },
  
  purchaseTicket: async (eventId: number) => {
    const response = await api.post(`/events/${eventId}/tickets/`, {});
    return response;
  },
  
  createReview: async (eventId: number, rating: number, comment: string) => {
    const response = await api.post(`/events/${eventId}/reviews/`, { rating, comment });
    return response;
  }
};
