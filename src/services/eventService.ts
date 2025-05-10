
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
  getAllEvents: () => api.get<Event[]>("/events/"),
  
  getUpcomingEvents: () => api.get<Event[]>("/events/?upcoming=true"),
  
  getEventById: (id: number) => api.get<Event>(`/events/${id}/`),
  
  getEventTickets: (eventId: number) => 
    api.get(`/events/${eventId}/tickets/`),
  
  getEventReviews: (eventId: number) => 
    api.get<EventReview[]>(`/events/${eventId}/reviews/`),
  
  purchaseTicket: (eventId: number) => 
    api.post(`/events/${eventId}/tickets/`, {}),
  
  createReview: (eventId: number, rating: number, comment: string) => 
    api.post(`/events/${eventId}/reviews/`, { rating, comment })
};
