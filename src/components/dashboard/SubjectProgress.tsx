import React from 'react';
import { motion } from 'framer-motion';
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SubjectProgressProps {
  subject: string;
  progress: number;
  lastUpdated: Date;
  color: string;
}

export const SubjectProgress: React.FC<SubjectProgressProps> = ({
  subject,
  progress,
  lastUpdated,
  color
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="hover:shadow-lg transition-shadow duration-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {subject}
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            {progress}%
          </Badge>
        </CardHeader>
        <CardContent>
          <Progress 
            value={progress} 
            className="h-2"
            style={{ 
              '--progress-background': color,
              '--progress-foreground': color 
            } as React.CSSProperties}
          />
          <p className="text-xs text-muted-foreground mt-2">
            Last updated: {lastUpdated.toLocaleDateString()}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}; 