
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { studentService, ClubMembership, StudentTicket, Subscription } from "@/services/studentService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Ticket, BookOpen, Bookmark } from "lucide-react";

const ProfilePage: React.FC = () => {
  const { currentUser } = useAuth();

  const { data: userClubs } = useQuery<ClubMembership[]>({
    queryKey: ["userClubs", currentUser?.id],
    queryFn: async () => {
      if (!currentUser?.id) return [];
      const response = await studentService.getStudentClubs(currentUser.id);
      return response;
    },
    enabled: !!currentUser?.id,
  });

  const { data: userTickets } = useQuery<StudentTicket[]>({
    queryKey: ["userTickets", currentUser?.id],
    queryFn: async () => {
      if (!currentUser?.id) return [];
      const response = await studentService.getStudentTickets(currentUser.id);
      return response;
    },
    enabled: !!currentUser?.id,
  });

  const { data: userSubscriptions } = useQuery<Subscription[]>({
    queryKey: ["userSubscriptions", currentUser?.id],
    queryFn: async () => {
      if (!currentUser?.id) return [];
      const response = await studentService.getStudentSubscriptions(currentUser.id);
      return response;
    },
    enabled: !!currentUser?.id,
  });

  if (!currentUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <User className="w-16 h-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold">You are not logged in</h2>
        <p className="text-muted-foreground mt-2">Please log in to view your profile</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="w-32 h-32 bg-gradient-to-r from-club-purple to-club-blue rounded-full flex items-center justify-center">
          <span className="text-3xl font-bold text-white">
            {currentUser.username.substring(0, 2).toUpperCase()}
          </span>
        </div>
        
        <div className="flex-1 text-center sm:text-left">
          <h1 className="text-3xl font-bold">{currentUser.username}</h1>
          <p className="text-muted-foreground">{currentUser.email}</p>
          <div className="flex flex-wrap gap-4 mt-4 justify-center sm:justify-start">
            {currentUser.faculty && (
              <div className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                Faculty: {currentUser.faculty}
              </div>
            )}
            {currentUser.speciality && (
              <div className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                Speciality: {currentUser.speciality}
              </div>
            )}
            <div className="bg-club-purple/20 text-club-purple px-3 py-1 rounded-full text-sm">
              Balance: ${currentUser.wallet_balance}
            </div>
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="clubs" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="clubs">My Clubs</TabsTrigger>
          <TabsTrigger value="tickets">My Tickets</TabsTrigger>
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="clubs" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" /> Clubs I'm Member Of
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!userClubs || userClubs.length === 0 ? (
                <div className="text-center py-8">
                  <User className="w-12 h-12 mx-auto text-muted-foreground" />
                  <p className="mt-4 text-muted-foreground">
                    You haven't joined any clubs yet
                  </p>
                  <Button className="mt-4" asChild>
                    <a href="/clubs">Browse Clubs</a>
                  </Button>
                </div>
              ) : (
                <div className="divide-y">
                  {userClubs.map((membership) => (
                    <div key={membership.id} className="py-3 flex justify-between items-center">
                      <div>
                        <p className="font-medium">{membership.club_name}</p>
                        <p className="text-xs text-muted-foreground">
                          Joined: {new Date(membership.joined_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        {membership.role === 'head' && (
                          <span className="bg-club-purple/20 text-club-purple px-2 py-1 rounded text-xs">
                            Club Head
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="tickets" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ticket className="w-5 h-5" /> My Event Tickets
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!userTickets || userTickets.length === 0 ? (
                <div className="text-center py-8">
                  <Ticket className="w-12 h-12 mx-auto text-muted-foreground" />
                  <p className="mt-4 text-muted-foreground">
                    You don't have any event tickets yet
                  </p>
                  <Button className="mt-4" asChild>
                    <a href="/events">Browse Events</a>
                  </Button>
                </div>
              ) : (
                <div className="divide-y">
                  {userTickets.map((ticket) => (
                    <div key={ticket.id} className="py-3">
                      <p className="font-medium">{ticket.event_title}</p>
                      <p className="text-xs text-muted-foreground">
                        Purchased: {new Date(ticket.purchased_at).toLocaleDateString()}
                      </p>
                      <Button variant="outline" size="sm" className="mt-2" asChild>
                        <a href={`/events/${ticket.event}`}>View Event</a>
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="subscriptions" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bookmark className="w-5 h-5" /> Club Subscriptions
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!userSubscriptions || userSubscriptions.length === 0 ? (
                <div className="text-center py-8">
                  <Bookmark className="w-12 h-12 mx-auto text-muted-foreground" />
                  <p className="mt-4 text-muted-foreground">
                    You haven't subscribed to any clubs yet
                  </p>
                  <Button className="mt-4" asChild>
                    <a href="/clubs">Browse Clubs</a>
                  </Button>
                </div>
              ) : (
                <div className="divide-y">
                  {userSubscriptions.map((subscription) => (
                    <div key={subscription.id} className="py-3">
                      <p className="font-medium">{subscription.club_name}</p>
                      <p className="text-xs text-muted-foreground">
                        Subscribed: {new Date(subscription.subscribed_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfilePage;
