
import React from 'react';
import { Bell } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface NotificationSettingsProps {
  notifications: {
    email: boolean;
    push: boolean;
    messages: boolean;
    updates: boolean;
  };
  onNotificationChange: (key: 'email' | 'push' | 'messages' | 'updates') => void;
  onSave: () => void;
}

const NotificationSettings = ({
  notifications,
  onNotificationChange,
  onSave
}: NotificationSettingsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Bell className="mr-2 h-5 w-5" />
          Notification Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base">Email Notifications</Label>
            <p className="text-sm text-muted-foreground">Receive emails about new lessons and updates</p>
          </div>
          <Switch 
            checked={notifications.email} 
            onCheckedChange={() => onNotificationChange('email')} 
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base">Push Notifications</Label>
            <p className="text-sm text-muted-foreground">Receive push notifications for AI tutor responses</p>
          </div>
          <Switch 
            checked={notifications.push} 
            onCheckedChange={() => onNotificationChange('push')} 
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base">Learning Reminders</Label>
            <p className="text-sm text-muted-foreground">Get reminded about daily learning goals</p>
          </div>
          <Switch 
            checked={notifications.messages} 
            onCheckedChange={() => onNotificationChange('messages')} 
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base">Updates & Announcements</Label>
            <p className="text-sm text-muted-foreground">Hear about new features and educational content</p>
          </div>
          <Switch 
            checked={notifications.updates} 
            onCheckedChange={() => onNotificationChange('updates')} 
          />
        </div>
        
        <Button onClick={onSave} className="w-full">Save Notification Settings</Button>
      </CardContent>
    </Card>
  );
};

export default NotificationSettings;
