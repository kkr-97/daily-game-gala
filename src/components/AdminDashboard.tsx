
import { useState, useEffect } from "react";
import AdminHeader from "./AdminHeader";
import DashboardNav from "./DashboardNav";
import { dailyGamesApi } from "@/services/api";

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard = ({ onLogout }: AdminDashboardProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-background/80">
      <AdminHeader onLogout={onLogout} />
      
      <main className="flex-1 container mx-auto p-6 md:p-8">
        <div className="mb-8 text-center animate-fade-in">
          <h2 className="text-3xl font-bold tracking-tight">Daily Games Admin</h2>
          <p className="text-muted-foreground mt-2">
            Create and manage daily game questions for your users
          </p>
        </div>
        
        <DashboardNav />
      </main>
      
      <footer className="py-6 text-center text-sm text-muted-foreground border-t border-border">
        <p>© {new Date().getFullYear()} Milo Daily Games Admin Panel</p>
      </footer>
    </div>
  );
};

export default AdminDashboard;
