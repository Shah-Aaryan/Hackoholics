import { useState, useEffect } from 'react';
import { RefreshCw, Lightbulb, TrendingDown, Users, Zap, Leaf, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import TreeVisualization from '@/components/TreeVisualization';
import HeatMap from '@/components/HeatMap';
import { mockEnergyData, getAIRecommendations, EnergyData } from '@/data/mockData';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from "react-router-dom";
import { useAuth } from '@/contexts/AuthContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [energyData, setEnergyData] = useState<EnergyData>(mockEnergyData);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  // User is guaranteed to be authenticated due to ProtectedRoute

  const handleLogout = () => {
    logout();
    navigate('/');
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account.",
    });
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setTimeout(() => {
      const variation = (Math.random() - 0.5) * 50;
      const newData = {
        ...energyData,
        household: {
          ...energyData.household,
          currentUsage: Math.max(300, energyData.household.currentUsage + variation),
          carbonFootprint: Math.max(200, energyData.household.carbonFootprint + variation * 0.68),
        },
        tree: {
          ...energyData.tree,
          health: Math.max(0, Math.min(100, energyData.tree.health + (variation > 0 ? -5 : 5))),
        }
      };
      setEnergyData(newData);
      setIsRefreshing(false);
      toast({ title: "Data Refreshed", description: "Your energy data has been updated." });
    }, 2000);
  };

  const recommendations = getAIRecommendations(energyData, 'summer');
   const weeklyData: number[][] = Array.from({ length: 7 }, () =>
    Array.from({ length: 24 }, () => Math.floor(Math.random() * 10))
  );

  const getChartData = () => {
    switch (viewMode) {
      case 'daily':
        return energyData.household.dailyUsage.map((usage, index) => ({
          name: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index],
          usage,
          target: 25
        }));
      case 'weekly':
        return energyData.household.weeklyUsage.map((usage, index) => ({
          name: `Week ${index + 1}`,
          usage,
          target: 170
        }));
      case 'monthly':
        return energyData.household.monthlyUsage.map((usage, index) => ({
          name: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][index],
          usage,
          target: 400
        }));
      default:
        return [];
    }
  };

  const chartData = getChartData();

  // User is guaranteed to be authenticated due to ProtectedRoute

  return (
    <div className="container mx-auto p-6 space-y-6 font-sans">
  {/* Welcome Header */}
  <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-900 rounded-lg p-6 border border-green-200 dark:border-gray-700">
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-green-500 bg-clip-text text-transparent">
          Welcome back!
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">
          Track your energy usage and environmental impact for <strong>{user.householdName}</strong>
        </p>
        <div className="flex items-center mt-2 text-sm text-gray-500 dark:text-gray-400">
          <User className="w-4 h-4 mr-1" />
          {user.email}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh Data
        </Button>
        <div className="flex flex-wrap gap-4">
          <Button
            onClick={() => navigate("/marketplace")}
            className="bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-500 dark:to-green-600 hover:from-green-700 hover:to-emerald-700 text-white"
          >
            🌱 Explore Green Marketplace
          </Button>
        </div>
      </div>
    </div>
  </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tree & Heatmap Visualization */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="card-eco">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">🌳 Tree Health</CardTitle>
            </CardHeader>
            <CardContent>
              <TreeVisualization data={energyData} isAnimating={isRefreshing} />
            </CardContent>
          </Card>

          <Card className="card-eco">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">🔥 Energy Heatmap</CardTitle>
              <CardDescription className="text-sm">Identify peak consumption hours</CardDescription>
            </CardHeader>
            <CardContent>
                <HeatMap data={weeklyData} />
            </CardContent>
          </Card>
        </div>

        {/* Stats Cards & AI Recommendations */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Household Usage */}
            <Card className="card-eco">
              <CardHeader className="flex items-center justify-between pb-2">
                <CardTitle className="text-lg font-semibold">Household Usage</CardTitle>
                <Zap className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">
                  {energyData.household.currentUsage} kWh
                </div>
                <p className="text-sm text-muted-foreground">
                  {energyData.household.currentUsage < energyData.household.monthlyAverage ? '📉' : '📈'} 
                  {' '}vs {energyData.household.monthlyAverage} kWh avg
                </p>
                <Progress 
                  value={(energyData.household.currentUsage / energyData.household.monthlyAverage) * 100} 
                  className="mt-2"
                />
              </CardContent>
            </Card>

            {/* Neighborhood Stats */}
            <Card className="card-eco">
              <CardHeader className="flex items-center justify-between pb-2">
                <CardTitle className="text-lg font-semibold">Neighborhood Average</CardTitle>
                <Users className="h-5 w-5 text-secondary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-secondary">{energyData.neighborhood.averageUsage} kWh</div>
                <p className="text-sm text-muted-foreground">{energyData.neighborhood.participatingHomes} homes participating</p>
                <div className="flex items-center mt-2">
                  <TrendingDown className="w-4 h-4 text-success mr-1" />
                  <span className="text-success text-sm">{energyData.neighborhood.totalSavings} kWh saved</span>
                </div>
              </CardContent>
            </Card>

            {/* Carbon Impact */}
            <Card className="card-eco">
              <CardHeader className="flex items-center justify-between pb-2">
                <CardTitle className="text-lg font-semibold">Carbon Impact</CardTitle>
                <Leaf className="h-5 w-5 text-success" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-success">{energyData.household.carbonFootprint.toFixed(1)} kg</div>
                <p className="text-sm text-muted-foreground">CO₂ emissions this month</p>
                <div className="text-sm text-success mt-2">12% below neighborhood average</div>
              </CardContent>
            </Card>

            {/* AI Recommendations */}
            <Card className="card-eco">
              <CardHeader className="flex items-center justify-between pb-2">
                <CardTitle className="text-lg font-semibold">AI Recommendations</CardTitle>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm" className="btn-eco h-8">
                      <Lightbulb className="w-4 h-4 mr-1" />
                      View Tips
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <Lightbulb className="w-5 h-5 text-primary" />
                        Personalized Energy Recommendations
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      {recommendations.map((rec, index) => (
                        <div key={index} className="card-eco p-4">
                          <h4 className="font-semibold text-primary mb-2">{rec.title}</h4>
                          <p className="text-sm text-muted-foreground mb-2">{rec.description}</p>
                          <p className="text-sm mb-2">{rec.tip}</p>
                          <div className="text-success font-medium text-sm">
                            💰 Potential savings: {rec.savings}
                          </div>
                        </div>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-accent">{recommendations.length}</div>
                <p className="text-sm text-muted-foreground">personalized tips available</p>
              </CardContent>
            </Card>
          </div>

          {/* Usage Chart */}
          <Card className="card-eco">
            <CardHeader className="flex justify-between items-center">
              <div>
                <CardTitle className="text-lg font-semibold">Usage Trends</CardTitle>
                <CardDescription className="text-sm">Track your energy consumption patterns</CardDescription>
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
            </CardHeader>
            <CardContent>
              <div className="h-72 flex items-end justify-center gap-2 p-4">
                {chartData.map((data, index) => (
                  <div key={index} className="flex flex-col items-center gap-2">
                    <div 
                      className="bg-gradient-eco w-8 rounded-t-md transition-all duration-1000"
                      style={{ height: `${(data.usage / Math.max(...chartData.map(d => d.usage))) * 200}px` }}
                    />
                    <span className="text-xs text-muted-foreground">{data.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
