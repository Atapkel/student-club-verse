
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { clubService, Club } from "@/services/clubService";
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
import { Search, User } from "lucide-react";

const ClubsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: clubs, isLoading } = useQuery({
    queryKey: ["clubs"],
    queryFn: clubService.getAllClubs,
  });

  const filteredClubs = clubs
    ? clubs.filter((club) =>
        club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (club.description && club.description.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : [];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Clubs</h1>
        <p className="text-muted-foreground">
          Discover and join student clubs across campus
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute w-5 h-5 text-muted-foreground left-3 top-3" />
        <Input
          placeholder="Search clubs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Clubs Grid */}
      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-3">
          {[...Array(6)].map((_, index) => (
            <Card key={index} className="animate-pulse">
              <div className="h-32 bg-gray-200 rounded-t-lg"></div>
              <CardHeader>
                <div className="w-3/4 h-5 bg-gray-200 rounded"></div>
                <div className="w-full h-4 mt-2 bg-gray-100 rounded"></div>
                <div className="w-3/4 h-4 mt-1 bg-gray-100 rounded"></div>
              </CardHeader>
            </Card>
          ))}
        </div>
      ) : filteredClubs.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-3">
          {filteredClubs.map((club: Club) => (
            <Card key={club.id} className="overflow-hidden card-hover">
              <div className="h-32 overflow-hidden">
                {club.image ? (
                  <img
                    src={club.image}
                    alt={club.name}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full bg-gradient-to-r from-club-purple to-club-blue">
                    <span className="text-3xl font-bold text-white">{club.name.substring(0, 2).toUpperCase()}</span>
                  </div>
                )}
              </div>
              <CardHeader>
                <CardTitle>{club.name}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {club.description || "Join our club to participate in exciting activities and events!"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Established: {new Date(club.created_at).toLocaleDateString()}
                </p>
              </CardContent>
              <CardFooter>
                <Button className="w-full" asChild>
                  <Link to={`/clubs/${club.id}`}>View Club</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-12 text-center border rounded-lg">
          <User className="w-12 h-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">No clubs found</h3>
          <p className="text-sm text-muted-foreground">
            Try adjusting your search criteria
          </p>
        </div>
      )}
    </div>
  );
};

export default ClubsPage;
