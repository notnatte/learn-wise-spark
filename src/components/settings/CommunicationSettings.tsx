
import React from 'react';
import { Mail } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

interface CommunicationSettingsProps {
  preferences: {
    newsletter: boolean;
  };
  onPreferenceChange: (key: 'newsletter') => void;
}

const CommunicationSettings = ({
  preferences,
  onPreferenceChange,
}: CommunicationSettingsProps) => {
  return (
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
            onCheckedChange={() => onPreferenceChange('newsletter')} 
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default CommunicationSettings;
