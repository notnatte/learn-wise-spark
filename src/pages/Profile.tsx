
import React, { useState } from 'react';
import { User, Mail, Lock, Camera, Book, Award, Rocket, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const badgeData = [
  { id: 1, name: '7-Day Streak', description: 'Completed 7 consecutive days of learning', icon: Clock, color: 'bg-blue-500' },
  { id: 2, name: 'Perfect Score', description: 'Scored 100% on a quiz', icon: Award, color: 'bg-yellow-500' },
  { id: 3, name: 'Favourite Subject', description: 'Consistently engaging with Mathematics', icon: Book, color: 'bg-red-500' },
];

const Profile = () => {
  const [formData, setFormData] = useState({
    name: 'Liya Tesfaye',
    email: 'liya.tesfaye@example.com',
    password: '',
    confirmPassword: '',
    grade: '11',
    favoriteSubject: 'math',
  });
  
  const [isEditing, setIsEditing] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password && formData.password !== formData.confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    
    toast.success("Profile updated successfully");
    setIsEditing(false);
  };
  
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">My Profile</h1>
        <p className="text-muted-foreground mt-1">Manage your student information</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-8 items-start sm:items-center">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                      <img 
                        src="https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&h=200&auto=format&fit=crop" 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <Button 
                      size="icon" 
                      className="absolute bottom-0 right-0 rounded-full" 
                      variant="secondary"
                      disabled={!isEditing}
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-medium text-lg">Profile Photo</h3>
                    <p className="text-sm text-muted-foreground">This will be displayed on your student profile</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="grid gap-4">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="pl-10"
                      />
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                  
                  <div className="grid gap-4">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="pl-10"
                      />
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="grade">Grade Level</Label>
                      <Select 
                        value={formData.grade} 
                        onValueChange={(value) => handleSelectChange('grade', value)}
                        disabled={!isEditing}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select grade" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="9">Grade 9</SelectItem>
                          <SelectItem value="10">Grade 10</SelectItem>
                          <SelectItem value="11">Grade 11</SelectItem>
                          <SelectItem value="12">Grade 12</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="favoriteSubject">Favorite Subject</Label>
                      <Select 
                        value={formData.favoriteSubject} 
                        onValueChange={(value) => handleSelectChange('favoriteSubject', value)}
                        disabled={!isEditing}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select subject" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="math">Mathematics</SelectItem>
                          <SelectItem value="physics">Physics</SelectItem>
                          <SelectItem value="chemistry">Chemistry</SelectItem>
                          <SelectItem value="biology">Biology</SelectItem>
                          <SelectItem value="literature">Literature</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  {isEditing && (
                    <>
                      <div className="grid gap-4">
                        <Label htmlFor="password">New Password</Label>
                        <div className="relative">
                          <Input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            className="pl-10"
                          />
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                      
                      <div className="grid gap-4">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <div className="relative">
                          <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            placeholder="••••••••"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="pl-10"
                          />
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                    </>
                  )}
                </div>
                
                <div className="flex justify-end gap-3">
                  {isEditing ? (
                    <>
                      <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                      <Button type="submit">Save Changes</Button>
                    </>
                  ) : (
                    <Button type="button" onClick={() => setIsEditing(true)}>Edit Profile</Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="mr-2 h-5 w-5" />
                Badges
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                {badgeData.map((badge) => (
                  <TooltipProvider key={badge.id}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex flex-col items-center hover-scale">
                          <div className={`w-12 h-12 ${badge.color} rounded-full flex items-center justify-center mb-2 badge-glow cursor-help`}>
                            <badge.icon className="h-6 w-6 text-white" />
                          </div>
                          <span className="text-xs font-medium text-center">{badge.name}</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{badge.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
              <div className="mt-4 text-center">
                <Button variant="outline" size="sm" onClick={() => window.location.href = '/progress'}>
                  View All Badges
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Book className="mr-2 h-5 w-5" />
                Learning Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Lessons Completed</span>
                <Badge variant="outline">24</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Quizzes Taken</span>
                <Badge variant="outline">16</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Average Score</span>
                <Badge variant="outline">85%</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Study Streak</span>
                <Badge className="bg-blue-500">8 days</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Learning Time</span>
                <Badge variant="outline">14.5 hrs</Badge>
              </div>
              <div className="mt-4 text-center">
                <Button variant="outline" size="sm" onClick={() => window.location.href = '/progress'}>
                  View Detailed Stats
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Rocket className="mr-2 h-5 w-5" />
                Learning Goals
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center">
                <div className="w-full">
                  <div className="flex justify-between mb-1 text-sm">
                    <span>Complete Physics Unit</span>
                    <span>64%</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: '64%' }} />
                  </div>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-full">
                  <div className="flex justify-between mb-1 text-sm">
                    <span>Math Final Prep</span>
                    <span>42%</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '42%' }} />
                  </div>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-full">
                  <div className="flex justify-between mb-1 text-sm">
                    <span>Chemistry Lab Report</span>
                    <span>80%</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: '80%' }} />
                  </div>
                </div>
              </div>
              
              <div className="mt-4 text-center">
                <Button variant="outline" size="sm">
                  Set New Goal
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
