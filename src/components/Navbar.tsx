
import React from 'react';
import { Bell, User, Menu, Settings, LogOut, BookOpen, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar = ({ toggleSidebar }: NavbarProps) => {
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error('Error signing out');
      return;
    }
    toast.success("Successfully logged out");
    navigate('/auth');
  };

  return (
    <nav className="w-full bg-white shadow-sm p-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2">
          <div className="rounded-full bg-primary w-8 h-8 flex items-center justify-center">
            <span className="text-white font-bold">LW</span>
          </div>
          <span className="font-bold text-primary hidden sm:inline">LearnWise</span>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="p-4 font-medium flex justify-between items-center">
              <span>Notifications</span>
              <Button variant="ghost" size="sm" className="text-xs">Mark all as read</Button>
            </div>
            <DropdownMenuItem className="p-3 flex flex-col items-start cursor-pointer">
              <div className="font-medium">New quiz available</div>
              <div className="text-sm text-muted-foreground">New quiz on Kinematics is now available</div>
              <div className="text-xs text-muted-foreground mt-1">Just now</div>
            </DropdownMenuItem>
            <DropdownMenuItem className="p-3 flex flex-col items-start cursor-pointer">
              <div className="font-medium">AI Tutor feedback</div>
              <div className="text-sm text-muted-foreground">AI Tutor provided feedback on your Chemistry lesson</div>
              <div className="text-xs text-muted-foreground mt-1">2 hours ago</div>
            </DropdownMenuItem>
            <DropdownMenuItem className="p-3 flex flex-col items-start cursor-pointer">
              <div className="font-medium">New badge earned</div>
              <div className="text-sm text-muted-foreground">You've earned a new badge: 7-Day Streak!</div>
              <div className="text-xs text-muted-foreground mt-1">Yesterday</div>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="justify-center">
              <Button variant="ghost" size="sm" className="w-full">View all notifications</Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem className="cursor-pointer" onClick={handleProfileClick}>
              <User className="h-4 w-4 mr-2" />
              My Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/settings')}>
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/ai-tutor')}>
              <GraduationCap className="h-4 w-4 mr-2" />
              AI Tutor
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Log Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default Navbar;
