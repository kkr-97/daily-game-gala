
import { useState, useEffect } from "react";
import CredentialsForm from "@/components/CredentialsForm";
import AdminDashboard from "@/components/AdminDashboard";
import { dailyGamesApi } from "@/services/api";

const Index = () => {
  const [hasCredentials, setHasCredentials] = useState<boolean>(false);
  
  // Check if credentials are already set
  useEffect(() => {
    setHasCredentials(dailyGamesApi.hasCredentials());
  }, []);
  
  const handleCredentialsSet = () => {
    setHasCredentials(true);
  };
  
  const handleLogout = () => {
    setHasCredentials(false);
  };
  
  // If credentials not set, show the form, otherwise show the admin dashboard
  return hasCredentials ? (
    <AdminDashboard onLogout={handleLogout} />
  ) : (
    <CredentialsForm onCredentialsSet={handleCredentialsSet} />
  );
};

export default Index;
