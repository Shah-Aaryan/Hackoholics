import { useState } from 'react';
import { MapPin, MessageSquare, TrendingUp, Users, Send, Heart, Share } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
// Simple visualizations without recharts
import { toast } from '@/hooks/use-toast';

interface Post {
  id: string;
  author: string;
  avatar: string;
  content: string;
  timestamp: Date;
  likes: number;
  category: 'tip' | 'achievement' | 'question';
}

const Community = () => {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      author: 'Sarah Chen',
      avatar: '👩‍💼',
      content: 'Just saved 20% on my electricity bill by switching to LED bulbs throughout the house! The difference is incredible. Highly recommend the Philips warm white LEDs for bedrooms.',
      timestamp: new Date('2024-01-15T10:30:00'),
      likes: 12,
      category: 'tip'
    },
    {
      id: '2',
      author: 'Mike Johnson',
      avatar: '👨‍🔧',
      content: 'Reached my 30-day energy saving streak today! 🎉 The key was setting my smart thermostat to lower temps during work hours. Small changes make a big difference!',
      timestamp: new Date('2024-01-15T09:15:00'),
      likes: 8,
      category: 'achievement'
    },
    {
      id: '3',
      author: 'Emma Davis',
      avatar: '👩‍🎓',
      content: 'Question for the community: Has anyone tried solar panel installation? I\'m considering it but want to hear real experiences about ROI and maintenance.',
      timestamp: new Date('2024-01-14T16:45:00'),
      likes: 5,
      category: 'question'
    }
  ]);

  const [newPost, setNewPost] = useState('');

  // Mock neighborhood data
  const neighborhoodData = [
    { name: 'Oak Street', savings: 2840, homes: 156 },
    { name: 'Pine Avenue', savings: 2650, homes: 142 },
    { name: 'Maple Drive', savings: 2420, homes: 138 },
    { name: 'Cedar Lane', savings: 2180, homes: 125 },
    { name: 'Elm Boulevard', savings: 1950, homes: 118 }
  ];

  const energySourceData = [
    { name: 'Solar', value: 35, color: '#f59e0b' },
    { name: 'Wind', value: 25, color: '#3b82f6' },
    { name: 'Hydro', value: 20, color: '#06b6d4' },
    { name: 'Natural Gas', value: 15, color: '#6b7280' },
    { name: 'Other', value: 5, color: '#8b5cf6' }
  ];

  const groupChallenges = [
    {
      id: '1',
      title: 'Neighborhood Solar Initiative',
      description: 'Get 50% of homes to install solar panels',
      progress: 32,
      target: 50,
      participants: 78
    },
    {
      id: '2',
      title: 'Community Energy Fast',
      description: 'Reduce collective usage by 25% this month',
      progress: 68,
      target: 100,
      participants: 156
    }
  ];

  const handleSubmitPost = () => {
    if (!newPost.trim()) return;

    const post: Post = {
      id: Date.now().toString(),
      author: 'You',
      avatar: '👤',
      content: newPost,
      timestamp: new Date(),
      likes: 0,
      category: 'tip'
    };

    setPosts(prev => [post, ...prev]);
    setNewPost('');
    
    toast({
      title: "Post Shared!",
      description: "Your tip has been shared with the community.",
    });
  };

  const handleLikePost = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, likes: post.likes + 1 }
        : post
    ));
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'tip': return '💡';
      case 'achievement': return '🏆';
      case 'question': return '❓';
      default: return '💬';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'tip': return 'bg-primary/20 text-primary';
      case 'achievement': return 'bg-success/20 text-success';
      case 'question': return 'bg-accent/20 text-accent';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Community Hub
        </h1>
        <p className="text-muted-foreground">
          Connect with neighbors and share energy-saving tips
        </p>
      </div>

      {/* Community Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="card-eco">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Members</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">1,247</div>
            <p className="text-xs text-muted-foreground">+23 this week</p>
          </CardContent>
        </Card>

        <Card className="card-eco">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Savings</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">12,040 kWh</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card className="card-eco">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CO₂ Prevented</CardTitle>
            <MapPin className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">8,187 kg</div>
            <p className="text-xs text-muted-foreground">Community impact</p>
          </CardContent>
        </Card>

        <Card className="card-eco">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tips Shared</CardTitle>
            <MessageSquare className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">156</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Charts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Neighborhood Progress Chart */}
          <Card className="card-eco">
            <CardHeader>
              <CardTitle>Neighborhood Energy Savings</CardTitle>
              <CardDescription>kWh saved by street this month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-72 flex items-end justify-center gap-4 p-4">
                {neighborhoodData.map((data, index) => (
                  <div key={index} className="flex flex-col items-center gap-2">
                    <div 
                      className="bg-gradient-eco w-12 rounded-t-md transition-all duration-1000"
                      style={{ height: `${(data.savings / Math.max(...neighborhoodData.map(d => d.savings))) * 200}px` }}
                    />
                    <span className="text-xs text-muted-foreground text-center">{data.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Energy Sources Map */}
          <Card className="card-eco">
            <CardHeader>
              <CardTitle>Community Energy Sources</CardTitle>
              <CardDescription>Renewable energy distribution in your area</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="w-32 h-32 rounded-full mx-auto relative overflow-hidden">
                  {energySourceData.map((source, index) => {
                    const angle = (source.value / 100) * 360;
                    return (
                      <div 
                        key={index}
                        className="absolute inset-0 rounded-full"
                        style={{
                          background: `conic-gradient(${source.color} 0deg ${angle}deg, transparent ${angle}deg)`,
                          transform: `rotate(${energySourceData.slice(0, index).reduce((acc, s) => acc + (s.value / 100) * 360, 0)}deg)`
                        }}
                      />
                    );
                  })}
                </div>
                
                <div className="space-y-2">
                  {energySourceData.map((source) => (
                    <div key={source.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: source.color }}
                        />
                        <span className="text-sm">{source.name}</span>
                      </div>
                      <span className="text-sm font-medium">{source.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Community Feed */}
        <div className="space-y-6">
          {/* Group Challenges */}
          <Card className="card-eco">
            <CardHeader>
              <CardTitle>Group Challenges</CardTitle>
              <CardDescription>Community-wide energy goals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {groupChallenges.map((challenge) => (
                  <div key={challenge.id} className="card-hero p-4 space-y-3">
                    <div>
                      <h4 className="font-semibold text-sm">{challenge.title}</h4>
                      <p className="text-xs text-muted-foreground">
                        {challenge.description}
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span>{challenge.progress}% complete</span>
                        <span>{challenge.participants} participants</span>
                      </div>
                      <Progress value={challenge.progress} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Post Input */}
          <Card className="card-eco">
            <CardHeader>
              <CardTitle>Share a Tip</CardTitle>
              <CardDescription>Help your neighbors save energy</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Textarea
                  placeholder="Share your energy-saving tip with the community..."
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  rows={3}
                />
                <Button 
                  onClick={handleSubmitPost}
                  disabled={!newPost.trim()}
                  className="w-full btn-eco"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Share Tip
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Community Feed */}
      <Card className="card-eco">
        <CardHeader>
          <CardTitle>Community Feed</CardTitle>
          <CardDescription>Latest tips and achievements from your neighbors</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post.id} className="card-hero p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-eco rounded-full flex items-center justify-center text-white font-medium">
                      {post.avatar}
                    </div>
                    <div>
                      <div className="font-medium">{post.author}</div>
                      <div className="text-xs text-muted-foreground">
                        {post.timestamp.toLocaleDateString()} at {post.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs ${getCategoryColor(post.category)}`}>
                    {getCategoryIcon(post.category)} {post.category}
                  </div>
                </div>
                
                <p className="text-sm leading-relaxed">{post.content}</p>
                
                <div className="flex items-center gap-4 pt-2 border-t border-border/50">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleLikePost(post.id)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Heart className="w-4 h-4 mr-1" />
                    {post.likes}
                  </Button>
                  <Button variant="ghost" size="sm" className="text-muted-foreground">
                    <Share className="w-4 h-4 mr-1" />
                    Share
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Community;