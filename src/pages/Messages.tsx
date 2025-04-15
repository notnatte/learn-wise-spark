
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
  {
    id: 4,
    name: 'Prof. Garcia',
    role: 'Literature Professor',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    lastMessage: 'Your essay analysis was excellent!',
    time: '2:45 PM',
    unread: true,
  },
  {
    id: 5,
    name: 'Mr. Wilson',
    role: 'History Teacher',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    lastMessage: 'Don\'t forget about the museum trip next week',
    time: 'Yesterday',
    unread: false,
  },
  {
    id: 6,
    name: 'Robotics Club',
    role: 'Group Chat',
    avatar: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=100&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    lastMessage: 'Alex: I found the parts we need for the project',
    time: 'May 5',
    unread: false,
  },
];

// Message conversations for each contact
const conversationsByContact = {
  1: [
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
    {
      id: 6,
      sender: 'other',
      text: 'Exactly! For a cylindrical tank, V = πr²h. If the water is being drained, dV/dt is negative. You need to find dh/dt.',
      time: '10:32 AM',
    },
    {
      id: 7,
      sender: 'self',
      text: 'I see! And since the radius is constant, I can differentiate with respect to time to get dV/dt = πr² · dh/dt',
      time: '10:35 AM',
      status: 'read',
    },
    {
      id: 8,
      sender: 'other',
      text: 'Perfect! Now you can solve for dh/dt using the given value of dV/dt. You\'re getting the hang of it!',
      time: '10:37 AM',
    },
  ],
  2: [
    {
      id: 1,
      sender: 'self',
      text: 'Dr. Thompson, I\'m confused about the lab results from yesterday\'s experiment on pendulum motion.',
      time: '9:00 AM',
      status: 'read',
    },
    {
      id: 2,
      sender: 'other',
      text: 'What specifically is confusing you, Liya?',
      time: '9:05 AM',
    },
    {
      id: 3,
      sender: 'self',
      text: 'Our calculated period doesn\'t match the theoretical value. We got 2.1 seconds but the formula gives 1.95 seconds.',
      time: '9:07 AM',
      status: 'read',
    },
    {
      id: 4,
      sender: 'other',
      text: 'Good observation. Remember that the simple pendulum formula T = 2π√(L/g) is an approximation that works best for small angles.',
      time: '9:10 AM',
    },
    {
      id: 5,
      sender: 'other',
      text: 'What was the initial angle of displacement in your experiment?',
      time: '9:11 AM',
    },
    {
      id: 6,
      sender: 'self',
      text: 'We used 15 degrees. Is that too large?',
      time: '9:13 AM',
      status: 'read',
    },
    {
      id: 7,
      sender: 'other',
      text: 'That\'s getting into the range where the small-angle approximation starts to break down. For larger angles, you need to use the complete elliptic integral formula or the series approximation.',
      time: '9:15 AM',
    },
    {
      id: 8,
      sender: 'other',
      text: 'Try calculating it with T = 2π√(L/g) · (1 + (1/16)·sin²(θ/2) + ...) for better accuracy.',
      time: '9:16 AM',
    },
    {
      id: 9,
      sender: 'self',
      text: 'That makes sense! I\'ll recalculate and see if it matches better. Thanks!',
      time: 'Yesterday',
      status: 'read',
    },
  ],
  3: [
    {
      id: 1,
      sender: 'other',
      text: 'Makda: Hey everyone! Are we meeting tomorrow for the study session?',
      time: 'May 3, 3:30 PM',
    },
    {
      id: 2,
      sender: 'other',
      text: 'Jamal: I can make it. Same time at the library?',
      time: 'May 3, 3:32 PM',
    },
    {
      id: 3,
      sender: 'self',
      text: 'I\'ll be there! Can we focus on the acid-base equilibrium problems?',
      time: 'May 3, 3:35 PM',
      status: 'read',
    },
    {
      id: 4,
      sender: 'other',
      text: 'Makda: Definitely. I\'m struggling with those too.',
      time: 'May 3, 3:36 PM',
    },
    {
      id: 5,
      sender: 'other',
      text: 'Sofia: I found some great practice problems online. I\'ll bring them tomorrow.',
      time: 'May 3, 3:40 PM',
    },
    {
      id: 6,
      sender: 'other',
      text: 'Jamal: Can we also go over the lab report format? It\'s due next week.',
      time: 'May 3, 3:45 PM',
    },
    {
      id: 7,
      sender: 'self',
      text: 'Good idea. I have the rubric from last semester that might help.',
      time: 'May 3, 3:47 PM',
      status: 'read',
    },
    {
      id: 8,
      sender: 'other',
      text: 'Makda: Perfect! See everyone at 4 PM tomorrow then.',
      time: 'May 3, 3:50 PM',
    },
  ],
  4: [
    {
      id: 1,
      sender: 'other',
      text: 'Liya, I just finished reading your analysis of "The Great Gatsby." Your interpretation of the symbolism was excellent!',
      time: '2:30 PM',
    },
    {
      id: 2,
      sender: 'self',
      text: 'Thank you, Professor Garcia! I spent a lot of time on that essay.',
      time: '2:35 PM',
      status: 'read',
    },
    {
      id: 3,
      sender: 'other',
      text: 'It shows. Your connection between the green light and Gatsby\'s idealized version of the American Dream was particularly insightful.',
      time: '2:37 PM',
    },
    {
      id: 4,
      sender: 'other',
      text: 'Have you considered submitting it to the student literary journal?',
      time: '2:38 PM',
    },
    {
      id: 5,
      sender: 'self',
      text: 'I hadn\'t thought about that. Do you really think it\'s good enough?',
      time: '2:40 PM',
      status: 'read',
    },
    {
      id: 6,
      sender: 'other',
      text: 'Absolutely. With some minor revisions, it could be an excellent submission. The deadline is in two weeks.',
      time: '2:42 PM',
    },
    {
      id: 7,
      sender: 'self',
      text: 'I\'d love to work on it more. What specific areas do you think I should expand on?',
      time: '2:45 PM',
      status: 'sent',
    },
  ],
  5: [
    {
      id: 1,
      sender: 'other',
      text: 'Good afternoon class! Just a reminder about our museum trip next Wednesday to the Ancient Civilizations exhibit.',
      time: 'Yesterday, 1:15 PM',
    },
    {
      id: 2,
      sender: 'self',
      text: 'Mr. Wilson, what time should we arrive at school for the trip?',
      time: 'Yesterday, 1:20 PM',
      status: 'read',
    },
    {
      id: 3,
      sender: 'other',
      text: 'Please be at the school by 8:30 AM sharp. The bus leaves at 8:45 AM and we can\'t wait for latecomers.',
      time: 'Yesterday, 1:22 PM',
    },
    {
      id: 4,
      sender: 'self',
      text: 'Got it. And do we need to bring anything specific for the assignment?',
      time: 'Yesterday, 1:25 PM',
      status: 'read',
    },
    {
      id: 5,
      sender: 'other',
      text: 'Bring your notebook, a pen, and your worksheet that I handed out yesterday. You\'ll be completing it as we tour the exhibit.',
      time: 'Yesterday, 1:27 PM',
    },
    {
      id: 6,
      sender: 'other',
      text: 'Also, don\'t forget to bring lunch or money to buy food at the museum café.',
      time: 'Yesterday, 1:28 PM',
    },
    {
      id: 7,
      sender: 'self',
      text: 'Perfect, thanks! I\'m looking forward to seeing the Mesopotamian artifacts we discussed in class.',
      time: 'Yesterday, 1:30 PM',
      status: 'read',
    },
    {
      id: 8,
      sender: 'other',
      text: 'They have an excellent collection! Make sure to pay special attention to the cuneiform tablets - they\'ll be featured in your final project.',
      time: 'Yesterday, 1:35 PM',
    },
  ],
  6: [
    {
      id: 1,
      sender: 'other',
      text: 'Alex: Hey team! I found the servo motors we need for the robot arm project.',
      time: 'May 5, 10:00 AM',
    },
    {
      id: 2,
      sender: 'other',
      text: 'Mia: Great! How much do they cost? We need to stay within budget.',
      time: 'May 5, 10:05 AM',
    },
    {
      id: 3,
      sender: 'other',
      text: 'Alex: $45 for all three. That leaves us $80 for the rest of the components.',
      time: 'May 5, 10:07 AM',
    },
    {
      id: 4,
      sender: 'self',
      text: 'That sounds good. What about the microcontroller? Are we still using Arduino or switching to Raspberry Pi?',
      time: 'May 5, 10:10 AM',
      status: 'read',
    },
    {
      id: 5,
      sender: 'other',
      text: 'Jordan: I vote for Arduino. It\'s simpler for this project and we already have the code libraries.',
      time: 'May 5, 10:12 AM',
    },
    {
      id: 6,
      sender: 'other',
      text: 'Alex: Agreed. Plus we have a spare Arduino Uno in the lab we can use.',
      time: 'May 5, 10:15 AM',
    },
    {
      id: 7,
      sender: 'self',
      text: 'Perfect. I can work on the arm design this weekend if someone else handles the base.',
      time: 'May 5, 10:17 AM',
      status: 'read',
    },
    {
      id: 8,
      sender: 'other',
      text: 'Mia: I\'ll design the base. Let\'s meet on Monday to start assembly.',
      time: 'May 5, 10:20 AM',
    },
    {
      id: 9,
      sender: 'other',
      text: 'Jordan: Don\'t forget we need to present this at the science fair in three weeks!',
      time: 'May 5, 10:25 AM',
    },
    {
      id: 10,
      sender: 'self',
      text: 'We\'re on track. I\'ll also prepare some slides explaining the project for our presentation.',
      time: 'May 5, 10:30 AM',
      status: 'read',
    },
  ],
};

const Messages = () => {
  const [contacts] = useState(initialContacts);
  const [selectedContact, setSelectedContact] = useState(contacts[0]);
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState(conversationsByContact[1]);
  
  const handleContactSelect = (contact) => {
    setSelectedContact(contact);
    setMessages(conversationsByContact[contact.id]);
  };
  
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
                onClick={() => handleContactSelect(contact)}
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
                  {selectedContact.id === 4 && (
                    <Badge className="bg-yellow-100 text-yellow-700">Literature</Badge>
                  )}
                  {selectedContact.id === 5 && (
                    <Badge className="bg-red-100 text-red-700">History</Badge>
                  )}
                  {selectedContact.id === 6 && (
                    <Badge className="bg-indigo-100 text-indigo-700">Robotics</Badge>
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
