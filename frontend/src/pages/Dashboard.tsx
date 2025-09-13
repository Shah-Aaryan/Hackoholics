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

          {/* Enhanced Analytics & Visualizations */}
          <div className="space-y-6">
            {/* Energy Usage Trends with Multiple Views */}
            <Card className="card-eco">
              <CardHeader className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    📊 Energy Usage Analytics
                    <span className="text-sm font-normal text-muted-foreground">Detailed consumption patterns</span>
                  </CardTitle>
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
                {/* Enhanced Bar Chart with Values */}
                <div className="h-80 flex items-end justify-center gap-3 p-6 bg-gradient-to-t from-green-50 to-transparent rounded-lg">
                  {chartData.map((data, index) => {
                    const maxUsage = Math.max(...chartData.map(d => d.usage));
                    const height = (data.usage / maxUsage) * 250;
                    const isAboveTarget = data.usage > data.target;
                    
                    return (
                      <div key={index} className="flex flex-col items-center gap-3 group">
                        {/* Usage Value */}
                        <div className="text-xs font-semibold text-gray-600 bg-white px-2 py-1 rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                          {data.usage} kWh
                        </div>
                        
                        {/* Bar Chart */}
                        <div className="relative">
                          {/* Target Line */}
                          <div 
                            className="absolute w-12 border-t-2 border-dashed border-orange-400 opacity-60"
                            style={{ bottom: `${(data.target / maxUsage) * 250}px` }}
                          />
                          
                          {/* Usage Bar */}
                          <div 
                            className={`w-12 rounded-t-lg transition-all duration-1000 ${
                              isAboveTarget 
                                ? 'bg-gradient-to-t from-red-500 to-red-400' 
                                : 'bg-gradient-to-t from-green-500 to-green-400'
                            } shadow-lg hover:shadow-xl`}
                            style={{ height: `${height}px` }}
                          />
                          
                          {/* Target Indicator */}
                          <div 
                            className="absolute w-12 h-1 bg-orange-400 rounded-full"
                            style={{ bottom: `${(data.target / maxUsage) * 250}px` }}
                          />
                        </div>
                        
                        {/* Day Label */}
                        <div className="text-center">
                          <div className="text-sm font-medium text-gray-700">{data.name}</div>
                          <div className="text-xs text-gray-500">Target: {data.target}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {/* Chart Legend */}
                <div className="flex justify-center gap-6 mt-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                    <span>Within Target</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-500 rounded"></div>
                    <span>Above Target</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-1 bg-orange-400 rounded-full"></div>
                    <span>Target Line</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Carbon Footprint Timeline */}
            <Card className="card-eco">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  🌍 Carbon Footprint Timeline
                  <span className="text-sm font-normal text-muted-foreground">Your environmental impact over time</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 relative">
                  {/* Background Grid */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="grid grid-cols-12 grid-rows-6 h-full">
                      {Array.from({ length: 72 }).map((_, i) => (
                        <div key={i} className="border border-gray-200"></div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Carbon Footprint Line Chart */}
                  <div className="relative h-full p-4">
                    <svg className="w-full h-full" viewBox="0 0 400 200">
                      {/* Y-axis labels */}
                      <text x="10" y="20" className="text-xs fill-gray-500">200 kg</text>
                      <text x="10" y="60" className="text-xs fill-gray-500">150 kg</text>
                      <text x="10" y="100" className="text-xs fill-gray-500">100 kg</text>
                      <text x="10" y="140" className="text-xs fill-gray-500">50 kg</text>
                      <text x="10" y="180" className="text-xs fill-gray-500">0 kg</text>
                      
                      {/* Carbon footprint line */}
                      <polyline
                        points="50,150 100,120 150,100 200,80 250,90 300,70 350,60"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="3"
                        className="drop-shadow-sm"
                      />
                      
                      {/* Data points */}
                      {[
                        { x: 50, y: 150, value: 180 },
                        { x: 100, y: 120, value: 140 },
                        { x: 150, y: 100, value: 100 },
                        { x: 200, y: 80, value: 80 },
                        { x: 250, y: 90, value: 90 },
                        { x: 300, y: 70, value: 70 },
                        { x: 350, y: 60, value: 60 }
                      ].map((point, index) => (
                        <g key={index}>
                          <circle
                            cx={point.x}
                            cy={point.y}
                            r="6"
                            fill="#10b981"
                            className="drop-shadow-md"
                          />
                          <text
                            x={point.x}
                            y={point.y - 15}
                            className="text-xs fill-gray-700 font-medium"
                            textAnchor="middle"
                          >
                            {point.value}kg
                          </text>
                        </g>
                      ))}
                    </svg>
                    
                    {/* X-axis labels */}
                    <div className="flex justify-between mt-2 text-xs text-gray-500">
                      <span>Jan</span>
                      <span>Feb</span>
                      <span>Mar</span>
                      <span>Apr</span>
                      <span>May</span>
                      <span>Jun</span>
                      <span>Jul</span>
                    </div>
                  </div>
                </div>
                
                {/* Trend Analysis */}
                <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-green-800">📉 Great Progress!</h4>
                      <p className="text-sm text-green-600">You've reduced your carbon footprint by 67% this year</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-700">-120 kg</div>
                      <div className="text-sm text-green-600">CO₂ saved</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>


            {/* Cost Analysis */}
            <Card className="card-eco">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  💰 Cost Analysis & Savings Potential
                  <span className="text-sm font-normal text-muted-foreground">Financial impact of your energy usage</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Current Costs */}
                  <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                    <div className="text-3xl mb-2">💸</div>
                    <h3 className="font-semibold text-blue-800 mb-2">Current Monthly Cost</h3>
                    <div className="text-3xl font-bold text-blue-700 mb-1">
                      ${(energyData.household.currentUsage * 0.12).toFixed(0)}
                    </div>
                    <p className="text-sm text-blue-600">Based on current usage</p>
                  </div>
                  
                  {/* Potential Savings */}
                  <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                    <div className="text-3xl mb-2">💚</div>
                    <h3 className="font-semibold text-green-800 mb-2">Potential Savings</h3>
                    <div className="text-3xl font-bold text-green-700 mb-1">
                      ${(energyData.household.currentUsage * 0.12 * 0.25).toFixed(0)}
                    </div>
                    <p className="text-sm text-green-600">With efficiency improvements</p>
                  </div>
                  
                  {/* Annual Impact */}
                  <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                    <div className="text-3xl mb-2">📈</div>
                    <h3 className="font-semibold text-purple-800 mb-2">Annual Impact</h3>
                    <div className="text-3xl font-bold text-purple-700 mb-1">
                      ${(energyData.household.currentUsage * 0.12 * 0.25 * 12).toFixed(0)}
                    </div>
                    <p className="text-sm text-purple-600">Yearly savings potential</p>
                  </div>
                </div>
                
                {/* Savings Timeline */}
                <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg">
                  <h4 className="font-semibold text-yellow-800 mb-3">💡 Quick Wins Timeline</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Week 1: LED Bulb Replacement</span>
                      <span className="text-sm font-semibold text-green-600">-$15/month</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Week 2: Smart Thermostat</span>
                      <span className="text-sm font-semibold text-green-600">-$25/month</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Week 3: Energy Audit</span>
                      <span className="text-sm font-semibold text-green-600">-$10/month</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Week 4: Appliance Upgrade</span>
                      <span className="text-sm font-semibold text-green-600">-$20/month</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

                      {/* Energy Efficiency Breakdown */}
            <Card className="card-eco">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  ⚡ Energy Efficiency Breakdown
                  <span className="text-sm font-normal text-muted-foreground">Where your energy goes</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Pie Chart */}
                  <div className="flex items-center justify-center">
                    <div className="relative w-48 h-48">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        {/* Pie slices */}
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="#ef4444"
                          strokeWidth="8"
                          strokeDasharray={`${(35/100) * 251.2} 251.2`}
                          strokeDashoffset="0"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="#f59e0b"
                          strokeWidth="8"
                          strokeDasharray={`${(25/100) * 251.2} 251.2`}
                          strokeDashoffset={`-${(35/100) * 251.2}`}
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="8"
                          strokeDasharray={`${(20/100) * 251.2} 251.2`}
                          strokeDashoffset={`-${(60/100) * 251.2}`}
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="#3b82f6"
                          strokeWidth="8"
                          strokeDasharray={`${(20/100) * 251.2} 251.2`}
                          strokeDashoffset={`-${(80/100) * 251.2}`}
                        />
                      </svg>
                      
                      {/* Center text */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gray-800">{energyData.household.currentUsage}</div>
                          <div className="text-sm text-gray-600">kWh</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Legend and Details */}
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 bg-red-500 rounded"></div>
                          <span className="font-medium">Heating & Cooling</span>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-red-700">35%</div>
                          <div className="text-sm text-red-600">{(energyData.household.currentUsage * 0.35).toFixed(0)} kWh</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                          <span className="font-medium">Lighting</span>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-yellow-700">25%</div>
                          <div className="text-sm text-yellow-600">{(energyData.household.currentUsage * 0.25).toFixed(0)} kWh</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 bg-green-500 rounded"></div>
                          <span className="font-medium">Appliances</span>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-green-700">20%</div>
                          <div className="text-sm text-green-600">{(energyData.household.currentUsage * 0.20).toFixed(0)} kWh</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 bg-blue-500 rounded"></div>
                          <span className="font-medium">Electronics</span>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-blue-700">20%</div>
                          <div className="text-sm text-blue-600">{(energyData.household.currentUsage * 0.20).toFixed(0)} kWh</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

          {/* Personalized Insights & Savings */}
          <Card className="card-eco">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                💡 Your Personalized Insights
                <span className="text-sm font-normal text-muted-foreground">Based on your usage patterns</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Energy Savings Potential */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center">
                      💰
                    </div>
                    <div>
                      <h4 className="font-semibold text-green-800 dark:text-green-200">Monthly Savings</h4>
                      <p className="text-sm text-green-600 dark:text-green-400">Potential reduction</p>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-green-700 dark:text-green-300 mb-1">
                    ${(energyData.household.currentUsage * 0.15).toFixed(0)}
                  </div>
                  <p className="text-sm text-green-600 dark:text-green-400">
                    By switching to LED bulbs and smart thermostats
                  </p>
                </div>

                {/* Carbon Footprint Impact */}
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center">
                      🌍
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-800 dark:text-blue-200">CO₂ Reduction</h4>
                      <p className="text-sm text-blue-600 dark:text-blue-400">Monthly impact</p>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-blue-700 dark:text-blue-300 mb-1">
                    {(energyData.household.carbonFootprint * 0.2).toFixed(1)} kg
                  </div>
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    Equivalent to planting {(energyData.household.carbonFootprint * 0.2 / 22).toFixed(1)} trees
                  </p>
                </div>

                {/* Efficiency Score */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-800 rounded-full flex items-center justify-center">
                      ⚡
                    </div>
                    <div>
                      <h4 className="font-semibold text-purple-800 dark:text-purple-200">Efficiency Score</h4>
                      <p className="text-sm text-purple-600 dark:text-purple-400">Your rating</p>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-purple-700 dark:text-purple-300 mb-1">
                    {Math.max(60, 100 - (energyData.household.currentUsage / energyData.household.monthlyAverage) * 20).toFixed(0)}/100
                  </div>
                  <p className="text-sm text-purple-600 dark:text-purple-400">
                    {energyData.household.currentUsage < energyData.household.monthlyAverage ? "Above average!" : "Room for improvement"}
                  </p>
                </div>
              </div>

              {/* Actionable Recommendations */}
              <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-3 flex items-center gap-2">
                  🎯 Quick Actions You Can Take Today
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-yellow-100 dark:bg-yellow-800 rounded-full flex items-center justify-center text-sm font-bold text-yellow-700 dark:text-yellow-300">1</div>
                    <div>
                      <p className="font-medium text-yellow-800 dark:text-yellow-200">Unplug unused devices</p>
                      <p className="text-sm text-yellow-600 dark:text-yellow-400">Save ~$15/month</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-yellow-100 dark:bg-yellow-800 rounded-full flex items-center justify-center text-sm font-bold text-yellow-700 dark:text-yellow-300">2</div>
                    <div>
                      <p className="font-medium text-yellow-800 dark:text-yellow-200">Lower thermostat by 2°F</p>
                      <p className="text-sm text-yellow-600 dark:text-yellow-400">Save ~$25/month</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-yellow-100 dark:bg-yellow-800 rounded-full flex items-center justify-center text-sm font-bold text-yellow-700 dark:text-yellow-300">3</div>
                    <div>
                      <p className="font-medium text-yellow-800 dark:text-yellow-200">Use natural light more</p>
                      <p className="text-sm text-yellow-600 dark:text-yellow-400">Save ~$10/month</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-yellow-100 dark:bg-yellow-800 rounded-full flex items-center justify-center text-sm font-bold text-yellow-700 dark:text-yellow-300">4</div>
                    <div>
                      <p className="font-medium text-yellow-800 dark:text-yellow-200">Wash clothes in cold water</p>
                      <p className="text-sm text-yellow-600 dark:text-yellow-400">Save ~$8/month</p>
                    </div>
                  </div>
                </div>
              </div>

              
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
