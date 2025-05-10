
import React from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { clubService, ClubEvent, ClubMember } from "@/services/clubService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, Clock } from "lucide-react";
import { toast } from "sonner";

const ClubPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const clubId = id ? parseInt(id) : 0;
  
  const { data: club, isLoading: clubLoading } = useQuery({
    queryKey: ["club", clubId],
    queryFn: () => clubService.getClubById(clubId),
    enabled: !!clubId,
  });
  
  const { data: clubEvents, isLoading: eventsLoading } = useQuery<ClubEvent[]>({
    queryKey: ["clubEvents", clubId],
    queryFn: async () => {
      const response = await clubService.getClubEvents(clubId);
      return response.data;
    },
    enabled: !!clubId,
  });
  
  const { data: members, isLoading: membersLoading } = useQuery<ClubMember[]>({
    queryKey: ["clubMembers", clubId],
    queryFn: async () => {
      const response = await clubService.getClubMembers(clubId);
      return response.data;
    },
    enabled: !!clubId,
  });
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleJoinClub = async () => {
    try {
      await clubService.joinClub(clubId);
      toast.success("Successfully joined the club");
      // Refresh the members list
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      toast.error("Failed to join club");
    }
  };

  if (clubLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-club-purple rounded-full border-t-transparent animate-spin"></div>
      </div>
    );
  }

  if (!club) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold">Club not found</h2>
        <p className="mt-2 text-muted-foreground">
          The club you're looking for doesn't exist or has been removed.
        </p>
        <Button className="mt-4" asChild>
          <Link to="/clubs">Browse Clubs</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="h-64 md:h-80 overflow-hidden rounded-lg bg-gray-200 mb-6 relative">
        {club.data.image ? (
          <img 
            src={club.data.image} 
            alt={club.data.name} 
            className="w-full h-full object-cover" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-club-purple to-club-blue">
            <span className="text-5xl font-bold text-white">{club.data.name.substring(0, 2).toUpperCase()}</span>
          </div>
        )}
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{club.data.name}</h1>
            <p className="text-muted-foreground">
              Established {formatDate(club.data.created_at)}
            </p>
          </div>

          <div className="prose max-w-none">
            <h2 className="text-xl font-semibold mb-3">About This Club</h2>
            <p className="leading-relaxed">{club.data.description}</p>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4">Upcoming Events</h2>
            
            {eventsLoading ? (
              <div className="grid gap-4 md:grid-cols-2">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="animate-pulse bg-gray-50 p-4 rounded-md">
                    <div className="w-3/4 h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="w-1/2 h-3 bg-gray-100 rounded"></div>
                  </div>
                ))}
              </div>
            ) : clubEvents && clubEvents.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {clubEvents.map((event) => (
                  <Card key={event.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <div className="h-36 overflow-hidden bg-gray-100">
                      {event.image ? (
                        <img
                          src={event.image}
                          alt={event.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center w-full h-full bg-gradient-to-r from-club-purple/70 to-club-blue/70">
                          <Calendar className="w-10 h-10 text-white" />
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-medium truncate">{event.title}</h3>
                      <div className="flex items-center text-sm text-muted-foreground mt-2">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{formatDate(event.start_date)}</span>
                      </div>
                      <Button variant="outline" size="sm" className="w-full mt-3" asChild>
                        <Link to={`/events/${event.id}`}>View Event</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center p-6 bg-gray-50 rounded-md">
                <Calendar className="w-8 h-8 mx-auto text-muted-foreground" />
                <p className="mt-2 text-muted-foreground">No upcoming events scheduled</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Club Members</CardTitle>
            </CardHeader>
            <CardContent>
              {membersLoading ? (
                <div className="space-y-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex items-center animate-pulse">
                      <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                      <div className="ml-2 w-24 h-3 bg-gray-200 rounded"></div>
                    </div>
                  ))}
                </div>
              ) : members && members.length > 0 ? (
                <div className="space-y-2">
                  {members.map((member) => (
                    <div key={member.id} className="flex items-center">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium">
                          {member.username?.substring(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <span className="ml-2 text-sm">
                        {member.username} 
                        {member.role === 'head' && (
                          <span className="ml-1 text-xs bg-club-purple/20 text-club-purple px-1 py-0.5 rounded">
                            Head
                          </span>
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted-foreground">No members in this club</p>
                </div>
              )}
              
              <Button className="w-full mt-4" variant="outline" onClick={handleJoinClub}>
                Join Club
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ClubPage;
