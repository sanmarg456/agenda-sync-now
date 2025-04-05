
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Calendar, 
  CheckSquare, 
  Clock, 
  Settings, 
  Sun 
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from '@/components/ui/sidebar';

const menuItems = [
  {
    title: 'Tasks',
    path: '/',
    icon: CheckSquare,
  },
  {
    title: 'Calendar',
    path: '/calendar',
    icon: Calendar,
  },
  {
    title: 'Daily Planner',
    path: '/planner',
    icon: Sun,
  },
  {
    title: 'Reminders',
    path: '/reminders',
    icon: Clock,
  },
  {
    title: 'Settings',
    path: '/settings',
    icon: Settings,
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-md bg-app-indigo"></div>
          <h1 className="text-xl font-bold">Agenda Sync</h1>
        </div>
        <SidebarTrigger className="ml-auto" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.path}>
              <SidebarMenuButton asChild>
                <NavLink 
                  to={item.path}
                  className={({ isActive }) => 
                    isActive ? 'text-primary font-medium' : 'text-foreground'
                  }
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-muted"></div>
          <div>
            <p className="text-sm font-medium">Guest User</p>
            <p className="text-xs text-muted-foreground">Sign in to sync</p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
