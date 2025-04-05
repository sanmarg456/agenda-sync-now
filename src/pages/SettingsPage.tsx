
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Bell, Moon, Sun, Trash2, User } from 'lucide-react';

export default function SettingsPage() {
  const { toast } = useToast();
  
  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated",
    });
  };
  
  const handleClearData = () => {
    toast({
      title: "Data cleared",
      description: "All your data has been cleared successfully",
      variant: "destructive",
    });
  };
  
  return (
    <div className="container mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Account
          </CardTitle>
          <CardDescription>
            Manage your account settings and preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Profile</h3>
              <p className="text-sm text-muted-foreground">
                You are currently using a guest account
              </p>
            </div>
            <Button>Sign In</Button>
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Clear Data</h3>
              <p className="text-sm text-muted-foreground">
                Delete all your tasks, events, and settings
              </p>
            </div>
            <Button variant="destructive" onClick={handleClearData}>
              <Trash2 className="h-4 w-4 mr-2" />
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
          <CardDescription>
            Configure how and when you receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="task-reminders">Task Reminders</Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications for upcoming tasks
              </p>
            </div>
            <Switch id="task-reminders" defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="event-reminders">Event Reminders</Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications for upcoming events
              </p>
            </div>
            <Switch id="event-reminders" defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="daily-planner">Daily Planner</Label>
              <p className="text-sm text-muted-foreground">
                Show daily planner notification each morning
              </p>
            </div>
            <Switch id="daily-planner" defaultChecked />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sun className="h-5 w-5" />
            Appearance
          </CardTitle>
          <CardDescription>
            Customize how the app looks and feels
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="dark-mode">Dark Mode</Label>
              <p className="text-sm text-muted-foreground">
                Switch between light and dark theme
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Sun className="h-4 w-4 text-muted-foreground" />
              <Switch id="dark-mode" />
              <Moon className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-end">
        <Button onClick={handleSave}>Save Settings</Button>
      </div>
    </div>
  );
}
