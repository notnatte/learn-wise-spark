
import React, { useState } from 'react';
import { Bell, Mail, Lock, Globe, Eye, Moon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const Settings = () => {
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    messages: true,
    updates: false,
  });
  
  const [preferences, setPreferences] = useState({
    darkMode: false,
    newsletter: true,
    autoPlay: false,
  });
  
  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };
  
  const handlePreferenceChange = (key: keyof typeof preferences) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    
    if (key === 'darkMode') {
      toast.success(`${!preferences.darkMode ? 'Dark' : 'Light'} mode activated`);
    }
  };
  
  const handleSaveNotifications = () => {
    toast.success("Notification settings saved");
  };
  
  const handleSavePreferences = () => {
    toast.success("Preferences saved");
  };
  
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account preferences</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <p className="text-sm text-muted-foreground">Receive emails about your account activity</p>
              </div>
              <Switch 
                checked={notifications.email} 
                onCheckedChange={() => handleNotificationChange('email')} 
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Push Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive push notifications on your device</p>
              </div>
              <Switch 
                checked={notifications.push} 
                onCheckedChange={() => handleNotificationChange('push')} 
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Message Notifications</Label>
                <p className="text-sm text-muted-foreground">Get notified when you receive messages</p>
              </div>
              <Switch 
                checked={notifications.messages} 
                onCheckedChange={() => handleNotificationChange('messages')} 
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Updates & Announcements</Label>
                <p className="text-sm text-muted-foreground">Hear about new features and updates</p>
              </div>
              <Switch 
                checked={notifications.updates} 
                onCheckedChange={() => handleNotificationChange('updates')} 
              />
            </div>
            
            <Button onClick={handleSaveNotifications} className="w-full">Save Notification Settings</Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Globe className="mr-2 h-5 w-5" />
              General Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Dark Mode</Label>
                <p className="text-sm text-muted-foreground">Toggle between light and dark theme</p>
              </div>
              <Switch 
                checked={preferences.darkMode} 
                onCheckedChange={() => handlePreferenceChange('darkMode')} 
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Newsletter</Label>
                <p className="text-sm text-muted-foreground">Receive our weekly newsletter</p>
              </div>
              <Switch 
                checked={preferences.newsletter} 
                onCheckedChange={() => handlePreferenceChange('newsletter')} 
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Auto-play Media</Label>
                <p className="text-sm text-muted-foreground">Automatically play videos and audio</p>
              </div>
              <Switch 
                checked={preferences.autoPlay} 
                onCheckedChange={() => handlePreferenceChange('autoPlay')} 
              />
            </div>
            
            <Button onClick={handleSavePreferences} className="w-full">Save Preferences</Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lock className="mr-2 h-5 w-5" />
              Privacy & Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Two-Factor Authentication</Label>
                <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
              </div>
              <Button variant="outline" size="sm">Enable</Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Connected Devices</Label>
                <p className="text-sm text-muted-foreground">Manage devices that have access to your account</p>
              </div>
              <Button variant="outline" size="sm">Manage</Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Data Sharing</Label>
                <p className="text-sm text-muted-foreground">Control how your data is used and shared</p>
              </div>
              <Button variant="outline" size="sm">Configure</Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Mail className="mr-2 h-5 w-5" />
              Email Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Primary Email</Label>
                <p className="text-sm text-muted-foreground">alex.johnson@example.com</p>
              </div>
              <Button variant="outline" size="sm">Change</Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Email Format</Label>
                <p className="text-sm text-muted-foreground">HTML or plain text emails</p>
              </div>
              <Button variant="outline" size="sm">HTML</Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Email Frequency</Label>
                <p className="text-sm text-muted-foreground">How often you receive emails</p>
              </div>
              <Button variant="outline" size="sm">Daily</Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="bg-muted/50 border-dashed">
        <CardContent className="flex flex-col items-center justify-center p-6 text-center">
          <Eye className="h-8 w-8 text-muted-foreground mb-2" />
          <h3 className="text-lg font-medium">Privacy Policy</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto my-2">
            We value your privacy. View our privacy policy to learn how we collect, use, and protect your personal information.
          </p>
          <Button variant="outline" className="mt-4">View Privacy Policy</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
