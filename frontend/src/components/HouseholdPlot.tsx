import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { HouseholdData } from '@/data/gardenData';

interface HouseholdPlotProps {
  household: HouseholdData;
  onClick: () => void;
  isAnimating?: boolean;
}

const HouseholdPlot = ({ household, onClick, isAnimating }: HouseholdPlotProps) => {
  const getPlantEmoji = (stage: string, health: number) => {
    if (health < 20) return '🥀';
    switch (stage) {
      case 'blooming': return '🌸';
      case 'growing': return '🌿';
      case 'sprouting': return '🌱';
      case 'wilting': return '🍂';
      default: return '🌿';
    }
  };

  const getPlantSize = (health: number) => {
    if (health >= 80) return 'text-4xl';
    if (health >= 60) return 'text-3xl';
    if (health >= 40) return 'text-2xl';
    return 'text-xl';
  };

  const getHealthColor = (health: number) => {
    if (health >= 70) return 'border-success';
    if (health >= 40) return 'border-warning';
    return 'border-destructive';
  };

  const getBadgeVariant = (stage: string) => {
    switch (stage) {
      case 'blooming': return 'default' as const;
      case 'growing': return 'secondary' as const;
      case 'sprouting': return 'outline' as const;
      case 'wilting': return 'destructive' as const;
      default: return 'outline' as const;
    }
  };

  const isEfficient = household.energySaved > 0;

  return (
    <Card 
      className={`
        card-eco cursor-pointer transition-all duration-500 hover:shadow-lg hover:scale-105
        ${getHealthColor(household.plantHealth)}
        ${isEfficient ? 'ring-2 ring-success/20' : ''}
        ${isAnimating ? 'animate-pulse' : ''}
      `}
      onClick={onClick}
    >
      <CardContent className="p-4 text-center space-y-3">
        {/* Plant Visualization */}
        <div className="relative">
          <div className={`${getPlantSize(household.plantHealth)} transition-all duration-1000 ${isAnimating ? 'animate-bounce' : ''}`}>
            {getPlantEmoji(household.plantStage, household.plantHealth)}
          </div>
          {isEfficient && (
            <div className="absolute -top-1 -right-1 text-xs animate-pulse">✨</div>
          )}
        </div>

        {/* Household Info */}
        <div className="space-y-2">
          <h3 className="font-semibold text-sm truncate">{household.name}</h3>
          <Badge variant={getBadgeVariant(household.plantStage)} className="text-xs">
            {household.plantStage}
          </Badge>
        </div>

        {/* Stats */}
        <div className="text-xs space-y-1">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Usage:</span>
            <span className={household.currentUsage < household.baseline ? 'text-success font-medium' : 'text-destructive'}>
              {household.currentUsage.toFixed(0)} kWh
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Saved:</span>
            <span className="text-success font-medium">
              {household.energySaved.toFixed(1)} kWh
            </span>
          </div>
        </div>

        {/* Health Bar */}
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-1000 ${
              household.plantHealth >= 70 ? 'bg-success' : 
              household.plantHealth >= 40 ? 'bg-warning' : 'bg-destructive'
            }`}
            style={{ width: `${household.plantHealth}%` }}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default HouseholdPlot;