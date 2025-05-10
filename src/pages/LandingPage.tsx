
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, Search, User } from "lucide-react";

const LandingPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="py-12 text-center bg-gradient-to-br from-white via-club-lightpurple/10 to-white">
        <div className="container px-4 mx-auto">
          <h1 className="mb-6 text-4xl font-bold sm:text-5xl md:text-6xl gradient-heading">
            CampusClubHub
          </h1>
          <p className="max-w-2xl mx-auto mb-8 text-lg text-gray-600 md:text-xl">
            Discover, join and manage student clubs and events all in one place.
            Connect with like-minded students and enhance your campus experience.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" asChild>
              <Link to="/register">Get Started</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container px-4 mx-auto">
          <h2 className="mb-12 text-3xl font-bold text-center">
            Everything you need for campus life
          </h2>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center p-6 text-center transition-all border rounded-lg shadow-sm hover:shadow-md">
              <div className="flex items-center justify-center w-16 h-16 mb-4 bg-club-purple/10 rounded-full">
                <User className="w-8 h-8 text-club-purple" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Join Clubs</h3>
              <p className="text-gray-600">
                Discover and join student clubs that match your interests and passions.
              </p>
            </div>

            <div className="flex flex-col items-center p-6 text-center transition-all border rounded-lg shadow-sm hover:shadow-md">
              <div className="flex items-center justify-center w-16 h-16 mb-4 bg-club-purple/10 rounded-full">
                <Calendar className="w-8 h-8 text-club-purple" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Attend Events</h3>
              <p className="text-gray-600">
                Browse upcoming events, purchase tickets, and enhance your student experience.
              </p>
            </div>

            <div className="flex flex-col items-center p-6 text-center transition-all border rounded-lg shadow-sm hover:shadow-md">
              <div className="flex items-center justify-center w-16 h-16 mb-4 bg-club-purple/10 rounded-full">
                <Search className="w-8 h-8 text-club-purple" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Stay Connected</h3>
              <p className="text-gray-600">
                Get notified about club activities and never miss important campus events.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 text-white bg-gradient-to-r from-club-darkblue to-club-purple">
        <div className="container px-4 mx-auto text-center">
          <h2 className="mb-6 text-3xl font-bold">Ready to get started?</h2>
          <p className="max-w-2xl mx-auto mb-8 text-lg">
            Join CampusClubHub today and unlock the full potential of your campus experience.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link to="/register">Create Your Account</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-white border-t">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div>
              <span className="text-xl font-bold gradient-heading">CampusClubHub</span>
              <p className="mt-1 text-sm text-gray-500">© 2025 All rights reserved</p>
            </div>
            <div className="flex gap-8">
              <Link to="#" className="text-gray-600 hover:text-gray-900">
                About
              </Link>
              <Link to="#" className="text-gray-600 hover:text-gray-900">
                Privacy
              </Link>
              <Link to="#" className="text-gray-600 hover:text-gray-900">
                Terms
              </Link>
              <Link to="#" className="text-gray-600 hover:text-gray-900">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
