import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trophy } from 'lucide-react';

interface NotificationBadgeProps {
  title: string;
  description: string;
  type: 'badge' | 'achievement' | 'milestone';
  date: Date;
  icon?: React.ReactNode;
}

export const NotificationBadge: React.FC<NotificationBadgeProps> = ({
  title,
  description,
  type,
  date,
  icon = <Trophy className="h-4 w-4" />
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Badge 
            variant="secondary" 
            className="cursor-pointer flex items-center gap-2 px-4 py-2"
          >
            {icon}
            <span>{title}</span>
          </Badge>
        </motion.div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {icon}
            {title}
          </DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>
        <div className="text-sm text-muted-foreground">
          Earned on {date.toLocaleDateString()}
        </div>
      </DialogContent>
    </Dialog>
  );
}; 