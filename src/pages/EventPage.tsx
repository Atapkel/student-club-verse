
import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { eventService } from "@/services/eventService";
import { ticketService } from "@/services/ticketService";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MapPin, Clock, Users, Star, Ticket } from "lucide-react";
import EventReviewForm from "@/components/events/EventReviewForm";

const EventPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { currentUser, isAuthenticated } = useAuth();
  const [showReviewForm, setShowReviewForm] = useState(false);
  
  const queryClient = useQueryClient();
  
  const eventId = id ? parseInt(id) : 0;
  
  const { data: event, isLoading: eventLoading } = useQuery({
    queryKey: ["event", eventId],
    queryFn: () => eventService.getEventById(eventId),
    enabled: !!eventId,
  });
  
  const { data: reviews, isLoading: reviewsLoading } = useQuery({
    queryKey: ["eventReviews", eventId],
    queryFn: () => eventService.getEventReviews(eventId),
    enabled: !!eventId,
  });

  // const purchaseTicketMutation = useMutation({
  //   mutationFn: () => eventService.purchaseTicket(eventId),
  //   onSuccess: () => {
  //     toast.success("Ticket purchased successfully!");
  //     queryClient.invalidateQueries({ queryKey: ["event", eventId] });
  //     queryClient.invalidateQueries({ queryKey: ["tickets"] });
  //     queryClient.invalidateQueries({ queryKey: ["myTickets"] });
  //   },
  //   onError: (error) => {
  //     console.error("Failed to purchase ticket:", error);
  //     toast.error("Failed to purchase ticket. Please try again.");
  //   }
  // });
  
 const purchaseTicketMutation = useMutation({
    mutationFn: () => ticketService.purchaseTicket(eventId, currentUser?.id || 0),
    onSuccess: () => {
      toast.success("Ticket purchased successfully!");
      queryClient.invalidateQueries({ queryKey: ["event", eventId] });
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      queryClient.invalidateQueries({ queryKey: ["myTickets"] });
    },
    onError: (error) => {
      console.error("Failed to purchase ticket:", error);
      toast.error("Failed to purchase ticket. Please try again.");
    }
  });

  const handlePurchaseTicket = () => {
    if (!isAuthenticated) {
      toast.error("Please log in to purchase tickets");
      return;
    }
    
    if (!currentUser?.id) {
      toast.error("User information not available");
      return;
    }
    
    purchaseTicketMutation.mutate();
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  if (eventLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-club-purple rounded-full border-t-transparent animate-spin"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold">Event not found</h2>
        <p className="mt-2 text-muted-foreground">
          The event you're looking for doesn't exist or has been removed.
        </p>
        <Button className="mt-4" asChild>
          <Link to="/events">Browse Events</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="h-64 md:h-80 overflow-hidden rounded-lg bg-gray-200 mb-6 relative">
        {event.image ? (
          <img 
            src={event.image} 
            alt={event.title} 
            className="w-full h-full object-cover" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-club-purple to-club-blue">
            <Calendar className="w-16 h-16 text-white" />
          </div>
        )}
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{event.title}</h1>
            <p className="text-lg text-muted-foreground">
              Hosted by <Link to={`/clubs/${event.club}`} className="text-club-purple hover:underline">{event.club_name}</Link>
            </p>
          </div>

          <div className="prose max-w-none">
            <h2 className="text-xl font-semibold mb-3">About This Event</h2>
            <p className="leading-relaxed">{event.description}</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Event Reviews</h2>
            
            {reviewsLoading ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse p-3 bg-gray-50 rounded-md">
                    <div className="w-1/3 h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="w-full h-3 bg-gray-100 rounded"></div>
                  </div>
                ))}
              </div>
            ) : reviews && reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <Card key={review.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <div className="font-medium">{review.user_username}</div>
                        <div className="flex items-center text-amber-500">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'fill-none'}`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm">{review.comment}</p>
                      <div className="text-xs text-muted-foreground mt-2">
                        {new Date(review.created_at).toLocaleDateString()}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center p-6 bg-gray-50 rounded-md">
                <p className="text-muted-foreground">No reviews yet for this event</p>
              </div>
            )}
            
            {isAuthenticated && (
              <div className="mt-4">
                {showReviewForm ? (
                  <EventReviewForm 
                    eventId={eventId}
                    onCancel={() => setShowReviewForm(false)}
                    onSuccess={() => {
                      setShowReviewForm(false);
                      queryClient.invalidateQueries({ queryKey: ["eventReviews", eventId] });
                    }}
                  />
                ) : (
                  <Button onClick={() => setShowReviewForm(true)} variant="outline">
                    Write a Review
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Event Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start">
                <Calendar className="w-5 h-5 mr-2 text-muted-foreground" />
                <div>
                  <p className="font-medium">Date & Time</p>
                  <p className="text-sm text-muted-foreground">{formatDate(event.start_date)}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <MapPin className="w-5 h-5 mr-2 text-muted-foreground" />
                <div>
                  <p className="font-medium">Location</p>
                  <p className="text-sm text-muted-foreground">{event.room_name}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Ticket className="w-5 h-5 mr-2 text-muted-foreground" />
                <div>
                  <p className="font-medium">Ticket Information</p>
                  <p className="text-sm text-muted-foreground">
                    {event.ticket_type === 'free' ? 'Free' : `$${event.ticket_price}`}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {event.tickets_available} tickets available
                  </p>
                </div>
              </div>
              
              <Button 
                className="w-full mt-4" 
                onClick={handlePurchaseTicket}
                disabled={event.tickets_available <= 0 || purchaseTicketMutation.isPending}
              >
                {purchaseTicketMutation.isPending ? (
                  <div className="w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin mr-2"></div>
                ) : null}
                {event.tickets_available <= 0 ? "Sold Out" : `Purchase Ticket`}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EventPage;
