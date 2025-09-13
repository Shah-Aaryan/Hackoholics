import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Gauge, 
  Zap, 
  Thermometer, 
  Activity, 
  TrendingUp, 
  TrendingDown,
  AlertCircle
} from 'lucide-react';

interface EnergyData {
  timestamp: string;
  energyConsumption: number;
  zone: string;
  carbonIntensity: number;
  carbonFootprint: number;
  isEstimated: boolean;
  additionalData: {
    deviceType: string;
    meterId: string;
    voltage: number;
    frequency: number;
    powerFactor: number;
  };
}

interface RealTimeMeterProps {
  energyData: EnergyData | null;
}

const RealTimeMeter: React.FC<RealTimeMeterProps> = ({ energyData }) => {
  const [currentReading, setCurrentReading] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (energyData) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setCurrentReading(energyData.energyConsumption);
        setIsAnimating(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [energyData]);

  const getConsumptionLevel = (consumption: number) => {
    if (consumption < 1.0) return { level: 'Low', color: 'text-green-500', bgColor: 'bg-green-500' };
    if (consumption < 2.5) return { level: 'Medium', color: 'text-yellow-500', bgColor: 'bg-yellow-500' };
    if (consumption < 4.0) return { level: 'High', color: 'text-orange-500', bgColor: 'bg-orange-500' };
    return { level: 'Very High', color: 'text-red-500', bgColor: 'bg-red-500' };
  };

  const getVoltageStatus = (voltage: number) => {
    if (voltage < 200) return { status: 'Low', color: 'text-red-500' };
    if (voltage > 250) return { status: 'High', color: 'text-red-500' };
    return { status: 'Normal', color: 'text-green-500' };
  };

  const getFrequencyStatus = (frequency: number) => {
    if (frequency < 49.5 || frequency > 50.5) return { status: 'Abnormal', color: 'text-red-500' };
    return { status: 'Normal', color: 'text-green-500' };
  };

  const getPowerFactorStatus = (pf: number) => {
    if (pf < 0.8) return { status: 'Poor', color: 'text-red-500' };
    if (pf < 0.9) return { status: 'Fair', color: 'text-yellow-500' };
    return { status: 'Good', color: 'text-green-500' };
  };

  if (!energyData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Gauge className="h-5 w-5" />
            <span>Real-time Energy Meter</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No energy data available</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const consumptionLevel = getConsumptionLevel(energyData.energyConsumption);
  const voltageStatus = getVoltageStatus(energyData.additionalData.voltage);
  const frequencyStatus = getFrequencyStatus(energyData.additionalData.frequency);
  const powerFactorStatus = getPowerFactorStatus(energyData.additionalData.powerFactor);

  // Calculate progress percentage (assuming max consumption of 5 kWh for visualization)
  const progressPercentage = Math.min((energyData.energyConsumption / 5) * 100, 100);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Main Meter Display */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Gauge className="h-5 w-5" />
              <span>Energy Consumption</span>
            </div>
            <Badge variant={energyData.isEstimated ? "secondary" : "default"}>
              {energyData.isEstimated ? "Estimated" : "Live"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-6">
            {/* Large Energy Reading */}
            <div className="relative">
              <div className={`text-6xl font-bold ${consumptionLevel.color} transition-all duration-500 ${
                isAnimating ? 'scale-110' : 'scale-100'
              }`}>
                {currentReading.toFixed(2)}
              </div>
              <div className="text-xl text-muted-foreground mt-2">kWh</div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Consumption Level</span>
                <span className={consumptionLevel.color}>{consumptionLevel.level}</span>
              </div>
              <Progress 
                value={progressPercentage} 
                className="h-3"
              />
            </div>

            {/* Carbon Footprint */}
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <div className="text-2xl font-bold">{energyData.carbonFootprint.toFixed(2)}</div>
                <div className="text-sm text-muted-foreground">kg CO₂</div>
              </div>
              <div className="text-xs text-muted-foreground">
                Carbon intensity: {energyData.carbonIntensity} g/kWh
              </div>
            </div>

            {/* Last Updated */}
            <div className="text-xs text-muted-foreground">
              Last updated: {new Date(energyData.timestamp).toLocaleTimeString()}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Technical Parameters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>Technical Parameters</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Voltage */}
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Zap className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium">Voltage</div>
                  <div className="text-sm text-muted-foreground">Electrical potential</div>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-xl font-bold ${voltageStatus.color}`}>
                  {energyData.additionalData.voltage.toFixed(1)}V
                </div>
                <div className={`text-xs ${voltageStatus.color}`}>
                  {voltageStatus.status}
                </div>
              </div>
            </div>

            {/* Frequency */}
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <div className="font-medium">Frequency</div>
                  <div className="text-sm text-muted-foreground">Power grid frequency</div>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-xl font-bold ${frequencyStatus.color}`}>
                  {energyData.additionalData.frequency.toFixed(2)}Hz
                </div>
                <div className={`text-xs ${frequencyStatus.color}`}>
                  {frequencyStatus.status}
                </div>
              </div>
            </div>

            {/* Power Factor */}
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Thermometer className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <div className="font-medium">Power Factor</div>
                  <div className="text-sm text-muted-foreground">Efficiency indicator</div>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-xl font-bold ${powerFactorStatus.color}`}>
                  {energyData.additionalData.powerFactor.toFixed(3)}
                </div>
                <div className={`text-xs ${powerFactorStatus.color}`}>
                  {powerFactorStatus.status}
                </div>
              </div>
            </div>

            {/* Device Information */}
            <div className="pt-4 border-t">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="font-medium">Device Type</div>
                  <div className="text-muted-foreground">{energyData.additionalData.deviceType}</div>
                </div>
                <div>
                  <div className="font-medium">Meter ID</div>
                  <div className="text-muted-foreground font-mono text-xs">
                    {energyData.additionalData.meterId}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RealTimeMeter;
