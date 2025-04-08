
import React, { useState } from 'react';
import { User, Mail, Lock, Camera } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const Profile = () => {
  const [formData, setFormData] = useState({
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    password: '',
    confirmPassword: '',
  });
  
  const [isEditing, setIsEditing] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
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
        <p className="text-muted-foreground mt-1">Manage your personal information</p>
      </div>
      
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
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex-1">
                <h3 className="font-medium text-lg">Profile Photo</h3>
                <p className="text-sm text-muted-foreground">This will be displayed on your profile</p>
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
  );
};

export default Profile;
