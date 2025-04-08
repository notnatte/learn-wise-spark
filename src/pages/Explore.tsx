
import React, { useState } from 'react';
import { Search, MapPin, Heart } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const properties = [
  {
    id: 1,
    title: 'Modern Downtown Apartment',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXBhcnRtZW50fGVufDB8fDB8fHww',
    location: 'Seattle, WA',
    price: '$2,500/month',
    favorite: false,
  },
  {
    id: 2,
    title: 'Cozy Studio with City View',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YXBhcnRtZW50fGVufDB8fDB8fHww',
    location: 'Portland, OR',
    price: '$1,850/month',
    favorite: true,
  },
  {
    id: 3,
    title: 'Luxury Penthouse Suite',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8YXBhcnRtZW50fGVufDB8fDB8fHww',
    location: 'San Francisco, CA',
    price: '$4,200/month',
    favorite: false,
  },
  {
    id: 4,
    title: 'Spacious 2BR with Balcony',
    image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGFwYXJ0bWVudHxlbnwwfHwwfHx8MA%3D%3D',
    location: 'Denver, CO',
    price: '$2,150/month',
    favorite: false,
  },
  {
    id: 5,
    title: 'Historic Loft Apartment',
    image: 'https://images.unsplash.com/photo-1619166719123-781c1d0f9f2c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjR8fGFwYXJ0bWVudHxlbnwwfHwwfHx8MA%3D%3D',
    location: 'Chicago, IL',
    price: '$1,950/month',
    favorite: true,
  },
  {
    id: 6,
    title: 'Modern Garden Apartment',
    image: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8YXBhcnRtZW50fGVufDB8fDB8fHww',
    location: 'Austin, TX',
    price: '$1,850/month',
    favorite: false,
  },
];

const Explore = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState<number[]>(properties.filter(p => p.favorite).map(p => p.id));
  
  const toggleFavorite = (id: number) => {
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(itemId => itemId !== id) 
        : [...prev, id]
    );
  };

  const filteredProperties = searchTerm
    ? properties.filter(property => 
        property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.location.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : properties;
  
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Explore Properties</h1>
        <p className="text-muted-foreground mt-1">Find your perfect home</p>
      </div>
      
      <div className="relative">
        <Input
          placeholder="Search by location, property name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.map((property) => (
          <Card key={property.id} className="overflow-hidden group">
            <div className="relative h-48 w-full">
              <img 
                src={property.image} 
                alt={property.title} 
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <Button 
                size="icon" 
                variant="ghost" 
                className={`absolute top-2 right-2 bg-white/70 hover:bg-white ${favorites.includes(property.id) ? 'text-red-500' : 'text-muted-foreground'}`}
                onClick={() => toggleFavorite(property.id)}
              >
                <Heart className={`h-5 w-5 ${favorites.includes(property.id) ? 'fill-current' : ''}`} />
              </Button>
            </div>
            <CardContent className="pt-4">
              <h3 className="font-semibold text-lg">{property.title}</h3>
              <div className="flex items-center text-muted-foreground mt-1">
                <MapPin className="h-4 w-4 mr-1" />
                <span className="text-sm">{property.location}</span>
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-3 flex justify-between items-center">
              <p className="font-medium text-primary">{property.price}</p>
              <Button variant="outline" size="sm">View Details</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Explore;
