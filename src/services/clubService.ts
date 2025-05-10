
import { api } from "./api";

export interface Club {
  id: number;
  name: string;
  description: string;
  image: string | null;
  created_at: string;
}

export interface ClubMember {
  id: number;
  user: number;
  username: string;
  club: number;
  club_name: string;
  role: string;
  joined_at: string;
}

export interface ClubEvent {
  id: number;
  title: string;
  description: string;
  image: string | null;
  start_date: string;
  end_date: string;
  club: number;
  club_name: string;
  room: number;
  room_name: string;
  ticket_price: number;
  total_tickets: number;
  ticket_type: string;
  tickets_available: number;
  tickets_sold: number;
  created_at: string;
}

export interface Subscription {
  id: number;
  user: number;
  user_username: string;
  club: number;
  club_name: string;
  subscribed_at: string;
}

export const clubService = {
  getAllClubs: () => api.get<Club[]>("/clubs/"),
  
  getClubById: (id: number) => api.get<Club>(`/clubs/${id}/`),
  
  getClubEvents: (clubId: number) => 
    api.get<ClubEvent[]>(`/clubs/${clubId}/events/`),
  
  getClubMembers: (clubId: number) => 
    api.get<ClubMember[]>(`/clubs/${clubId}/members/`),
  
  joinClub: (clubId: number) => 
    api.post(`/clubs/${clubId}/members/`, { role: "member" }),
  
  subscribeToClub: (clubId: number) => 
    api.post<Subscription>(`/clubs/${clubId}/subscriptions/`, {})
};
