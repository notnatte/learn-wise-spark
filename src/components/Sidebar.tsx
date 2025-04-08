
import React from 'react';
import { Home, Building, MessageSquare, User, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isOpen: boolean;
  currentRoute: string;
  onNavigate: (route: string) => void;
}

const Sidebar = ({ isOpen, currentRoute, onNavigate }: SidebarProps) => {
  const navItems = [
    { icon: Home, label: 'Dashboard', route: '/' },
    { icon: Building, label: 'Explore', route: '/explore' },
    { icon: Building, label: 'My Listings', route: '/listings' },
    { icon: MessageSquare, label: 'Messages', route: '/messages' },
    { icon: User, label: 'Profile', route: '/profile' },
    { icon: Settings, label: 'Settings', route: '/settings' },
  ];

  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 z-50 bg-sidebar md:relative flex flex-col transition-all duration-300 ease-in-out border-r border-sidebar-border",
        isOpen ? "w-64" : "w-0 md:w-20",
        "sm:block"
      )}
    >
      <div className="flex items-center justify-center h-16 border-b border-sidebar-border">
        {isOpen ? (
          <h1 className="text-white font-bold text-xl">PropertyHub</h1>
        ) : (
          <div className="hidden md:flex items-center justify-center rounded-full bg-white w-8 h-8">
            <span className="font-bold text-primary">PH</span>
          </div>
        )}
      </div>
      
      <div className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-2 px-3">
          {navItems.map((item) => (
            <li key={item.route}>
              <button
                onClick={() => onNavigate(item.route)}
                className={cn(
                  "flex items-center w-full p-3 rounded-lg transition-colors",
                  currentRoute === item.route
                    ? "bg-white text-primary"
                    : "text-white hover:bg-sidebar-accent hover:text-primary"
                )}
              >
                <item.icon className="h-5 w-5" />
                {isOpen && <span className="ml-3">{item.label}</span>}
              </button>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-white flex-shrink-0 overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          </div>
          {isOpen && (
            <div className="ml-3">
              <p className="text-white font-medium">Alex Johnson</p>
              <p className="text-sidebar-accent text-xs">Property Manager</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
