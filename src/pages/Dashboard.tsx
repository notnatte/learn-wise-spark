
import React from 'react';
import { TrendingUp, Home, Clock, Calendar, Users, Eye, Package, BadgeCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ProgressRing from '@/components/ProgressRing';
import StreakBadge from '@/components/StreakBadge';
import CourseCard from '@/components/CourseCard';
import AchievementBadge from '@/components/AchievementBadge';

const Dashboard = () => {
  const recentActivity = [
    { id: 1, icon: <BadgeCheck className="h-5 w-5 text-green-500" />, title: "Listing Approved", description: "Your property at Seattle was approved", time: "2 hours ago" },
    { id: 2, icon: <Users className="h-5 w-5 text-blue-500" />, title: "New Inquiry", description: "Sarah asked about Downtown Apartment", time: "Yesterday" },
    { id: 3, icon: <Eye className="h-5 w-5 text-purple-500" />, title: "Profile Viewed", description: "Someone viewed your profile", time: "2 days ago" },
    { id: 4, icon: <Calendar className="h-5 w-5 text-orange-500" />, title: "Viewing Scheduled", description: "Apartment viewing on Saturday at 2PM", time: "3 days ago" },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, Alex!</h1>
          <p className="text-muted-foreground mt-1">Here's what's happening with your properties</p>
        </div>
        <StreakBadge streak={8} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Properties Listed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-3xl font-bold">3</div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Home className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              <span className="text-green-500 font-medium">↑ 1</span> from last month
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Offers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-3xl font-bold">2</div>
              <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                <Clock className="h-6 w-6 text-secondary" />
              </div>
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              <span className="text-green-500 font-medium">↑ 2</span> new this week
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Weekly Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-3xl font-bold">147</div>
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                <Eye className="h-6 w-6 text-accent" />
              </div>
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              <span className="text-green-500 font-medium">↑ 24%</span> from last week
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Weekly Progress</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center sm:flex-row sm:justify-around gap-6 py-6">
            <ProgressRing progress={68} />
            
            <div className="space-y-6 w-full max-w-xs">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Response Rate</span>
                  <span className="text-sm text-muted-foreground">80%</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-secondary rounded-full" style={{ width: '80%' }} />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Profile Completion</span>
                  <span className="text-sm text-muted-foreground">90%</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-accent rounded-full" style={{ width: '90%' }} />
                </div>
              </div>
              
              <Button className="w-full">View Detailed Stats</Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Market Trends</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Rental Prices</p>
                  <p className="text-sm text-muted-foreground">↑ 5.2% in your area</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center mr-3">
                  <Package className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <p className="font-medium">Property Demand</p>
                  <p className="text-sm text-muted-foreground">High in urban areas</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center mr-3">
                  <Home className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="font-medium">New Listings</p>
                  <p className="text-sm text-muted-foreground">↑ 12% this month</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div>
        <h2 className="text-2xl font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {recentActivity.map((activity) => (
            <Card key={activity.id}>
              <CardContent className="flex items-start p-4">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mr-4 flex-shrink-0">
                  {activity.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{activity.title}</h3>
                  <p className="text-sm text-muted-foreground">{activity.description}</p>
                </div>
                <div className="text-xs text-muted-foreground">{activity.time}</div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-4 text-center">
          <Button variant="outline">View All Activity</Button>
        </div>
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Featured Properties</h2>
          <Button variant="outline">View All Properties</Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <CourseCard
            title="Downtown Apartment"
            description="Seattle, WA"
            progress={75}
            icon={<Home className="h-6 w-6 text-primary" />}
            color="bg-primary/10"
            onClick={() => console.log('Property clicked')}
          />
          
          <CourseCard
            title="Cozy Studio"
            description="Portland, OR"
            progress={45}
            icon={<Home className="h-6 w-6 text-secondary" />}
            color="bg-secondary/10"
            onClick={() => console.log('Property clicked')}
          />
          
          <CourseCard
            title="Spacious 2BR"
            description="Denver, CO"
            progress={20}
            icon={<Home className="h-6 w-6 text-accent" />}
            color="bg-accent/10"
            onClick={() => console.log('Property clicked')}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
