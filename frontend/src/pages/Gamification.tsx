import { useState } from 'react';
import { Trophy, Target, Gift, Flame, Star, Award, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { mockLeaderboard, mockAchievements, mockChallenges, mockMarketplaceItems, Achievement, Challenge } from '@/data/mockData';
import { toast } from '@/hooks/use-toast';

const Gamification = () => {
  const [achievements, setAchievements] = useState(mockAchievements);
  const [challenges, setChallenges] = useState(mockChallenges);
  const [userPoints, setUserPoints] = useState(1850);
  const [streakDays, setStreakDays] = useState(12);
  const [viewMode, setViewMode] = useState<'daily' | 'weekly' | 'monthly'>('weekly');

  const handleJoinChallenge = (challengeId: string) => {
    setChallenges(prev => prev.map(challenge => 
      challenge.id === challengeId 
        ? { ...challenge, progress: Math.min(100, challenge.progress + 10) }
        : challenge
    ));
    
    toast({
      title: "Challenge Joined!",
      description: "You've joined the challenge. Keep up the great work!",
    });
  };

  const handleUnlockAchievement = (achievementId: string) => {
    const achievement = achievements.find(a => a.id === achievementId);
    if (achievement && !achievement.unlocked) {
      setAchievements(prev => prev.map(a => 
        a.id === achievementId ? { ...a, unlocked: true } : a
      ));
      setUserPoints(prev => prev + achievement.points);
      
      toast({
        title: "🎉 Achievement Unlocked!",
        description: `${achievement.title} - You earned ${achievement.points} points!`,
      });
    }
  };

  const handleRedeemReward = (itemId: string, points: number) => {
    if (userPoints >= points) {
      setUserPoints(prev => prev - points);
      toast({
        title: "Reward Redeemed!",
        description: `You've successfully redeemed this item for ${points} points.`,
      });
    } else {
      toast({
        title: "Insufficient Points",
        description: `You need ${points - userPoints} more points to redeem this item.`,
        variant: "destructive"
      });
    }
  };

  const filteredLeaderboard = mockLeaderboard.filter((_, index) => {
    if (viewMode === 'daily') return index < 3;
    if (viewMode === 'weekly') return index < 5;
    return true;
  });

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Energy Gamification
        </h1>
        <p className="text-muted-foreground">
          Compete, achieve, and earn rewards for your eco-friendly habits
        </p>
      </div>

      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="card-hero">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Your Points</CardTitle>
            <Star className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">
              {userPoints.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Rank #4 in neighborhood
            </p>
          </CardContent>
        </Card>

        <Card className="card-eco">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Energy Streak</CardTitle>
            <Flame className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive success-pulse">
              {streakDays} days
            </div>
            <p className="text-xs text-muted-foreground">
              Consecutive savings
            </p>
          </CardContent>
        </Card>

        <Card className="card-eco">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Achievements</CardTitle>
            <Award className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">
              {achievements.filter(a => a.unlocked).length}/{achievements.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Unlocked badges
            </p>
          </CardContent>
        </Card>

        <Card className="card-eco">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Challenges</CardTitle>
            <Target className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {challenges.filter(c => c.progress < 100).length}
            </div>
            <p className="text-xs text-muted-foreground">
              In progress
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Leaderboard */}
        <Card className="card-eco">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-warning" />
                  Leaderboard
                </CardTitle>
                <CardDescription>Top energy savers in your area</CardDescription>
              </div>
              <div className="flex gap-1">
                {(['daily', 'weekly', 'monthly'] as const).map((mode) => (
                  <Button
                    key={mode}
                    variant={viewMode === mode ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode(mode)}
                    className={viewMode === mode ? "btn-eco" : ""}
                  >
                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredLeaderboard.map((entry) => (
                <div 
                  key={entry.id}
                  className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
                    entry.name === 'You' 
                      ? 'bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30' 
                      : 'bg-muted/50 hover:bg-muted'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      entry.rank === 1 ? 'bg-warning text-warning-foreground' :
                      entry.rank === 2 ? 'bg-muted text-muted-foreground' :
                      entry.rank === 3 ? 'bg-destructive/20 text-destructive' :
                      'bg-secondary text-secondary-foreground'
                    }`}>
                      {entry.rank <= 3 ? (
                        entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : '🥉'
                      ) : (
                        entry.rank
                      )}
                    </div>
                    <div>
                      <div className="font-medium">{entry.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {entry.energySaved} kWh saved
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-primary">
                      {entry.points.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">points</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Challenges */}
        <Card className="card-eco">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Active Challenges
            </CardTitle>
            <CardDescription>Join challenges to earn extra points</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {challenges.map((challenge) => (
                <div key={challenge.id} className="card-hero p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">{challenge.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {challenge.description}
                      </p>
                    </div>
                    <Badge variant="secondary">
                      {challenge.timeLeft}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{challenge.progress}%</span>
                    </div>
                    <Progress value={challenge.progress} className="h-2" />
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="text-sm">
                      <span className="text-warning font-medium">
                        🏆 {challenge.reward} points
                      </span>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleJoinChallenge(challenge.id)}
                      disabled={challenge.progress >= 100}
                      className="btn-eco"
                    >
                      {challenge.progress >= 100 ? 'Completed' : 'Join Challenge'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Achievements & Marketplace */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Achievements */}
        <Card className="card-eco">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-accent" />
              Achievements
            </CardTitle>
            <CardDescription>Unlock badges for your eco achievements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-200 ${
                    achievement.unlocked
                      ? 'bg-gradient-to-r from-success/20 to-primary/20 border-success/30'
                      : 'bg-muted/30 border-border/50 opacity-75'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`text-2xl ${achievement.unlocked ? '' : 'grayscale'}`}>
                      {achievement.icon}
                    </div>
                    <div>
                      <div className="font-medium">{achievement.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {achievement.description}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    {achievement.unlocked ? (
                      <Badge className="bg-success text-success-foreground">
                        Unlocked
                      </Badge>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleUnlockAchievement(achievement.id)}
                      >
                        {achievement.points} pts
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Carbon Offset Marketplace */}
        <Card className="card-eco">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="w-5 h-5 text-primary" />
              Eco Marketplace
            </CardTitle>
            <CardDescription>Redeem points for eco-friendly rewards</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockMarketplaceItems.map((item) => (
                <div key={item.id} className="card-hero p-4 space-y-3">
                  <div>
                    <h4 className="font-semibold">{item.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-warning" />
                      <span className="font-bold text-warning">
                        {item.points.toLocaleString()} points
                      </span>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleRedeemReward(item.id, item.points)}
                      disabled={userPoints < item.points}
                      className={userPoints >= item.points ? "btn-eco" : ""}
                    >
                      Redeem
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Gamification;