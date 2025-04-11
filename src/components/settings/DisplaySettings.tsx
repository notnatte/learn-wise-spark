
import React from 'react';
import { Globe, Moon, Sun } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface DisplaySettingsProps {
  preferences: {
    darkMode: boolean;
    offlineMode: boolean;
  };
  textSize: number;
  handlePreferenceChange: (key: 'darkMode' | 'newsletter' | 'autoPlay' | 'offlineMode') => void;
  handleTextSizeChange: (value: number[]) => void;
  handleSavePreferences: () => void;
}

const DisplaySettings = ({
  preferences,
  textSize,
  handlePreferenceChange,
  handleTextSizeChange,
  handleSavePreferences
}: DisplaySettingsProps) => {
  return (
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
  );
};

export default DisplaySettings;
