import { useState } from 'react';
import { MapPin, MessageSquare, TrendingUp, Users, Send, Heart, Share, Coins, Vote, Gift, Zap, TreePine, Recycle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
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

interface EcoCoinGoal {
  id: string;
  title: string;
  description: string;
  cost: number;
  progress: number;
  target: number;
  category: 'solar' | 'composting' | 'green-space' | 'education';
  votes: number;
  userVoted: boolean;
}

interface CommunityPerk {
  id: string;
  title: string;
  description: string;
  cost: number;
  unlocked: boolean;
  icon: string;
  category: 'infrastructure' | 'education' | 'environment';
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

  // EcoCoins System Data
  const [userEcoCoins, setUserEcoCoins] = useState(1250);
  const [communityEcoCoins, setCommunityEcoCoins] = useState(45680);
  const [ecoCoinGoals, setEcoCoinGoals] = useState<EcoCoinGoal[]>([
    {
      id: '1',
      title: 'Solar Streetlights',
      description: 'Install solar-powered LED streetlights on Main Street',
      cost: 5000,
      progress: 3200,
      target: 5000,
      category: 'solar',
      votes: 45,
      userVoted: false
    },
    {
      id: '2',
      title: 'Community Composting Hub',
      description: 'Build a neighborhood composting facility for organic waste',
      cost: 3000,
      progress: 1800,
      target: 3000,
      category: 'composting',
      votes: 32,
      userVoted: true
    },
    {
      id: '3',
      title: 'Green Learning Center',
      description: 'Create an educational space for sustainability workshops',
      cost: 4000,
      progress: 1200,
      target: 4000,
      category: 'education',
      votes: 28,
      userVoted: false
    }
  ]);

  const [communityPerks, setCommunityPerks] = useState<CommunityPerk[]>([
    {
      id: '1',
      title: 'Solar Streetlights',
      description: 'Energy-efficient LED streetlights powered by solar panels',
      cost: 5000,
      unlocked: false,
      icon: '💡',
      category: 'infrastructure'
    },
    {
      id: '2',
      title: 'Community Garden',
      description: 'Shared space for growing organic vegetables and herbs',
      cost: 2500,
      unlocked: true,
      icon: '🌱',
      category: 'environment'
    },
    {
      id: '3',
      title: 'Energy Workshop Series',
      description: 'Monthly workshops on energy conservation and renewable energy',
      cost: 1500,
      unlocked: true,
      icon: '📚',
      category: 'education'
    },
    {
      id: '4',
      title: 'Composting Facility',
      description: 'Community composting hub for organic waste management',
      cost: 3000,
      unlocked: false,
      icon: '♻️',
      category: 'environment'
    }
  ]);

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

  const handleVoteGoal = (goalId: string) => {
    setEcoCoinGoals(prev => prev.map(goal => 
      goal.id === goalId 
        ? { 
            ...goal, 
            votes: goal.userVoted ? goal.votes - 1 : goal.votes + 1,
            userVoted: !goal.userVoted,
            progress: goal.userVoted ? goal.progress - 50 : goal.progress + 50
          }
        : goal
    ));
    
    toast({
      title: "Vote Cast!",
      description: "Your EcoCoins have been contributed to this community goal.",
    });
  };

  const handleUnlockPerk = (perkId: string) => {
    const perk = communityPerks.find(p => p.id === perkId);
    if (perk && communityEcoCoins >= perk.cost) {
      setCommunityPerks(prev => prev.map(p => 
        p.id === perkId ? { ...p, unlocked: true } : p
      ));
      setCommunityEcoCoins(prev => prev - perk.cost);
      
      toast({
        title: "Perk Unlocked!",
        description: `${perk.title} is now available for the community!`,
      });
    }
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
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Community Hub
        </h1>
        <p className="text-muted-foreground">
          Connect with neighbors and share energy-saving tips
        </p>
        
        {/* EcoCoins System */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
          <Card className="card-eco bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                    <Coins className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-yellow-800">Your EcoCoins</h3>
                    <p className="text-2xl font-bold text-yellow-700">{userEcoCoins.toLocaleString()}</p>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                  Earned: {Math.floor(userEcoCoins / 10)} kWh saved
                </Badge>
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-eco bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-green-800">Community Pool</h3>
                    <p className="text-2xl font-bold text-green-700">{communityEcoCoins.toLocaleString()}</p>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Available for goals
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
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

      {/* EcoCoins Voting & Perks Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Community Goals Voting */}
        <Card className="card-eco">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Vote className="w-5 h-5 text-primary" />
              Community Goals
              <Badge variant="secondary" className="ml-auto">Vote with EcoCoins</Badge>
            </CardTitle>
            <CardDescription>Help decide which community projects to fund</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {ecoCoinGoals.map((goal) => (
                <div key={goal.id} className="card-hero p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">{goal.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{goal.description}</p>
                    </div>
                    <Badge 
                      variant={goal.category === 'solar' ? 'default' : goal.category === 'composting' ? 'secondary' : 'outline'}
                      className="ml-2"
                    >
                      {goal.category === 'solar' && <Zap className="w-3 h-3 mr-1" />}
                      {goal.category === 'composting' && <Recycle className="w-3 h-3 mr-1" />}
                      {goal.category === 'education' && <TreePine className="w-3 h-3 mr-1" />}
                      {goal.category}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>{goal.progress.toLocaleString()} / {goal.target.toLocaleString()} EcoCoins</span>
                      <span>{goal.votes} votes</span>
                    </div>
                    <Progress value={(goal.progress / goal.target) * 100} className="h-2" />
                  </div>
                  
                  <Button
                    size="sm"
                    variant={goal.userVoted ? "default" : "outline"}
                    onClick={() => handleVoteGoal(goal.id)}
                    className={`w-full ${goal.userVoted ? 'btn-eco' : ''}`}
                    disabled={goal.progress >= goal.target}
                  >
                    <Vote className="w-4 h-4 mr-2" />
                    {goal.userVoted ? 'Voted (50 EcoCoins)' : 'Vote (50 EcoCoins)'}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Community Perks */}
        <Card className="card-eco">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="w-5 h-5 text-primary" />
              Community Perks
              <Badge variant="secondary" className="ml-auto">Unlock with EcoCoins</Badge>
            </CardTitle>
            <CardDescription>Unlock community-level benefits and infrastructure</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {communityPerks.map((perk) => (
                <div key={perk.id} className={`card-hero p-4 space-y-3 ${perk.unlocked ? 'bg-green-50 border-green-200' : ''}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{perk.icon}</div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm">{perk.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1">{perk.description}</p>
                      </div>
                    </div>
                    <Badge 
                      variant={perk.unlocked ? 'default' : 'secondary'}
                      className={perk.unlocked ? 'bg-green-100 text-green-800' : ''}
                    >
                      {perk.unlocked ? 'Unlocked' : `${perk.cost.toLocaleString()} EcoCoins`}
                    </Badge>
                  </div>
                  
                  {!perk.unlocked && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleUnlockPerk(perk.id)}
                      className="w-full"
                      disabled={communityEcoCoins < perk.cost}
                    >
                      <Gift className="w-4 h-4 mr-2" />
                      {communityEcoCoins >= perk.cost ? 'Unlock Perk' : 'Insufficient Funds'}
                    </Button>
                  )}
                  
                  {perk.unlocked && (
                    <div className="text-center p-2 bg-green-100 rounded-lg">
                      <p className="text-sm font-medium text-green-800">✅ Available for Community Use</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
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