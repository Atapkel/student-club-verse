
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { eventService, Event } from "@/services/eventService";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, Calendar as CalendarIcon, Search } from "lucide-react";

const EventsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  const { data: events, isLoading } = useQuery({
    queryKey: ["events"],
    queryFn: eventService.getAllEvents,
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

  const filteredEvents = events
    ? events.filter((event) => {
        const matchesSearch = event.title
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
          event.club_name.toLowerCase().includes(searchTerm.toLowerCase());
        
        if (filter === "all") return matchesSearch;
        if (filter === "free") return matchesSearch && event.ticket_price === 0;
        if (filter === "paid") return matchesSearch && event.ticket_price > 0;
        
        return matchesSearch;
      })
    : [];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Events</h1>
        <p className="text-muted-foreground">Discover and join campus events</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="flex-grow">
          <div className="relative">
            <Search className="absolute w-5 h-5 text-muted-foreground left-3 top-3" />
            <Input
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="w-full md:w-48">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All Events</SelectItem>
                <SelectItem value="free">Free</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Events Grid */}
      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, index) => (
            <Card key={index} className="animate-pulse">
              <div className="h-48 bg-gray-200 rounded-t-lg"></div>
              <CardHeader>
                <div className="w-3/4 h-5 bg-gray-200 rounded"></div>
                <div className="w-1/2 h-4 mt-2 bg-gray-100 rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="w-full h-4 bg-gray-100 rounded"></div>
                <div className="w-3/4 h-4 mt-2 bg-gray-100 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredEvents.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((event: Event) => (
            <Card key={event.id} className="overflow-hidden card-hover">
              <div className="h-48 overflow-hidden bg-gray-100">
                {event.image ? (
                  <img
                    src={event.image}
                    alt={event.title}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full bg-gray-100">
                    <Calendar className="w-16 h-16 text-gray-400" />
                  </div>
                )}
                {event.ticket_price > 0 && (
                  <div className="absolute top-3 right-3 bg-club-purple text-white px-2 py-1 rounded-md text-sm font-medium">
                    ${event.ticket_price}
                  </div>
                )}
              </div>
              <CardHeader>
                <CardTitle>{event.title}</CardTitle>
                <CardDescription>
                  Organized by {event.club_name}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center text-sm text-muted-foreground">
                  <CalendarIcon className="w-4 h-4 mr-1" />
                  <span>{formatDate(event.start_date)}</span>
                </div>
                <div className="flex items-center text-sm">
                  <span className="font-medium">
                    {event.tickets_available} tickets available
                  </span>
                </div>
                <p className="text-sm line-clamp-2">
                  {event.description || "Join us for this exciting event!"}
                </p>
              </CardContent>
              <CardFooter>
                <Button className="w-full" asChild>
                  <Link to={`/events/${event.id}`}>View Event</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-12 text-center border rounded-lg">
          <Calendar className="w-12 h-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">No events found</h3>
          <p className="text-sm text-muted-foreground">
            Try adjusting your search or filters
          </p>
        </div>
      )}
    </div>
  );
};

export default EventsPage;
