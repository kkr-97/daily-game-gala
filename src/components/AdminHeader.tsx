
import { Button } from "@/components/ui/button";
import { dailyGamesApi } from "@/services/api";
import { LogOut } from "lucide-react";

interface AdminHeaderProps {
  onLogout: () => void;
}

const AdminHeader = ({ onLogout }: AdminHeaderProps) => {
  const handleLogout = () => {
    dailyGamesApi.clearCredentials();
    onLogout();
  };

  return (
    <header className="w-full p-4 bg-background/50 backdrop-blur-lg border-b border-border sticky top-0 z-10 animate-slide-down">
      <div className="container flex items-center justify-between mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
            A
          </div>
          <h1 className="text-xl font-semibold">Daily Games Admin</h1>
        </div>
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleLogout}
          className="text-muted-foreground hover:text-foreground flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>
    </header>
  );
};

export default AdminHeader;
