
import { useAuth } from "@/contexts/AuthContext";
import LandingPage from "./LandingPage";
import Dashboard from "./Dashboard";

const Index = () => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-club-purple rounded-full border-t-transparent animate-spin"></div>
      </div>
    );
  }
  
  // Redirect authenticated users to dashboard, others to landing page
  return isAuthenticated ? <Dashboard /> : <LandingPage />;
};

export default Index;
