
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Download, Eye, Calendar, User, Building, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/ThemeProvider';
import NotificationSettings from '@/components/settings/NotificationSettings';
import DisplaySettings from '@/components/settings/DisplaySettings';
import PrivacySettings from '@/components/settings/PrivacySettings';
import CommunicationSettings from '@/components/settings/CommunicationSettings';

const Settings = () => {
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    messages: true,
    updates: false,
  });
  
  const [preferences, setPreferences] = useState({
    darkMode: theme === 'dark',
    newsletter: true,
    autoPlay: false,
    offlineMode: false
  });

  const [textSize, setTextSize] = useState(100);
  
  // Update darkMode preference when theme changes
  useEffect(() => {
    setPreferences(prev => ({
      ...prev,
      darkMode: theme === 'dark'
    }));
  }, [theme]);

  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };
  
  const handlePreferenceChange = (key: keyof typeof preferences) => {
    if (key === 'darkMode') {
      const newDarkMode = !preferences.darkMode;
      setPreferences(prev => ({
        ...prev,
        darkMode: newDarkMode
      }));
      setTheme(newDarkMode ? 'dark' : 'light');
      toast.success(`${newDarkMode ? 'Dark' : 'Light'} mode activated`);
    } else {
      setPreferences(prev => ({
        ...prev,
        [key]: !prev[key]
      }));
      
      if (key === 'offlineMode') {
        toast.success(`Offline mode ${!preferences.offlineMode ? 'enabled' : 'disabled'}`);
      }
    }
  };
  
  const handleTextSizeChange = (value: number[]) => {
    setTextSize(value[0]);
  };
  
  const handleSaveNotifications = () => {
    toast.success("Notification settings saved");
  };
  
  const handleSavePreferences = () => {
    toast.success("Preferences saved");
  };
  
  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Feedback submitted. Thank you!");
  };

  const handleSaveAll = () => {
    toast.success("All settings saved successfully!");
  };

  const handleResetDefaults = () => {
    toast.success("Settings reset to defaults");
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your learning preferences</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <NotificationSettings 
          notifications={notifications}
          onNotificationChange={handleNotificationChange}
          onSave={handleSaveNotifications}
        />
        
        <DisplaySettings 
          preferences={preferences}
          textSize={textSize}
          onPreferenceChange={handlePreferenceChange}
          onTextSizeChange={handleTextSizeChange}
          onSave={handleSavePreferences}
        />
        
        <PrivacySettings />
        
        <CommunicationSettings 
          preferences={preferences}
          onPreferenceChange={handlePreferenceChange}
        />
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Download className="mr-2 h-5 w-5" />
            Download Learning Data
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">Download a copy of your learning data and activity</p>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Study History
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profile Data
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              Course Materials
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              AI Tutor Chats
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-muted/50 border-dashed">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Eye className="mr-2 h-5 w-5" />
            Feedback & Support
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleFeedbackSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="feedback">Send us your feedback or report an issue</Label>
              <textarea 
                id="feedback" 
                className="w-full min-h-[100px] p-3 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Tell us how we can improve your learning experience..."
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button type="submit" className="flex-1">Submit Feedback</Button>
              <Button variant="outline" className="flex-1" type="button">Contact Support</Button>
            </div>
            <p className="text-xs text-muted-foreground text-center mt-2">
              We value your privacy. View our <a href="#" className="underline">privacy policy</a> to learn how we protect your data.
            </p>
          </form>
        </CardContent>
      </Card>
      
      <div className="flex justify-end gap-3 pb-10 md:pb-0">
        <Button variant="outline" size="lg" onClick={handleResetDefaults}>Reset to Defaults</Button>
        <Button size="lg" onClick={handleSaveAll}>Save All Settings</Button>
      </div>
    </div>
  );
};

export default Settings;
