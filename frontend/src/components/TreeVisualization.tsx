import { useEffect, useState } from 'react';
import { Leaf, TreePine, Award } from 'lucide-react';
import { EnergyData } from '@/data/mockData';

interface TreeVisualizationProps {
  data: EnergyData;
  isAnimating: boolean;
}

const TreeVisualization = ({ data, isAnimating }: TreeVisualizationProps) => {
  const [treeClass, setTreeClass] = useState('');
  const { tree } = data;

  useEffect(() => {
    if (isAnimating) {
      const prevHealth = localStorage.getItem('prevTreeHealth');
      const currentHealth = tree.health;
      
      if (prevHealth) {
        const prev = parseInt(prevHealth);
        if (currentHealth > prev) {
          setTreeClass('tree-grow');
        } else if (currentHealth < prev) {
          setTreeClass('tree-shrink');
        }
      }
      
      localStorage.setItem('prevTreeHealth', currentHealth.toString());
      
      // Clear animation class after animation completes
      setTimeout(() => setTreeClass(''), 2000);
    }
  }, [tree.health, isAnimating]);

  const getTreeStageIcon = () => {
    switch (tree.stage) {
      case 'seedling':
        return <Leaf className="w-16 h-16 text-primary" />;
      case 'young':
        return <TreePine className="w-20 h-20 text-primary" />;
      case 'mature':
        return <TreePine className="w-24 h-24 text-primary" />;
      case 'giant':
        return <TreePine className="w-28 h-28 text-primary eco-glow" />;
      default:
        return <Leaf className="w-16 h-16 text-primary" />;
    }
  };

  const getTreeBackground = () => {
    const healthPercent = tree.health;
    if (healthPercent >= 90) return 'bg-gradient-to-br from-success/20 to-primary/20';
    if (healthPercent >= 70) return 'bg-gradient-to-br from-primary/20 to-accent/20';
    if (healthPercent >= 50) return 'bg-gradient-to-br from-accent/20 to-secondary/20';
    return 'bg-gradient-to-br from-muted/20 to-border/20';
  };

  const getHealthColor = () => {
    const healthPercent = tree.health;
    if (healthPercent >= 80) return 'text-success';
    if (healthPercent >= 60) return 'text-primary';
    if (healthPercent >= 40) return 'text-warning';
    return 'text-destructive';
  };

  const getStageProgress = () => {
    const stages = ['seedling', 'young', 'mature', 'giant'];
    const currentIndex = stages.indexOf(tree.stage);
    return ((currentIndex + 1) / stages.length) * 100;
  };

  return (
    <div className={`card-hero p-8 text-center ${getTreeBackground()}`}>
      <div className="space-y-6">
        {/* Tree Icon with Animation */}
        <div className={`flex justify-center transition-all duration-500 ${treeClass}`}>
          <div className="relative">
            {getTreeStageIcon()}
            {tree.health >= 90 && (
              <Award className="absolute -top-2 -right-2 w-6 h-6 text-warning animate-bounce" />
            )}
          </div>
        </div>

        {/* Tree Stats */}
        <div className="space-y-4">
          <div>
            <h3 className="text-2xl font-bold text-foreground mb-2">
              Your Eco Tree
            </h3>
            <p className="text-muted-foreground capitalize">
              {tree.stage.replace('_', ' ')} Stage
            </p>
          </div>

          {/* Health Bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Tree Health</span>
              <span className={`text-sm font-bold ${getHealthColor()}`}>
                {tree.health}%
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
              <div
                className={`h-full transition-all duration-1000 ease-out ${
                  tree.health >= 80 
                    ? 'bg-gradient-to-r from-success to-primary' 
                    : tree.health >= 60
                    ? 'bg-gradient-to-r from-primary to-accent'
                    : 'bg-gradient-to-r from-warning to-destructive'
                }`}
                style={{ width: `${tree.health}%` }}
              />
            </div>
          </div>

          {/* Stage Progress */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Stage Progress</span>
              <span className="text-sm font-bold text-primary">
                {Math.round(getStageProgress())}%
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-gradient-eco transition-all duration-1000 ease-out"
                style={{ width: `${getStageProgress()}%` }}
              />
            </div>
          </div>

          {/* CO2 Absorbed */}
          <div className="bg-card/50 rounded-lg p-4 border border-border/50">
            <div className="text-center">
              <div className="text-2xl font-bold text-success">
                {tree.co2Absorbed.toFixed(1)}
              </div>
              <div className="text-sm text-muted-foreground">
                kg CO₂ absorbed this month
              </div>
            </div>
          </div>

          {/* Growth Tips */}
          <div className="text-xs text-muted-foreground bg-muted/50 rounded-lg p-3">
            {tree.health < 80 ? (
              <p>💡 Tip: Reduce your energy usage by 10% to help your tree grow stronger!</p>
            ) : tree.stage !== 'giant' ? (
              <p>🌟 Great job! Keep up your eco-friendly habits to reach the next stage!</p>
            ) : (
              <p>🏆 Amazing! Your tree is fully grown and absorbing maximum CO₂!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TreeVisualization;