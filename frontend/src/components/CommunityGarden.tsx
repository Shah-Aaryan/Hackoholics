import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { GardenStats } from '@/data/gardenData';
import { Sparkles, CloudRain } from 'lucide-react';

interface CommunityGardenProps {
  stats: GardenStats;
  householdCount: number;
  isAnimating?: boolean;
}

const CommunityGarden = ({ stats, householdCount, isAnimating }: CommunityGardenProps) => {
  const getGardenElements = () => {
    const health = stats.communityHealth;
    const elements = [];
    
    // Base garden elements
    elements.push('🌳', '🌲', '🌿', '🌱');
    
    // Add elements based on health
    if (health >= 80) {
      elements.push('🌺', '🌸', '🌼', '🦋', '🐝');
    } else if (health >= 60) {
      elements.push('🌻', '🌷', '🌹');
    } else if (health >= 40) {
      elements.push('🌾', '🍃');
    } else {
      elements.push('🍂', '🥀');
    }
    
    // Special effects for high efficiency
    if (stats.communityEfficiency >= 15) {
      elements.push('✨', '🌟', '💫');
    }
    
    return elements;
  };

  const getWeatherEffect = () => {
    if (stats.communityEfficiency >= 15) return '☀️';
    if (stats.communityEfficiency >= 5) return '⛅';
    return '🌧️';
  };

  const getGardenMessage = () => {
    if (stats.communityHealth >= 80) return "Your community garden is thriving! 🌟";
    if (stats.communityHealth >= 60) return "The garden is growing well! 🌱";
    if (stats.communityHealth >= 40) return "The garden needs some care. 🤔";
    return "The garden needs urgent attention! 🆘";
  };

  const elements = getGardenElements();

  return (
    <div className="space-y-6">
      {/* Weather and Overall Stats */}
      <Card className="card-eco">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Community Garden Status</span>
            <div className="text-3xl">{getWeatherEffect()}</div>
          </CardTitle>
          <CardDescription>{getGardenMessage()}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="text-2xl font-bold text-primary">
                {stats.communityEfficiency.toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">Efficiency Rate</div>
              <Progress value={stats.communityEfficiency} className="mt-2" />
            </div>
            <div>
              <div className="text-2xl font-bold text-success">
                {stats.totalEnergySaved.toFixed(0)} kWh
              </div>
              <div className="text-sm text-muted-foreground">Total Saved Today</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-accent">
                {householdCount}
              </div>
              <div className="text-sm text-muted-foreground">Active Households</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Garden Visualization */}
      <Card className="card-eco">
        <CardContent className="p-8">
          <div className={`
            min-h-[400px] relative rounded-lg overflow-hidden
            bg-gradient-to-b from-sky-200 to-green-200 dark:from-sky-900 dark:to-green-900
            ${isAnimating ? 'animate-pulse' : ''}
          `}>
            {/* Garden Floor */}
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-green-300 to-green-200 dark:from-green-800 dark:to-green-700" />
            
            {/* Garden Elements */}
            <div className="absolute inset-0 flex flex-wrap items-end justify-center gap-4 p-8">
              {elements.map((element, index) => (
                <div
                  key={`${element}-${index}`}
                  className={`
                    text-2xl md:text-3xl lg:text-4xl
                    transition-all duration-1000
                    ${isAnimating ? 'animate-bounce' : 'hover:scale-110'}
                  `}
                  style={{
                    animationDelay: `${index * 100}ms`,
                    transform: `translateY(${Math.random() * 20}px)`,
                  }}
                >
                  {element}
                </div>
              ))}
            </div>

            {/* Special Effects */}
            {stats.communityEfficiency >= 15 && (
              <div className="absolute top-4 left-4 flex items-center gap-2 bg-white/20 dark:bg-black/20 rounded-full px-3 py-1 backdrop-blur">
                <Sparkles className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-medium">Garden Blessing Active!</span>
              </div>
            )}

            {stats.communityEfficiency < 5 && (
              <div className="absolute top-4 left-4 flex items-center gap-2 bg-white/20 dark:bg-black/20 rounded-full px-3 py-1 backdrop-blur">
                <CloudRain className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium">Garden needs rain...</span>
              </div>
            )}

            {/* Community Milestones */}
            <div className="absolute bottom-4 left-4 right-4">
              <div className="bg-white/80 dark:bg-black/80 rounded-lg p-4 backdrop-blur">
                <h4 className="font-semibold mb-2">Community Achievements</h4>
                <div className="flex flex-wrap gap-2">
                  {stats.totalEnergySaved >= 100 && (
                    <Badge variant="default">Energy Champion 🏆</Badge>
                  )}
                  {stats.communityEfficiency >= 10 && (
                    <Badge variant="secondary">Efficiency Expert ⚡</Badge>
                  )}
                  {stats.communityHealth >= 80 && (
                    <Badge variant="outline">Garden Master 🌿</Badge>
                  )}
                  {householdCount >= 20 && (
                    <Badge variant="outline">Community Strong 🤝</Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Garden Stats Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="card-eco">
          <CardHeader>
            <CardTitle className="text-lg">Today's Impact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span>Energy Baseline:</span>
              <span className="font-medium">{(stats.totalEnergySaved + 500).toFixed(0)} kWh</span>
            </div>
            <div className="flex justify-between">
              <span>Actual Usage:</span>
              <span className="font-medium">500 kWh</span>
            </div>
            <div className="flex justify-between text-success">
              <span>Total Savings:</span>
              <span className="font-bold">{stats.totalEnergySaved.toFixed(0)} kWh</span>
            </div>
            <div className="flex justify-between text-success">
              <span>CO₂ Prevented:</span>
              <span className="font-bold">{(stats.totalEnergySaved * 0.68).toFixed(1)} kg</span>
            </div>
          </CardContent>
        </Card>

        <Card className="card-eco">
          <CardHeader>
            <CardTitle className="text-lg">Garden Health Factors</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span>Energy Efficiency:</span>
              <Badge variant={stats.communityEfficiency >= 10 ? 'default' : 'secondary'}>
                {stats.communityEfficiency >= 10 ? 'Excellent' : 'Good'}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Community Participation:</span>
              <Badge variant="outline">{householdCount} households</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Garden Diversity:</span>
              <Badge variant="outline">{elements.length} species</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Growth Rate:</span>
              <Badge variant={stats.communityHealth > 70 ? 'default' : 'secondary'}>
                {stats.communityHealth > 70 ? 'Thriving' : 'Steady'}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CommunityGarden;