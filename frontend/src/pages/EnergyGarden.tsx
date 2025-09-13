import { useState, useEffect } from 'react';
import { RefreshCw, Users, TreePine, Sprout, Eye, EyeOff, Monitor, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import HouseholdPlot from '@/components/HouseholdPlot';
import CommunityGarden from '@/components/CommunityGarden';
import EnergyGarden3D from '@/components/EnergyGarden3D';
import { mockHouseholdData, mockGardenStats, GardenStats, HouseholdData } from '@/data/gardenData';
import { toast } from '@/hooks/use-toast';

const EnergyGarden = () => {
  const [gardenStats, setGardenStats] = useState<GardenStats>(mockGardenStats);
  const [householdData, setHouseholdData] = useState<HouseholdData[]>(mockHouseholdData);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState<'household' | 'community'>('household');
  const [selectedHousehold, setSelectedHousehold] = useState<HouseholdData | null>(null);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    
    setTimeout(() => {
      // Simulate API call with random data variations
      const newHouseholds = householdData.map(household => {
        const variation = (Math.random() - 0.5) * 20;
        const newUsage = Math.max(50, household.currentUsage + variation);
        const isSaving = newUsage < household.baseline;
        const newHealth = Math.max(0, Math.min(100, household.plantHealth + (isSaving ? 10 : -5)));
        
        const getPlantStage = (health: number): 'wilting' | 'sprouting' | 'growing' | 'blooming' => {
          if (health > 80) return 'blooming';
          if (health > 60) return 'growing';
          if (health > 30) return 'sprouting';
          return 'wilting';
        };
        
        return {
          ...household,
          currentUsage: newUsage,
          plantHealth: newHealth,
          plantStage: getPlantStage(newHealth),
          energySaved: Math.max(0, household.baseline - newUsage),
          carbonSaved: Math.max(0, (household.baseline - newUsage) * 0.68)
        };
      });
      
      const totalSaved = newHouseholds.reduce((acc, h) => acc + h.energySaved, 0);
      const totalBaseline = newHouseholds.reduce((acc, h) => acc + h.baseline, 0);
      const efficiencyPercentage = Math.max(0, (totalSaved / totalBaseline) * 100);
      
      setHouseholdData(newHouseholds);
      setGardenStats({
        ...gardenStats,
        communityEfficiency: efficiencyPercentage,
        totalEnergySaved: totalSaved,
        communityHealth: Math.max(0, Math.min(100, gardenStats.communityHealth + (efficiencyPercentage > 10 ? 15 : -5)))
      });
      
      setIsRefreshing(false);
      toast({
        title: "Garden Updated! 🌱",
        description: `Community efficiency: ${efficiencyPercentage.toFixed(1)}%`,
      });
    }, 2000);
  };

  const handlePlotClick = (household: HouseholdData) => {
    setSelectedHousehold(household);
  };

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 15) return 'text-success';
    if (efficiency >= 5) return 'text-warning';
    return 'text-destructive';
  };

  const getEfficiencyBadge = (efficiency: number) => {
    if (efficiency >= 15) return { text: 'Excellent', variant: 'default' as const };
    if (efficiency >= 5) return { text: 'Good', variant: 'secondary' as const };
    return { text: 'Needs Care', variant: 'destructive' as const };
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            🌿 Energy Garden 3D
          </h1>
          <p className="text-muted-foreground">
            Immersive 3D visualization of your community's carbon footprint as living gardens
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="btn-eco"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh Garden
          </Button>
        </div>
      </div>

      {/* Garden Stats Bar */}
      <Card className="card-eco">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className={`text-2xl font-bold ${getEfficiencyColor(gardenStats.communityEfficiency)}`}>
                {gardenStats.communityEfficiency.toFixed(1)}%
              </div>
              <p className="text-sm text-muted-foreground">Below Baseline</p>
              <Badge variant={getEfficiencyBadge(gardenStats.communityEfficiency).variant} className="mt-1">
                {getEfficiencyBadge(gardenStats.communityEfficiency).text}
              </Badge>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-success">
                {gardenStats.totalEnergySaved.toFixed(0)} kWh
              </div>
              <p className="text-sm text-muted-foreground">Energy Saved Today</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">
                {gardenStats.communityHealth}%
              </div>
              <p className="text-sm text-muted-foreground">Garden Health</p>
              <Progress value={gardenStats.communityHealth} className="mt-2" />
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {householdData.filter(h => h.plantStage === 'blooming').length}
              </div>
              <p className="text-sm text-muted-foreground">Households Blooming</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Garden Area */}
      <Tabs defaultValue="3d" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="3d" className="flex items-center gap-2">
            <Monitor className="w-4 h-4" />
            3D Garden
          </TabsTrigger>
          <TabsTrigger value="2d" className="flex items-center gap-2">
            <Smartphone className="w-4 h-4" />
            2D View
          </TabsTrigger>
          <TabsTrigger value="community" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Community
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="3d" className="mt-6">
          <div className="h-[600px] rounded-lg overflow-hidden border">
            <EnergyGarden3D
              householdData={householdData}
              gardenStats={gardenStats}
              onRefresh={handleRefresh}
              isRefreshing={isRefreshing}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="2d" className="mt-6">
          <div className="min-h-[600px]">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {householdData.map((household) => (
                <HouseholdPlot
                  key={household.id}
                  household={household}
                  onClick={() => handlePlotClick(household)}
                  isAnimating={isRefreshing}
                />
              ))}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="community" className="mt-6">
          <div className="min-h-[600px]">
            <CommunityGarden
              stats={gardenStats}
              householdCount={householdData.length}
              isAnimating={isRefreshing}
            />
          </div>
        </TabsContent>
      </Tabs>

      {/* Household Detail Modal */}
      <Dialog open={!!selectedHousehold} onOpenChange={() => setSelectedHousehold(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sprout className="w-5 h-5 text-primary" />
              {selectedHousehold?.name}'s Garden Plot
            </DialogTitle>
          </DialogHeader>
          {selectedHousehold && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="card-eco p-3">
                  <div className="text-sm text-muted-foreground">Current Usage</div>
                  <div className="text-lg font-bold text-primary">
                    {selectedHousehold.currentUsage.toFixed(0)} kWh
                  </div>
                </div>
                <div className="card-eco p-3">
                  <div className="text-sm text-muted-foreground">Baseline</div>
                  <div className="text-lg font-bold">
                    {selectedHousehold.baseline.toFixed(0)} kWh
                  </div>
                </div>
                <div className="card-eco p-3">
                  <div className="text-sm text-muted-foreground">Energy Saved</div>
                  <div className="text-lg font-bold text-success">
                    {selectedHousehold.energySaved.toFixed(1)} kWh
                  </div>
                </div>
                <div className="card-eco p-3">
                  <div className="text-sm text-muted-foreground">CO₂ Reduced</div>
                  <div className="text-lg font-bold text-success">
                    {selectedHousehold.carbonSaved.toFixed(1)} kg
                  </div>
                </div>
              </div>
              
              <div className="card-eco p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Plant Health</span>
                  <Badge variant={selectedHousehold.plantHealth > 70 ? 'default' : 'secondary'}>
                    {selectedHousehold.plantStage}
                  </Badge>
                </div>
                <Progress value={selectedHousehold.plantHealth} className="mb-2" />
                <div className="text-xs text-muted-foreground">
                  {selectedHousehold.plantHealth}% healthy
                </div>
              </div>

              <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-4">
                <h4 className="font-semibold mb-2">💡 Personalized Tips</h4>
                <ul className="text-sm space-y-1">
                  {selectedHousehold.plantHealth < 50 && (
                    <li>• Consider adjusting thermostat by 2°F</li>
                  )}
                  {selectedHousehold.energySaved < 5 && (
                    <li>• Unplug devices when not in use</li>
                  )}
                  <li>• Use LED bulbs to boost your garden</li>
                  <li>• Schedule heavy appliances during off-peak hours</li>
                </ul>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EnergyGarden;