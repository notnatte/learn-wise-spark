
import React from 'react';
import { Home, BookOpen, BookText, Award, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MobileNavProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
}

const MobileNav = ({ currentRoute, onNavigate }: MobileNavProps) => {
  const navItems = [
    { icon: Home, label: 'Home', route: '/' },
    { icon: BookOpen, label: 'Learn', route: '/courses' },
    { icon: BookText, label: 'Quiz', route: '/quiz' },
    { icon: Award, label: 'Achievements', route: '/achievements' },
    { icon: Settings, label: 'Settings', route: '/settings' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t md:hidden">
      <div className="flex items-center justify-around">
        {navItems.map((item) => (
          <button
            key={item.route}
            onClick={() => onNavigate(item.route)}
            className={cn(
              "flex flex-col items-center py-3 px-4 transition-colors",
              currentRoute === item.route
                ? "text-primary"
                : "text-muted-foreground hover:text-primary"
            )}
          >
            <item.icon className="h-5 w-5" />
            <span className="text-xs mt-1">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MobileNav;
