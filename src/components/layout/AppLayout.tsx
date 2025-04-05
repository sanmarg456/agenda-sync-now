
import React from 'react';
import { AppSidebar } from './AppSidebar';
import { Outlet } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';

export function AppLayout() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
}
