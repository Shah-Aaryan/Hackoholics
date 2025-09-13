import { useState, useEffect } from 'react';
import { RefreshCw, Lightbulb, TrendingDown, Users, Zap, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
// Simple chart visualization without recharts
import TreeVisualization from '@/components/TreeVisualization';
import { mockEnergyData, getAIRecommendations, EnergyData } from '@/data/mockData';
import { toast } from '@/hooks/use-toast';

const Dashboard = () => {
  const [energyData, setEnergyData] = useState<EnergyData>(mockEnergyData);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [season, setSeason] = useState<'summer' | 'winter'>('summer');
  const [viewMode, setViewMode] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  const handleRefresh = async () => {
    setIsRefreshing(true);
    
    // Simulate API call with random data variations
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
      
      toast({
        title: "Data Refreshed",
        description: "Your energy data has been updated with the latest readings.",
      });
    }, 2000);
  };

  const recommendations = getAIRecommendations(energyData, season);

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

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Energy Dashboard
          </h1>
          <p className="text-muted-foreground">
            Track your energy usage and environmental impact
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSeason(season === 'summer' ? 'winter' : 'summer')}
          >
            {season === 'summer' ? '☀️ Summer' : '❄️ Winter'}
          </Button>
          <Button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="btn-eco"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh Data
          </Button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tree Visualization */}
        <div className="lg:col-span-1">
          <TreeVisualization data={energyData} isAnimating={isRefreshing} />
        </div>

        {/* Stats Cards */}
        <div className="lg:col-span-2 space-y-6">
          {/* Energy Usage Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="card-eco">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Household Usage</CardTitle>
                <Zap className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">
                  {energyData.household.currentUsage} kWh
                </div>
                <p className="text-xs text-muted-foreground">
                  {energyData.household.currentUsage < energyData.household.monthlyAverage ? '📉' : '📈'} 
                  {' '}vs {energyData.household.monthlyAverage} kWh avg
                </p>
                <Progress 
                  value={(energyData.household.currentUsage / energyData.household.monthlyAverage) * 100} 
                  className="mt-2"
                />
              </CardContent>
            </Card>

            <Card className="card-eco">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Neighborhood Average</CardTitle>
                <Users className="h-4 w-4 text-secondary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-secondary">
                  {energyData.neighborhood.averageUsage} kWh
                </div>
                <p className="text-xs text-muted-foreground">
                  {energyData.neighborhood.participatingHomes} homes participating
                </p>
                <div className="flex items-center mt-2">
                  <TrendingDown className="w-4 h-4 text-success mr-1" />
                  <span className="text-success text-sm">
                    {energyData.neighborhood.totalSavings} kWh saved this month
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="card-eco">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Carbon Impact</CardTitle>
                <Leaf className="h-4 w-4 text-success" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-success">
                  {energyData.household.carbonFootprint.toFixed(1)} kg
                </div>
                <p className="text-xs text-muted-foreground">
                  CO₂ emissions this month
                </p>
                <div className="text-xs text-success mt-2">
                  12% below neighborhood average
                </div>
              </CardContent>
            </Card>

            <Card className="card-eco">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">AI Recommendations</CardTitle>
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
                      
                      <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-4">
                        <h4 className="font-semibold mb-2">🧠 AI Analysis</h4>
                        <p className="text-sm text-muted-foreground">
                          Based on your usage patterns, peak consumption occurs between 4-9 PM. 
                          Your seasonal adjustment for {season} suggests focusing on {
                            season === 'summer' ? 'cooling efficiency' : 'heating optimization'
                          }.
                        </p>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-accent">
                  {recommendations.length}
                </div>
                <p className="text-xs text-muted-foreground">
                  personalized tips available
                </p>
                <div className="text-xs text-primary mt-2">
                  AI-powered insights ready
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Usage Chart */}
          <Card className="card-eco">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Usage Trends</CardTitle>
                  <CardDescription>
                    Track your energy consumption patterns
                  </CardDescription>
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