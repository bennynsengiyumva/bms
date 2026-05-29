'use client';

import { useState } from 'react';
import { Header, Footer, Sidebar } from '@/components/layout';
import { useAuth } from '@/components/auth/AuthProvider';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header 
        isAuthenticated={isAuthenticated}
        userName={user?.fullName || 'User'}
        userRole={user?.role}
      />
      
      <div className="flex">
        <Sidebar 
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          userRole={user?.role}
        />
        
        <main className="flex-1 p-4 md:p-6 lg:p-8 ml-0 md:ml-64 mt-16">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
      
      <Footer version="1.0.0" />
    </div>
  );
}
