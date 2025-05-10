
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

export const clubService = {
  getAllClubs: () => api.get<Club[]>("/clubs/"),
  
  getClubById: (id: number) => api.get<Club>(`/clubs/${id}/`),
  
  getClubMembers: (clubId: number) => 
    api.get<ClubMember[]>(`/clubs/${clubId}/members/`),
  
  getClubEvents: (clubId: number) => 
    api.get(`/clubs/${clubId}/events/`),
  
  getClubSubscriptions: (clubId: number) => 
    api.get(`/clubs/${clubId}/subscriptions/`),
  
  joinClub: (clubId: number, userId: number) => 
    api.post(`/clubs/${clubId}/members/`, { user: userId }),
  
  subscribeToClub: (clubId: number) => 
    api.post(`/clubs/${clubId}/subscriptions/`, {})
};
