
import React, { useState } from 'react';
import { Search, BookOpen, Heart, Clock, Star, Filter, ChevronRight, Award } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

const courses = [
  {
    id: 1,
    title: 'Algebra Fundamentals',
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    subject: 'Mathematics',
    level: 'Intermediate',
    duration: '2 hours',
    rating: 4.8,
    favorite: false,
  },
  {
    id: 2,
    title: 'Advanced Calculus',
    image: 'https://images.unsplash.com/photo-1594912772768-0446bd8f20cc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    subject: 'Mathematics',
    level: 'Advanced',
    duration: '3.5 hours',
    rating: 4.6,
    favorite: true,
  },
  {
    id: 3,
    title: 'Newtonian Mechanics',
    image: 'https://images.unsplash.com/photo-1617791160505-6f00504e3519?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    subject: 'Physics',
    level: 'Intermediate',
    duration: '2.5 hours',
    rating: 4.9,
    favorite: false,
  },
  {
    id: 4,
    title: 'Quantum Physics',
    image: 'https://images.unsplash.com/photo-1662950689791-a95e8d8ff6a0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    subject: 'Physics',
    level: 'Advanced',
    duration: '4 hours',
    rating: 4.7,
    favorite: false,
  },
  {
    id: 5,
    title: 'Organic Chemistry',
    image: 'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    subject: 'Chemistry',
    level: 'Intermediate',
    duration: '3 hours',
    rating: 4.5,
    favorite: true,
  },
  {
    id: 6,
    title: 'Cell Biology',
    image: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    subject: 'Biology',
    level: 'Beginner',
    duration: '2 hours',
    rating: 4.3,
    favorite: false,
  },
];

const Courses = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState<number[]>(courses.filter(c => c.favorite).map(c => c.id));
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');
  
  const toggleFavorite = (id: number) => {
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(itemId => itemId !== id) 
        : [...prev, id]
    );
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = searchTerm
      ? course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.subject.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    
    const matchesSubject = subjectFilter === 'all' || course.subject.toLowerCase() === subjectFilter;
    const matchesLevel = levelFilter === 'all' || course.level.toLowerCase() === levelFilter;
    
    return matchesSearch && matchesSubject && matchesLevel;
  });
  
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Explore Courses</h1>
        <p className="text-muted-foreground mt-1">Discover new subjects and expand your knowledge</p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Input
            placeholder="Search by course name, subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        </div>
        
        <div className="flex gap-3">
          <Select value={subjectFilter} onValueChange={setSubjectFilter}>
            <SelectTrigger className="w-[160px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Subject" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subjects</SelectItem>
              <SelectItem value="mathematics">Mathematics</SelectItem>
              <SelectItem value="physics">Physics</SelectItem>
              <SelectItem value="chemistry">Chemistry</SelectItem>
              <SelectItem value="biology">Biology</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={levelFilter} onValueChange={setLevelFilter}>
            <SelectTrigger className="w-[160px]">
              <Award className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <Card key={course.id} className="overflow-hidden group hover-scale">
            <div className="relative h-48 w-full">
              <img 
                src={course.image} 
                alt={course.title} 
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <Button 
                size="icon" 
                variant="ghost" 
                className={`absolute top-2 right-2 bg-white/70 hover:bg-white ${favorites.includes(course.id) ? 'text-red-500' : 'text-muted-foreground'}`}
                onClick={() => toggleFavorite(course.id)}
              >
                <Heart className={`h-5 w-5 ${favorites.includes(course.id) ? 'fill-current' : ''}`} />
              </Button>
              <Badge className="absolute bottom-2 left-2 bg-black/50">{course.subject}</Badge>
            </div>
            <CardContent className="pt-4">
              <h3 className="font-semibold text-lg mb-1">{course.title}</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                <div className="flex items-center text-muted-foreground text-sm">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center text-muted-foreground text-sm">
                  <Award className="h-4 w-4 mr-1" />
                  <span>{course.level}</span>
                </div>
                <div className="flex items-center text-muted-foreground text-sm">
                  <Star className="h-4 w-4 mr-1 text-yellow-500" />
                  <span>{course.rating}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-3 flex justify-between items-center">
              <Button variant="outline" size="sm" className="w-full flex justify-between items-center">
                Start Learning
                <ChevronRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Courses;
