
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
  
  getClubEvents: (clubId: number) => 
    api.get(`/clubs/${clubId}/events/`),
  
  getClubMembers: (clubId: number) => 
    api.get<ClubMember[]>(`/clubs/${clubId}/members/`),
  
  joinClub: (clubId: number) => 
    api.post(`/clubs/${clubId}/members/`, { role: "member" }),
  
  subscribeToClub: (clubId: number) => 
    api.post(`/clubs/${clubId}/subscriptions/`, {})
};
