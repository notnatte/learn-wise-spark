
import React from 'react';
import { Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface FeedbackSupportProps {
  handleFeedbackSubmit: (e: React.FormEvent) => void;
}

const FeedbackSupport = ({ handleFeedbackSubmit }: FeedbackSupportProps) => {
  return (
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
  );
};

export default FeedbackSupport;
