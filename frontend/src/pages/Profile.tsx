import { useState } from 'react';
import { User, Settings, Zap, Leaf, Trophy, Bell, Palette, Clock, Link2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';

const Profile = () => {
  const [profile, setProfile] = useState({
    name: 'Alex Rivera',
    email: 'alex.rivera@email.com',
    address: '123 Oak Street, EcoVille',
    avatar: '👤'
  });

  const [settings, setSettings] = useState({
    notifications: true,
    emailUpdates: false,
    dataRefresh: '15min',
    theme: 'auto'
  });

  const [isOAuthModalOpen, setIsOAuthModalOpen] = useState(false);

  const userStats = {
    totalEnergySaved: 2840,
    carbonReduced: 1927,
    pointsEarned: 1850,
    achievementsUnlocked: 8,
    streakDays: 12,
    rankPosition: 4
  };

  const achievements = [
    { icon: '🌱', title: 'Energy Saver', description: 'Reduced usage by 10%' },
    { icon: '🌍', title: 'Carbon Crusher', description: 'Saved 100kg CO₂' },
    { icon: '🔥', title: 'Streak Master', description: '10-day saving streak' },
    { icon: '💡', title: 'Efficiency Expert', description: 'LED bulb adoption' },
    { icon: '🏆', title: 'Community Leader', description: 'Top 5 in neighborhood' },
    { icon: '🌳', title: 'Tree Planter', description: 'Virtual forest started' },
    { icon: '⚡', title: 'Peak Avoider', description: 'Off-peak usage champion' },
    { icon: '🎯', title: 'Goal Crusher', description: 'Monthly target achieved' }
  ];

  const handleSaveProfile = () => {
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved successfully.",
    });
  };

  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated.",
    });
  };

  const handleUtilityConnection = () => {
    setIsOAuthModalOpen(true);
  };

  const handleOAuthConnect = (provider: string) => {
    // Simulate OAuth flow
    setTimeout(() => {
      setIsOAuthModalOpen(false);
      toast({
        title: `Connected to ${provider}`,
        description: "Your utility account has been linked successfully. Data will sync automatically.",
      });
    }, 2000);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Profile & Settings
        </h1>
        <p className="text-muted-foreground">
          Manage your account and energy tracking preferences
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile & Stats */}
        <div className="lg:col-span-1 space-y-6">
          {/* Profile Card */}
          <Card className="card-hero">
            <CardHeader className="text-center">
              <div className="w-20 h-20 bg-gradient-eco rounded-full flex items-center justify-center text-3xl text-white mx-auto mb-4">
                {profile.avatar}
              </div>
              <CardTitle>{profile.name}</CardTitle>
              <CardDescription>{profile.email}</CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-3">
              <div className="text-sm text-muted-foreground">
                📍 {profile.address}
              </div>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">{userStats.rankPosition}</div>
                  <div className="text-xs text-muted-foreground">Neighborhood Rank</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-warning">{userStats.streakDays}</div>
                  <div className="text-xs text-muted-foreground">Day Streak</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="card-eco">
            <CardHeader>
              <CardTitle className="text-lg">Your Impact</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-primary" />
                    <span className="text-sm">Energy Saved</span>
                  </div>
                  <span className="font-bold text-primary">{userStats.totalEnergySaved.toLocaleString()} kWh</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Leaf className="w-4 h-4 text-success" />
                    <span className="text-sm">CO₂ Reduced</span>
                  </div>
                  <span className="font-bold text-success">{userStats.carbonReduced.toLocaleString()} kg</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-warning" />
                    <span className="text-sm">Points Earned</span>
                  </div>
                  <span className="font-bold text-warning">{userStats.pointsEarned.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Settings & Achievements */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Settings */}
          <Card className="card-eco">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={profile.address}
                    onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                  />
                </div>
              </div>
              <Button onClick={handleSaveProfile} className="mt-4 btn-eco">
                Save Profile
              </Button>
            </CardContent>
          </Card>

          {/* App Settings */}
          <Card className="card-eco">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Preferences
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="flex items-center gap-2">
                      <Bell className="w-4 h-4" />
                      Push Notifications
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Receive alerts for energy spikes and achievements
                    </p>
                  </div>
                  <Switch
                    checked={settings.notifications}
                    onCheckedChange={(checked) => 
                      setSettings({ ...settings, notifications: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Weekly energy reports and tips
                    </p>
                  </div>
                  <Switch
                    checked={settings.emailUpdates}
                    onCheckedChange={(checked) => 
                      setSettings({ ...settings, emailUpdates: checked })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Data Refresh Frequency
                  </Label>
                  <Select 
                    value={settings.dataRefresh} 
                    onValueChange={(value) => setSettings({ ...settings, dataRefresh: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5min">Every 5 minutes</SelectItem>
                      <SelectItem value="15min">Every 15 minutes</SelectItem>
                      <SelectItem value="30min">Every 30 minutes</SelectItem>
                      <SelectItem value="1hour">Every hour</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Palette className="w-4 h-4" />
                    Theme Preference
                  </Label>
                  <Select 
                    value={settings.theme} 
                    onValueChange={(value) => setSettings({ ...settings, theme: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="auto">Auto (System)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={handleSaveSettings} className="btn-eco">
                  Save Preferences
                </Button>
              </div>
            </CardContent>
          </Card>

          

          {/* Achievements Grid */}
          <Card className="card-eco">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                Your Achievements
              </CardTitle>
              <CardDescription>
                {userStats.achievementsUnlocked} of {achievements.length} badges unlocked
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {achievements.map((achievement, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border text-center transition-all duration-200 ${
                      index < userStats.achievementsUnlocked
                        ? 'bg-gradient-to-br from-success/20 to-primary/20 border-success/30'
                        : 'bg-muted/30 border-border/50 opacity-50'
                    }`}
                  >
                    <div className={`text-2xl mb-1 ${index >= userStats.achievementsUnlocked ? 'grayscale' : ''}`}>
                      {achievement.icon}
                    </div>
                    <div className="text-xs font-medium">{achievement.title}</div>
                    <div className="text-xs text-muted-foreground">{achievement.description}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* OAuth Connection Modal */}
      <Dialog open={isOAuthModalOpen} onOpenChange={setIsOAuthModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connect Your Utility Account</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Select your utility provider to securely connect your account. We use bank-level encryption to protect your data.
            </p>
            
            <div className="grid grid-cols-1 gap-3">
              {['Pacific Gas & Electric', 'Con Edison', 'ComEd', 'Duke Energy', 'Other Provider'].map((provider) => (
                <Button
                  key={provider}
                  variant="outline"
                  onClick={() => handleOAuthConnect(provider)}
                  className="justify-start p-4 h-auto"
                >
                  <div className="text-left">
                    <div className="font-medium">{provider}</div>
                    <div className="text-xs text-muted-foreground">
                      Connect via OAuth 2.0
                    </div>
                  </div>
                </Button>
              ))}
            </div>
            
            <div className="bg-muted/50 rounded-lg p-3">
              <p className="text-xs text-muted-foreground">
                🔒 Your login credentials are never shared with us. We only access your energy usage data to provide personalized insights.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;