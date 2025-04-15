
import React, { useState } from 'react';
import { Search, Send, User, Check, Clock, GraduationCap, BookOpen } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

const initialContacts = [
  {
    id: 1,
    name: 'Ms. Johnson',
    role: 'Math Teacher',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    lastMessage: 'How is your calculus homework coming along?',
    time: '10:30 AM',
    unread: true,
  },
  {
    id: 2,
    name: 'Dr. Thompson',
    role: 'Physics Tutor',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    lastMessage: 'Let me know if you have questions about the lab',
    time: 'Yesterday',
    unread: false,
  },
  {
    id: 3,
    name: 'Chemistry Study Group',
    role: 'Group Chat',
    avatar: 'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=100&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    lastMessage: 'Makda: Are we meeting tomorrow for study session?',
    time: 'May 3',
    unread: false,
  },
];

const initialMessages = [
  {
    id: 1,
    sender: 'other',
    text: 'Hi Liya! How is your calculus homework coming along?',
    time: '10:15 AM',
  },
  {
    id: 2,
    sender: 'other',
    text: 'Remember to use the chain rule for those differentiation problems.',
    time: '10:16 AM',
  },
  {
    id: 3,
    sender: 'self',
    text: 'Hi Ms. Johnson! I\'m working on it now. I\'m having some trouble with problem #5 about related rates.',
    time: '10:20 AM',
    status: 'read',
  },
  {
    id: 4,
    sender: 'other',
    text: 'For related rates problems, try drawing a diagram first to visualize the relationships between variables. Then identify which quantities are changing with respect to time.',
    time: '10:25 AM',
  },
  {
    id: 5,
    sender: 'self',
    text: 'That helps! So for this problem about the water tank, I should start by writing the formula for the volume?',
    time: '10:30 AM',
    status: 'sent',
  },
];

const Messages = () => {
  const [contacts] = useState(initialContacts);
  const [messages] = useState(initialMessages);
  const [selectedContact, setSelectedContact] = useState(contacts[0]);
  const [newMessage, setNewMessage] = useState('');
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    // Here you would typically send the message to an API
    console.log('Sending message:', newMessage);
    setNewMessage('');
  };
  
  return (
    <div className="animate-fade-in h-[calc(100vh-10rem)]">
      <h1 className="text-3xl font-bold mb-6">Messages</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
        <Card className="md:col-span-1 overflow-hidden flex flex-col h-full">
          <div className="p-4">
            <div className="relative">
              <Input
                placeholder="Search conversations"
                className="pl-10"
              />
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            </div>
          </div>
          
          <div className="overflow-y-auto flex-1">
            {contacts.map((contact) => (
              <div 
                key={contact.id}
                className={`p-4 flex items-center gap-3 hover:bg-muted cursor-pointer ${selectedContact.id === contact.id ? 'bg-muted' : ''}`}
                onClick={() => setSelectedContact(contact)}
              >
                <div className="relative">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <img 
                      src={contact.avatar} 
                      alt={contact.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {contact.unread && (
                    <span className="absolute top-0 right-0 w-3 h-3 bg-primary rounded-full"></span>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between">
                    <h3 className="font-medium truncate">{contact.name}</h3>
                    <span className="text-xs text-muted-foreground">{contact.time}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{contact.role}</p>
                  <p className="text-sm text-muted-foreground truncate">{contact.lastMessage}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
        
        <Card className="md:col-span-2 flex flex-col h-full">
          {selectedContact ? (
            <>
              <div className="p-4 border-b flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    <img 
                      src={selectedContact.avatar} 
                      alt={selectedContact.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium">{selectedContact.name}</h3>
                    <p className="text-xs text-muted-foreground">{selectedContact.role}</p>
                  </div>
                </div>
                <div>
                  {selectedContact.id === 1 && (
                    <Badge className="bg-blue-100 text-blue-700">Mathematics</Badge>
                  )}
                  {selectedContact.id === 2 && (
                    <Badge className="bg-purple-100 text-purple-700">Physics</Badge>
                  )}
                  {selectedContact.id === 3 && (
                    <Badge className="bg-green-100 text-green-700">Chemistry</Badge>
                  )}
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div 
                    key={message.id}
                    className={`flex ${message.sender === 'self' ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.sender === 'other' && (
                      <div className="w-8 h-8 rounded-full overflow-hidden mr-2 mt-1">
                        <img 
                          src={selectedContact.avatar} 
                          alt={selectedContact.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    
                    <div className="max-w-[70%]">
                      <div 
                        className={`p-3 rounded-lg ${
                          message.sender === 'self' 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-muted'
                        }`}
                      >
                        <p>{message.text}</p>
                      </div>
                      
                      <div className="flex items-center mt-1">
                        <span className="text-xs text-muted-foreground">{message.time}</span>
                        
                        {message.sender === 'self' && message.status && (
                          <div className="ml-1 text-muted-foreground">
                            {message.status === 'read' ? (
                              <Check className="h-3 w-3" />
                            ) : (
                              <Clock className="h-3 w-3" />
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="p-4 border-t">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" size="icon">
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full flex-col p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <GraduationCap className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-medium mb-2">No Conversation Selected</h3>
              <p className="text-muted-foreground">Choose a conversation from the list to start messaging</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Messages;
