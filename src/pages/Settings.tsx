
import React, { useState } from 'react';
import { toast } from 'sonner';

// Import the smaller component files
import NotificationSettings from '@/components/settings/NotificationSettings';
import DisplaySettings from '@/components/settings/DisplaySettings';
import PrivacySettings from '@/components/settings/PrivacySettings';
import CommunicationSettings from '@/components/settings/CommunicationSettings';
import DownloadData from '@/components/settings/DownloadData';
import FeedbackSupport from '@/components/settings/FeedbackSupport';
import { Button } from '@/components/ui/button';

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
    offlineMode: false
  });

  const [textSize, setTextSize] = useState(100);
  
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
    } else if (key === 'offlineMode') {
      toast.success(`Offline mode ${!preferences.offlineMode ? 'enabled' : 'disabled'}`);
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
    // Reset logic would go here
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
          handleNotificationChange={handleNotificationChange}
          handleSaveNotifications={handleSaveNotifications}
        />
        
        <DisplaySettings 
          preferences={preferences}
          textSize={textSize}
          handlePreferenceChange={handlePreferenceChange}
          handleTextSizeChange={handleTextSizeChange}
          handleSavePreferences={handleSavePreferences}
        />
        
        <PrivacySettings />
        
        <CommunicationSettings 
          preferences={preferences}
          handlePreferenceChange={handlePreferenceChange}
        />
      </div>
      
      <DownloadData />
      
      <FeedbackSupport handleFeedbackSubmit={handleFeedbackSubmit} />
      
      <div className="flex justify-end gap-3 pb-10 md:pb-0">
        <Button variant="outline" size="lg" onClick={handleResetDefaults}>Reset to Defaults</Button>
        <Button size="lg" onClick={handleSaveAll}>Save All Settings</Button>
      </div>
    </div>
  );
};

export default Settings;
