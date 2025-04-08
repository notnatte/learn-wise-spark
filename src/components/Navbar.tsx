
import React from 'react';
import { Bell, User, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar = ({ toggleSidebar }: NavbarProps) => {
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
          <DropdownMenuContent align="end" className="w-72">
            <div className="p-4 font-medium">Notifications</div>
            <DropdownMenuItem className="p-3 flex flex-col items-start">
              <div className="font-medium">New lesson available!</div>
              <div className="text-sm text-muted-foreground">Check out our new math lesson</div>
              <div className="text-xs text-muted-foreground mt-1">Just now</div>
            </DropdownMenuItem>
            <DropdownMenuItem className="p-3 flex flex-col items-start">
              <div className="font-medium">Great work!</div>
              <div className="text-sm text-muted-foreground">You've completed your daily goal</div>
              <div className="text-xs text-muted-foreground mt-1">2 hours ago</div>
            </DropdownMenuItem>
            <DropdownMenuItem className="p-3 flex flex-col items-start">
              <div className="font-medium">Quiz reminder</div>
              <div className="text-sm text-muted-foreground">Don't forget to take your science quiz</div>
              <div className="text-xs text-muted-foreground mt-1">Yesterday</div>
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
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default Navbar;
