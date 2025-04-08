
import React, { useState } from 'react';
import { Plus, Edit, Trash, MoreHorizontal } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

const initialListings = [
  {
    id: 1,
    title: 'Modern Downtown Apartment',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXBhcnRtZW50fGVufDB8fDB8fHww',
    location: 'Seattle, WA',
    price: '$2,500/month',
    status: 'Active',
    dateAdded: '2023-04-05',
  },
  {
    id: 2,
    title: 'Cozy Studio with City View',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YXBhcnRtZW50fGVufDB8fDB8fHww',
    location: 'Portland, OR',
    price: '$1,850/month',
    status: 'Pending',
    dateAdded: '2023-03-28',
  },
  {
    id: 3,
    title: 'Spacious 2BR with Balcony',
    image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGFwYXJ0bWVudHxlbnwwfHwwfHx8MA%3D%3D',
    location: 'Denver, CO',
    price: '$2,150/month',
    status: 'Active',
    dateAdded: '2023-02-15',
  },
];

const Listings = () => {
  const [listings, setListings] = useState(initialListings);
  
  const handleDelete = (id: number) => {
    setListings(listings.filter(listing => listing.id !== id));
    toast.success("Listing deleted successfully");
  };
  
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Active':
        return 'bg-green-100 text-green-700';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'Inactive':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-blue-100 text-blue-700';
    }
  };
  
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">My Listings</h1>
          <p className="text-muted-foreground mt-1">Manage your property listings</p>
        </div>
        <Button className="sm:w-auto w-full">
          <Plus className="mr-2 h-4 w-4" />
          Add New Listing
        </Button>
      </div>
      
      <div className="space-y-6">
        {listings.length > 0 ? (
          listings.map((listing) => (
            <Card key={listing.id} className="overflow-hidden">
              <div className="flex flex-col sm:flex-row">
                <div className="sm:w-48 h-48 sm:h-auto">
                  <img 
                    src={listing.image} 
                    alt={listing.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 p-6">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                    <div>
                      <h3 className="text-xl font-semibold">{listing.title}</h3>
                      <p className="text-muted-foreground mt-1">{listing.location}</p>
                      <p className="font-medium text-primary mt-2">{listing.price}</p>
                      <div className="flex items-center mt-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(listing.status)}`}>
                          {listing.status}
                        </span>
                        <span className="text-xs text-muted-foreground ml-3">
                          Added on {new Date(listing.dateAdded).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex sm:flex-col gap-2">
                      <Button variant="outline" size="sm" className="flex-1 sm:w-full">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 sm:w-full text-destructive hover:text-destructive"
                        onClick={() => handleDelete(listing.id)}
                      >
                        <Trash className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="w-9 h-9 hidden sm:flex">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Mark as Inactive</DropdownMenuItem>
                          <DropdownMenuItem>Duplicate Listing</DropdownMenuItem>
                          <DropdownMenuItem>Share Listing</DropdownMenuItem>
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
              <CardTitle className="text-center">No Listings Yet</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-4">You haven't added any property listings yet.</p>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Listing
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Listings;
