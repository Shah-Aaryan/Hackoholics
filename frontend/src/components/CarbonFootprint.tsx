import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Leaf, 
  Calculator, 
  TrendingUp, 
  Target,
  Info,
  Zap,
  TreePine,
  Car
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';

interface EnergyData {
  timestamp: string;
  energyConsumption: number;
  zone: string;
  carbonIntensity: number;
  carbonFootprint: number;
  isEstimated: boolean;
}

interface CarbonFootprintProps {
  energyData: EnergyData | null;
}

const CarbonFootprint: React.FC<CarbonFootprintProps> = ({ energyData }) => {
  const [customConsumption, setCustomConsumption] = useState<string>('');
  const [calculatedFootprint, setCalculatedFootprint] = useState<number | null>(null);
  const [carbonIntensity, setCarbonIntensity] = useState<number>(620); // Default for India

  const API_BASE_URL = 'http://localhost:3000/api';

  useEffect(() => {
    if (energyData) {
      setCarbonIntensity(energyData.carbonIntensity);
    }
  }, [energyData]);

  const calculateCustomFootprint = async () => {
    if (!customConsumption || isNaN(parseFloat(customConsumption))) {
      setCalculatedFootprint(null);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/energy/carbon-footprint`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          energyConsumption: parseFloat(customConsumption),
          zone: 'IN'
        })
      });

      const result = await response.json();
      
      if (result.success) {
        setCalculatedFootprint(result.data.carbonFootprint);
      } else {
        throw new Error(result.message || 'Failed to calculate carbon footprint');
      }
    } catch (error) {
      console.error('Error calculating carbon footprint:', error);
      // Fallback calculation
      setCalculatedFootprint(parseFloat(customConsumption) * (carbonIntensity / 1000));
    }
  };

  const getCarbonFootprintLevel = (footprint: number) => {
    if (footprint < 1) return { level: 'Low', color: 'text-green-500', bgColor: 'bg-green-500' };
    if (footprint < 3) return { level: 'Medium', color: 'text-yellow-500', bgColor: 'bg-yellow-500' };
    if (footprint < 5) return { level: 'High', color: 'text-orange-500', bgColor: 'bg-orange-500' };
    return { level: 'Very High', color: 'text-red-500', bgColor: 'bg-red-500' };
  };

  const getEquivalentActions = (footprint: number) => {
    const treesNeeded = Math.ceil(footprint / 0.06); // 1 tree absorbs ~0.06 kg CO2 per day
    const carKm = footprint * 4.5; // Average car emits ~0.22 kg CO2 per km
    const lightbulbHours = footprint * 50; // LED bulb uses ~0.02 kg CO2 per hour
    
    return { treesNeeded, carKm, lightbulbHours };
  };

  const getCarbonIntensityColor = (intensity: number) => {
    if (intensity < 200) return 'text-green-500';
    if (intensity < 400) return 'text-yellow-500';
    if (intensity < 600) return 'text-orange-500';
    return 'text-red-500';
  };

  const getCarbonIntensityLevel = (intensity: number) => {
    if (intensity < 200) return 'Very Low';
    if (intensity < 400) return 'Low';
    if (intensity < 600) return 'Medium';
    if (intensity < 800) return 'High';
    return 'Very High';
  };

  // Sample data for carbon intensity comparison
  const carbonIntensityData = [
    { country: 'France', intensity: 57, color: '#10b981' },
    { country: 'Sweden', intensity: 43, color: '#10b981' },
    { country: 'Norway', intensity: 32, color: '#10b981' },
    { country: 'Germany', intensity: 364, color: '#f59e0b' },
    { country: 'USA', intensity: 389, color: '#f59e0b' },
    { country: 'India', intensity: 620, color: '#ef4444' },
    { country: 'China', intensity: 681, color: '#ef4444' },
    { country: 'Australia', intensity: 743, color: '#ef4444' }
  ];

  const currentFootprint = energyData?.carbonFootprint || calculatedFootprint || 0;
  const footprintLevel = getCarbonFootprintLevel(currentFootprint);
  const equivalentActions = getEquivalentActions(currentFootprint);

  const pieData = [
    { name: 'Current Usage', value: currentFootprint, color: '#8884d8' },
    { name: 'Daily Target', value: Math.max(0, 2 - currentFootprint), color: '#82ca9d' }
  ];

  return (
    <div className="space-y-6">
      {/* Current Carbon Footprint */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Leaf className="h-5 w-5" />
            <span>Current Carbon Footprint</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Main Display */}
            <div className="space-y-4">
              <div className="text-center">
                <div className={`text-5xl font-bold ${footprintLevel.color} mb-2`}>
                  {currentFootprint.toFixed(2)}
                </div>
                <div className="text-xl text-muted-foreground mb-2">kg CO₂</div>
                <Badge variant={footprintLevel.level === 'Low' ? 'default' : 'destructive'}>
                  {footprintLevel.level} Impact
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Daily Target Progress</span>
                  <span>{Math.min(100, (currentFootprint / 2) * 100).toFixed(0)}%</span>
                </div>
                <Progress 
                  value={Math.min(100, (currentFootprint / 2) * 100)} 
                  className="h-2"
                />
                <p className="text-xs text-muted-foreground">
                  Target: 2 kg CO₂ per day
                </p>
              </div>
            </div>

            {/* Pie Chart */}
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `${value.toFixed(2)} kg CO₂`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Carbon Calculator */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calculator className="h-5 w-5" />
            <span>Carbon Footprint Calculator</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="consumption">Energy Consumption (kWh)</Label>
                <Input
                  id="consumption"
                  type="number"
                  step="0.1"
                  placeholder="Enter energy consumption"
                  value={customConsumption}
                  onChange={(e) => setCustomConsumption(e.target.value)}
                />
              </div>
              
              <Button onClick={calculateCustomFootprint} className="w-full">
                <Calculator className="h-4 w-4 mr-2" />
                Calculate Carbon Footprint
              </Button>

              {calculatedFootprint !== null && (
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {calculatedFootprint.toFixed(2)} kg CO₂
                    </div>
                    <p className="text-sm text-muted-foreground">
                      For {customConsumption} kWh of energy
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <Label>Current Carbon Intensity</Label>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <div className={`text-xl font-bold ${getCarbonIntensityColor(carbonIntensity)}`}>
                      {carbonIntensity} g/kWh
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {getCarbonIntensityLevel(carbonIntensity)} Intensity
                    </div>
                  </div>
                  <Badge variant={carbonIntensity < 400 ? 'default' : 'destructive'}>
                    {getCarbonIntensityLevel(carbonIntensity)}
                  </Badge>
                </div>
              </div>

              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Info className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">Formula</span>
                </div>
                <p className="text-xs text-blue-700">
                  Carbon Footprint = Energy Consumption × Carbon Intensity
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Environmental Impact */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TreePine className="h-5 w-5" />
            <span>Environmental Impact</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <TreePine className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">{equivalentActions.treesNeeded}</div>
              <div className="text-sm text-green-700">Trees needed to offset</div>
            </div>
            
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Car className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">{equivalentActions.carKm.toFixed(1)}</div>
              <div className="text-sm text-blue-700">km driven by car</div>
            </div>
            
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <Zap className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-yellow-600">{equivalentActions.lightbulbHours.toFixed(0)}</div>
              <div className="text-sm text-yellow-700">hours of LED lighting</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Carbon Intensity Comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Global Carbon Intensity Comparison</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={carbonIntensityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="country" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  formatter={(value: number) => [`${value} g/kWh`, 'Carbon Intensity']}
                />
                <Bar dataKey="intensity">
                  {carbonIntensityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Tips for Reducing Carbon Footprint */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span>Tips to Reduce Your Carbon Footprint</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-green-600 text-xs font-bold">1</span>
                </div>
                <div>
                  <div className="font-medium">Use LED Bulbs</div>
                  <div className="text-sm text-muted-foreground">
                    Switch to LED bulbs to reduce energy consumption by up to 80%
                  </div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-green-600 text-xs font-bold">2</span>
                </div>
                <div>
                  <div className="font-medium">Unplug Devices</div>
                  <div className="text-sm text-muted-foreground">
                    Unplug devices when not in use to eliminate phantom loads
                  </div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-green-600 text-xs font-bold">3</span>
                </div>
                <div>
                  <div className="font-medium">Optimize HVAC</div>
                  <div className="text-sm text-muted-foreground">
                    Use programmable thermostats and maintain optimal temperatures
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-green-600 text-xs font-bold">4</span>
                </div>
                <div>
                  <div className="font-medium">Energy-Efficient Appliances</div>
                  <div className="text-sm text-muted-foreground">
                    Choose ENERGY STAR certified appliances for better efficiency
                  </div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-green-600 text-xs font-bold">5</span>
                </div>
                <div>
                  <div className="font-medium">Renewable Energy</div>
                  <div className="text-sm text-muted-foreground">
                    Consider solar panels or green energy plans when possible
                  </div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-green-600 text-xs font-bold">6</span>
                </div>
                <div>
                  <div className="font-medium">Monitor Usage</div>
                  <div className="text-sm text-muted-foreground">
                    Track your energy consumption to identify waste patterns
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

export default CarbonFootprint;
