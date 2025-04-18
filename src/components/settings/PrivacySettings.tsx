
import React from 'react';
import { Lock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

const PrivacySettings = () => {
  return (
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
  );
};

export default PrivacySettings;
