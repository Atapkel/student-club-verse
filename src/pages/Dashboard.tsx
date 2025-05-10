
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { eventService, Event } from "@/services/eventService";
import { clubService, Club } from "@/services/clubService";
import { ticketService, Ticket } from "@/services/ticketService";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Users } from "lucide-react";

const Dashboard: React.FC = () => {
  const { currentUser } = useAuth();

  // Fetch upcoming events
  const { data: upcomingEvents, isLoading: eventsLoading } = useQuery({
    queryKey: ["upcomingEvents"],
    queryFn: eventService.getUpcomingEvents,
  });

  // Fetch user's tickets
  const { data: myTickets, isLoading: ticketsLoading } = useQuery({
    queryKey: ["myTickets"],
    queryFn: () => {
      if (!currentUser) return [];
      return ticketService.getAllTickets(); // In a real app, filter for the current user
    },
    enabled: !!currentUser,
  });

  // Fetch clubs
  const { data: clubs, isLoading: clubsLoading } = useQuery({
    queryKey: ["clubs"],
    queryFn: clubService.getAllClubs,
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Section */}
      <section className="space-y-2">
        <h1 className="text-3xl font-bold">
          Welcome back, {currentUser?.username || "Student"}!
        </h1>
        <p className="text-muted-foreground">
          Here's what's happening in your campus community
        </p>
      </section>

      {/* Stats Overview */}
      <section className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Upcoming Events
            </CardTitle>
            <CardDescription className="text-2xl font-bold">
              {eventsLoading ? "..." : upcomingEvents?.length || 0}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Events scheduled in the next 30 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              My Tickets
            </CardTitle>
            <CardDescription className="text-2xl font-bold">
              {ticketsLoading ? "..." : myTickets?.length || 0}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Tickets for upcoming events
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Wallet Balance
            </CardTitle>
            <CardDescription className="text-2xl font-bold">
              ${currentUser?.wallet_balance || "0.00"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Available for ticket purchases
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Upcoming Events Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Upcoming Events</h2>
          <Button variant="outline" asChild>
            <Link to="/events">View all</Link>
          </Button>
        </div>

        {eventsLoading ? (
          <div className="grid gap-4 md:grid-cols-3">
            {[...Array(3)].map((_, index) => (
              <Card key={index} className="animate-pulse">
                <div className="h-40 bg-gray-200 rounded-t-lg"></div>
                <CardHeader>
                  <div className="w-3/4 h-4 bg-gray-200 rounded"></div>
                  <div className="w-1/2 h-3 mt-2 bg-gray-100 rounded"></div>
                </CardHeader>
                <CardContent>
                  <div className="w-full h-3 bg-gray-100 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : upcomingEvents && upcomingEvents.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-3">
            {upcomingEvents.slice(0, 3).map((event: Event) => (
              <Card key={event.id} className="overflow-hidden card-hover">
                <div className="h-40 overflow-hidden bg-gray-200">
                  {event.image ? (
                    <img
                      src={event.image}
                      alt={event.title}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full text-gray-500 bg-gray-100">
                      <Calendar className="w-12 h-12" />
                    </div>
                  )}
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">{event.title}</CardTitle>
                  <CardDescription>{event.club_name}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    {formatDate(event.start_date)}
                  </p>
                  <p className="text-sm">
                    {event.tickets_available} tickets available
                  </p>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link to={`/events/${event.id}`}>View Details</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center py-8">
              <Calendar className="w-12 h-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No upcoming events</h3>
              <p className="text-sm text-muted-foreground">
                Check back soon for new events or join a club to stay updated!
              </p>
              <Button className="mt-4" asChild>
                <Link to="/clubs">Explore Clubs</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </section>

      {/* My Tickets Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">My Tickets</h2>
          <Button variant="outline" asChild>
            <Link to="/tickets">View all</Link>
          </Button>
        </div>

        {ticketsLoading ? (
          <div className="animate-pulse space-y-2">
            {[...Array(2)].map((_, index) => (
              <div
                key={index}
                className="p-4 border rounded-md bg-gray-50"
              >
                <div className="w-3/4 h-4 bg-gray-200 rounded"></div>
                <div className="w-1/4 h-3 mt-2 bg-gray-100 rounded"></div>
              </div>
            ))}
          </div>
        ) : myTickets && myTickets.length > 0 ? (
          <div className="space-y-2">
            {myTickets.slice(0, 3).map((ticket: Ticket) => (
              <Card key={ticket.id} className="flex flex-col sm:flex-row">
                <div className="flex items-center justify-center p-4 bg-club-purple sm:w-32">
                  <span className="font-bold text-white">TICKET</span>
                </div>
                <CardContent className="flex flex-col justify-between flex-grow p-4">
                  <div>
                    <h3 className="font-medium">{ticket.event_title}</h3>
                    <p className="text-sm text-muted-foreground">
                      Purchased: {new Date(ticket.purchased_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex justify-end mt-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/events/${ticket.event}`}>View Event</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center py-8">
              <Calendar className="w-12 h-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No tickets yet</h3>
              <p className="text-sm text-muted-foreground">
                Browse upcoming events and reserve your spot!
              </p>
              <Button className="mt-4" asChild>
                <Link to="/events">Browse Events</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </section>

      {/* Popular Clubs Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Popular Clubs</h2>
          <Button variant="outline" asChild>
            <Link to="/clubs">View all</Link>
          </Button>
        </div>

        {clubsLoading ? (
          <div className="grid gap-4 md:grid-cols-4">
            {[...Array(4)].map((_, index) => (
              <Card key={index} className="animate-pulse">
                <div className="h-24 bg-gray-200 rounded-t-lg"></div>
                <CardHeader>
                  <div className="w-3/4 h-4 bg-gray-200 rounded"></div>
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : clubs && clubs.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-4">
            {clubs.slice(0, 4).map((club: Club) => (
              <Card key={club.id} className="overflow-hidden card-hover">
                <div className="h-24 overflow-hidden bg-gray-100">
                  {club.image ? (
                    <img
                      src={club.image}
                      alt={club.name}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full bg-gradient-to-r from-club-purple to-club-blue">
                      <span className="text-lg font-bold text-white">{club.name.substring(0, 2).toUpperCase()}</span>
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-medium truncate">{club.name}</h3>
                  <Button variant="ghost" size="sm" className="w-full mt-2" asChild>
                    <Link to={`/clubs/${club.id}`}>View Club</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center py-8">
              <Users className="w-12 h-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No clubs available</h3>
              <p className="text-sm text-muted-foreground">
                Clubs will be added soon!
              </p>
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
