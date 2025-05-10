
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Calendar, Home, Search, Settings, User } from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
}

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const location = useLocation();
  
  const navItems: NavItem[] = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: <Home className="w-5 h-5 mr-2" />
    },
    {
      title: "Explore",
      href: "/explore",
      icon: <Search className="w-5 h-5 mr-2" />
    },
    {
      title: "Clubs",
      href: "/clubs",
      icon: <User className="w-5 h-5 mr-2" />
    },
    {
      title: "Events",
      href: "/events",
      icon: <Calendar className="w-5 h-5 mr-2" />
    },
    {
      title: "Settings",
      href: "/settings",
      icon: <Settings className="w-5 h-5 mr-2" />
    }
  ];

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-20 flex flex-col w-64 bg-white shadow-lg border-r transition-transform duration-300 ease-in-out transform md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex items-center justify-center h-16 px-4 border-b">
        <Link to="/" className="flex items-center">
          <span className="text-xl font-bold gradient-heading">CampusClubHub</span>
        </Link>
      </div>
      
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.href}>
              <Button
                variant={location.pathname === item.href ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start text-left",
                  location.pathname === item.href 
                    ? "bg-club-purple hover:bg-club-purple/90" 
                    : "hover:bg-accent"
                )}
                asChild
              >
                <Link to={item.href}>
                  {item.icon}
                  {item.title}
                </Link>
              </Button>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t">
        <div className="p-3 bg-accent rounded-md">
          <h4 className="font-medium text-sm">Need help?</h4>
          <p className="text-xs text-muted-foreground mt-1">
            Contact student support for assistance with clubs and events.
          </p>
          <Button size="sm" className="w-full mt-2">
            Contact Support
          </Button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
