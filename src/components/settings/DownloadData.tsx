
import React from 'react';
import { Download, Calendar, User, Building, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const DownloadData = () => {
  return (
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
  );
};

export default DownloadData;
