import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bot, User, GraduationCap } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  sender: {
    id: string;
    name: string;
    type: 'user' | 'ai' | 'teacher';
    avatar?: string;
  };
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read';
}

interface MessagesListProps {
  messages: Message[];
}

const getSenderIcon = (type: 'user' | 'ai' | 'teacher') => {
  switch (type) {
    case 'user':
      return <User className="h-4 w-4" />;
    case 'ai':
      return <Bot className="h-4 w-4" />;
    case 'teacher':
      return <GraduationCap className="h-4 w-4" />;
  }
};

const getSenderColor = (type: 'user' | 'ai' | 'teacher') => {
  switch (type) {
    case 'user':
      return 'bg-primary text-primary-foreground';
    case 'ai':
      return 'bg-blue-500 text-white';
    case 'teacher':
      return 'bg-green-500 text-white';
  }
};

export const MessagesList: React.FC<MessagesListProps> = ({ messages }) => {
  return (
    <div className="space-y-4">
      <AnimatePresence>
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`flex ${message.sender.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className="flex items-start gap-2 max-w-[80%]">
              {message.sender.type !== 'user' && (
                <Avatar className="h-8 w-8">
                  <AvatarImage src={message.sender.avatar} />
                  <AvatarFallback>
                    {getSenderIcon(message.sender.type)}
                  </AvatarFallback>
                </Avatar>
              )}
              <div className="space-y-1">
                <Card className={`${getSenderColor(message.sender.type)} p-3`}>
                  <CardContent className="p-0">
                    <p className="text-sm">{message.content}</p>
                  </CardContent>
                </Card>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{format(message.timestamp, 'HH:mm')}</span>
                  {message.sender.type === 'user' && (
                    <Badge variant="outline" className="text-xs">
                      {message.status}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}; 