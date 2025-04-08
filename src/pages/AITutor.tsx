
import React, { useState } from 'react';
import { Send, User, Bot, Mic, Plus, Paperclip, Book, Play, Info } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const subjects = [
  { value: 'math', label: 'Mathematics' },
  { value: 'physics', label: 'Physics' },
  { value: 'chemistry', label: 'Chemistry' },
  { value: 'biology', label: 'Biology' },
  { value: 'literature', label: 'Literature' },
];

interface Message {
  id: number;
  sender: 'user' | 'ai';
  text: string;
  time: string;
  subject?: string;
}

const initialMessages: Message[] = [
  {
    id: 1,
    sender: 'ai',
    text: "Hi Liya! I'm your AI tutor. How can I help you with your studies today?",
    time: '10:00 AM',
  },
];

const AITutor = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const [subject, setSubject] = useState<string | undefined>();
  const [isTyping, setIsTyping] = useState(false);
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    // Add user message
    const userMsg: Message = {
      id: messages.length + 1,
      sender: 'user',
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
      subject,
    };
    
    setMessages([...messages, userMsg]);
    setNewMessage('');
    setIsTyping(true);
    
    // Simulate AI response after a delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: messages.length + 2,
        sender: 'ai',
        text: getAIResponse(newMessage, subject),
        time: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
        subject,
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };
  
  const getAIResponse = (message: string, subject?: string): string => {
    // Simple mock responses based on subject and keywords
    if (subject === 'math') {
      if (message.toLowerCase().includes('equation')) {
        return "To solve equations, remember to isolate the variable. For example, with 2x + 3 = 7, subtract 3 from both sides to get 2x = 4, then divide by 2 to get x = 2. Would you like to practice with some examples?";
      }
      return "Mathematics is all about patterns and problem-solving. What specific topic would you like to work on? Algebra, geometry, calculus, or something else?";
    }
    
    if (subject === 'physics') {
      return "Physics helps us understand the fundamental laws of the universe. I can help with mechanics, thermodynamics, electricity, or quantum physics. What would you like to learn today?";
    }
    
    if (subject === 'chemistry') {
      return "Chemistry is fascinating! We can discuss atomic structure, chemical bonding, reactions, or any other topic you're studying. What specific concept are you working on?";
    }
    
    // Default response if no specific triggers are matched
    return "That's an interesting question! Would you like me to explain this concept in more detail or provide some practice problems to solidify your understanding?";
  };
  
  const rateResponse = (helpful: boolean) => {
    const message = helpful ? "I'm glad that was helpful!" : "I'll try to provide a better answer next time.";
    
    const feedbackMsg: Message = {
      id: messages.length + 1,
      sender: 'ai',
      text: message,
      time: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
    };
    
    setMessages([...messages, feedbackMsg]);
  };
  
  return (
    <div className="h-[calc(100vh-10rem)] flex flex-col animate-fade-in">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">AI Tutor</h1>
        <p className="text-muted-foreground mt-1">Your personal learning assistant</p>
      </div>
      
      <Card className="flex-1 flex flex-col overflow-hidden">
        <CardContent className="flex-1 flex flex-col p-0">
          <div className="flex items-center gap-3 p-4 border-b">
            <Select value={subject} onValueChange={setSubject}>
              <SelectTrigger className="w-40 md:w-52">
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((subject) => (
                  <SelectItem key={subject.value} value={subject.value}>
                    {subject.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <div className="hidden md:flex gap-2 ml-auto">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Book className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Learning Resources</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Play className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Practice Exercises</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Info className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Help & Tutorial</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div 
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.sender === 'ai' && (
                  <div className="w-8 h-8 rounded-full overflow-hidden mr-2 mt-1 bg-primary/10 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                )}
                
                <div className="max-w-[80%]">
                  <div 
                    className={`p-3 rounded-lg ${
                      message.sender === 'user' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted'
                    }`}
                  >
                    {message.subject && (
                      <div className="text-xs font-medium mb-1 opacity-70">
                        {subjects.find(s => s.value === message.subject)?.label || message.subject}
                      </div>
                    )}
                    <p className="whitespace-pre-wrap">{message.text}</p>
                    
                    {message.sender === 'ai' && message.id !== 1 && message.text !== "I'm glad that was helpful!" && message.text !== "I'll try to provide a better answer next time." && (
                      <div className="flex gap-2 mt-2 justify-end">
                        <Button variant="ghost" size="sm" className="h-6 text-xs px-2 hover:bg-green-100" onClick={() => rateResponse(true)}>
                          Helpful
                        </Button>
                        <Button variant="ghost" size="sm" className="h-6 text-xs px-2 hover:bg-red-100" onClick={() => rateResponse(false)}>
                          Not helpful
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center mt-1 ml-1">
                    <span className="text-xs text-muted-foreground">{message.time}</span>
                  </div>
                </div>
                
                {message.sender === 'user' && (
                  <div className="w-8 h-8 rounded-full overflow-hidden ml-2 mt-1 bg-accent/10 flex items-center justify-center">
                    <User className="h-4 w-4 text-accent" />
                  </div>
                )}
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="w-8 h-8 rounded-full overflow-hidden mr-2 mt-1 bg-primary/10 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
                <div className="max-w-[80%]">
                  <div className="p-3 rounded-lg bg-muted">
                    <div className="flex gap-1">
                      <span className="animate-bounce">●</span>
                      <span className="animate-bounce [animation-delay:0.2s]">●</span>
                      <span className="animate-bounce [animation-delay:0.4s]">●</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="p-4 border-t">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <Button type="button" variant="ghost" size="icon" className="flex-shrink-0">
                <Paperclip className="h-4 w-4" />
              </Button>
              
              <div className="relative w-full">
                <Input
                  placeholder="Ask anything about your studies..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="pr-10"
                />
                <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0 h-full">
                  <Mic className="h-4 w-4" />
                </Button>
              </div>
              
              <Button type="submit" size="icon" className="flex-shrink-0" disabled={!newMessage.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AITutor;
