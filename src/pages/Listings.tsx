
import React, { useState } from 'react';
import { Plus, Edit, Trash, MoreHorizontal, BookOpen, Clock, Star, Award, Play } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';

const initialLessons = [
  {
    id: 1,
    title: 'Quadratic Equations',
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    subject: 'Mathematics',
    progress: 75,
    lastStudied: '2023-04-05',
    duration: '45 min',
  },
  {
    id: 2,
    title: 'Newton\'s Laws of Motion',
    image: 'https://images.unsplash.com/photo-1617791160505-6f00504e3519?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    subject: 'Physics',
    progress: 45,
    lastStudied: '2023-03-28',
    duration: '60 min',
  },
  {
    id: 3,
    title: 'Chemical Bonding',
    image: 'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    subject: 'Chemistry',
    progress: 30,
    lastStudied: '2023-02-15',
    duration: '50 min',
  },
];

const MyLessons = () => {
  const [lessons, setLessons] = useState(initialLessons);
  
  const handleDelete = (id: number) => {
    setLessons(lessons.filter(lesson => lesson.id !== id));
    toast.success("Lesson removed from your list");
  };
  
  const getSubjectColor = (subject: string) => {
    switch(subject) {
      case 'Mathematics':
        return 'bg-blue-100 text-blue-700';
      case 'Physics':
        return 'bg-purple-100 text-purple-700';
      case 'Chemistry':
        return 'bg-green-100 text-green-700';
      case 'Biology':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };
  
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">My Lessons</h1>
          <p className="text-muted-foreground mt-1">Track and continue your learning progress</p>
        </div>
        <Button className="sm:w-auto w-full">
          <Plus className="mr-2 h-4 w-4" />
          Find New Lessons
        </Button>
      </div>
      
      <div className="space-y-6">
        {lessons.length > 0 ? (
          lessons.map((lesson) => (
            <Card key={lesson.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row">
                <div className="sm:w-48 h-48 sm:h-auto">
                  <img 
                    src={lesson.image} 
                    alt={lesson.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 p-6">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                    <div>
                      <div className="flex items-center">
                        <h3 className="text-xl font-semibold">{lesson.title}</h3>
                        <Badge className={`ml-3 ${getSubjectColor(lesson.subject)}`}>
                          {lesson.subject}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{lesson.duration}</span>
                        </div>
                        <div>
                          Last studied: {new Date(lesson.lastStudied).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="mt-4 space-y-1">
                        <div className="flex justify-between items-center text-sm">
                          <span>Progress</span>
                          <span>{lesson.progress}%</span>
                        </div>
                        <Progress value={lesson.progress} className="h-2" />
                      </div>
                    </div>
                    <div className="flex sm:flex-col gap-2">
                      <Button className="flex-1 sm:w-full">
                        <Play className="h-4 w-4 mr-2" />
                        Continue
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 sm:w-full text-destructive hover:text-destructive"
                        onClick={() => handleDelete(lesson.id)}
                      >
                        <Trash className="h-4 w-4 mr-2" />
                        Remove
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="w-9 h-9 hidden sm:flex">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Mark as Completed</DropdownMenuItem>
                          <DropdownMenuItem>Add to Favorites</DropdownMenuItem>
                          <DropdownMenuItem>Start from Beginning</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="text-center">No Lessons Yet</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-4">You haven't added any lessons to your learning path yet.</p>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Find Lessons to Study
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MyLessons;
