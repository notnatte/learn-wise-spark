
import React, { useState } from 'react';
import { toast } from 'sonner';
import { 
  Bell, 
  Globe, 
  Moon, 
  Sun, 
  Lock, 
  Mail, 
  Download, 
  Eye 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
        {/* Notification Settings */}
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
                onCheckedChange={() => handleNotificationChange('email')} 
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Push Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive push notifications for AI tutor responses</p>
              </div>
              <Switch 
                checked={notifications.push} 
                onCheckedChange={() => handleNotificationChange('push')} 
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Learning Reminders</Label>
                <p className="text-sm text-muted-foreground">Get reminded about daily learning goals</p>
              </div>
              <Switch 
                checked={notifications.messages} 
                onCheckedChange={() => handleNotificationChange('messages')} 
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Updates & Announcements</Label>
                <p className="text-sm text-muted-foreground">Hear about new features and educational content</p>
              </div>
              <Switch 
                checked={notifications.updates} 
                onCheckedChange={() => handleNotificationChange('updates')} 
              />
            </div>
            
            <Button onClick={handleSaveNotifications} className="w-full">Save Notification Settings</Button>
          </CardContent>
        </Card>
        
        {/* Display Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Globe className="mr-2 h-5 w-5" />
              Display & Accessibility
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Dark Mode</Label>
                <p className="text-sm text-muted-foreground">Toggle between light and dark theme</p>
              </div>
              <div className="flex items-center">
                <Sun className="h-4 w-4 mr-2 text-muted-foreground" />
                <Switch 
                  checked={preferences.darkMode} 
                  onCheckedChange={() => handlePreferenceChange('darkMode')} 
                />
                <Moon className="h-4 w-4 ml-2 text-muted-foreground" />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label className="text-base">Text Size</Label>
                <span className="text-sm text-muted-foreground">{textSize}%</span>
              </div>
              <Slider 
                defaultValue={[textSize]} 
                max={150} 
                min={75} 
                step={5}
                onValueChange={handleTextSizeChange}
                className="mt-2" 
              />
              <p className="text-sm text-muted-foreground">Adjust the size of text for better readability</p>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Language</Label>
                <p className="text-sm text-muted-foreground">Change your preferred language</p>
              </div>
              <Select defaultValue="en">
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="de">Deutsch</SelectItem>
                  <SelectItem value="am">አማርኛ</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Offline Learning</Label>
                <p className="text-sm text-muted-foreground">Download lessons for offline studying</p>
              </div>
              <Switch 
                checked={preferences.offlineMode} 
                onCheckedChange={() => handlePreferenceChange('offlineMode')} 
              />
            </div>
            
            <Button onClick={handleSavePreferences} className="w-full">Save Display Settings</Button>
          </CardContent>
        </Card>
        
        {/* Privacy Settings */}
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
                <Label className="text-base">Study Devices</Label>
                <p className="text-sm text-muted-foreground">Manage devices that have access to your account</p>
              </div>
              <Button variant="outline" size="sm">Manage</Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Learning Data</Label>
                <p className="text-sm text-muted-foreground">Control how your learning data is used for personalization</p>
              </div>
              <Button variant="outline" size="sm">Configure</Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Privacy Dashboard</Label>
                <p className="text-sm text-muted-foreground">Review and manage your privacy settings</p>
              </div>
              <Button variant="outline" size="sm">View</Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Communication Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Mail className="mr-2 h-5 w-5" />
              Communication Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Primary Email</Label>
                <p className="text-sm text-muted-foreground">liya.tesfaye@example.com</p>
              </div>
              <Button variant="outline" size="sm">Change</Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Email Format</Label>
                <p className="text-sm text-muted-foreground">HTML or plain text emails</p>
              </div>
              <Select defaultValue="html">
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="html">HTML</SelectItem>
                  <SelectItem value="text">Plain Text</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Learning Summaries</Label>
                <p className="text-sm text-muted-foreground">How often you receive learning progress emails</p>
              </div>
              <Select defaultValue="daily">
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="immediate">Daily</SelectItem>
                  <SelectItem value="daily">Weekly</SelectItem>
                  <SelectItem value="weekly">Biweekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Educational Newsletter</Label>
                <p className="text-sm text-muted-foreground">Receive our weekly educational newsletter</p>
              </div>
              <Switch 
                checked={preferences.newsletter} 
                onCheckedChange={() => handlePreferenceChange('newsletter')} 
              />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Download Data */}
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
      
      {/* Feedback & Support */}
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
