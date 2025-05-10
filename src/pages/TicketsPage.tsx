
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ticketService, Ticket } from "@/services/ticketService";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Ticket as TicketIcon } from "lucide-react";
import { toast } from "sonner";

const TicketsPage: React.FC = () => {
  const { currentUser } = useAuth();

  const { data: tickets, isLoading, refetch } = useQuery({
    queryKey: ["tickets"],
    queryFn: ticketService.getAllTickets,
    enabled: !!currentUser,
  });

  const handleCancelTicket = async (ticketId: number) => {
    try {
      await ticketService.cancelTicket(ticketId);
      toast.success("Ticket cancelled successfully");
      refetch();
    } catch (error) {
      console.error("Failed to cancel ticket:", error);
      toast.error("Failed to cancel ticket. Please try again.");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">My Tickets</h1>
        <p className="text-muted-foreground">
          View and manage your event tickets
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardContent className="flex items-center p-6">
                <div className="w-20 h-20 bg-gray-200 rounded-md"></div>
                <div className="flex-grow ml-4">
                  <div className="w-3/4 h-5 bg-gray-200 rounded mb-2"></div>
                  <div className="w-1/2 h-4 bg-gray-100 rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : tickets && tickets.length > 0 ? (
        <div className="space-y-4">
          {tickets.map((ticket: Ticket) => (
            <Card key={ticket.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row">
                  <div className="flex items-center justify-center p-6 bg-club-purple sm:w-32">
                    <TicketIcon className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex flex-col justify-between flex-grow p-6">
                    <div>
                      <h3 className="text-lg font-medium">{ticket.event_title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Purchased: {new Date(ticket.purchased_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex justify-end mt-4 space-x-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/events/${ticket.event}`}>View Event</Link>
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={() => handleCancelTicket(ticket.id)}
                      >
                        Cancel Ticket
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center py-12">
            <Calendar className="w-12 h-12 text-muted-foreground" />
            <h3 className="mt-4 text-xl font-medium">No tickets found</h3>
            <p className="mt-2 text-sm text-center text-muted-foreground">
              You haven't purchased any tickets yet.
              <br />
              Browse upcoming events to secure your spot!
            </p>
            <Button className="mt-6" asChild>
              <Link to="/events">Browse Events</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TicketsPage;
