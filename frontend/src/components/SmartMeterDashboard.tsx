import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Activity, 
  Zap, 
  Leaf, 
  TrendingUp, 
  Clock, 
  Wifi, 
  Battery, 
  Thermometer,
  Lightbulb,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import RealTimeMeter from './RealTimeMeter';
import HistoricalChart from './HistoricalChart';
import CarbonFootprint from './CarbonFootprint';
import DeviceStatus from './DeviceStatus';

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

interface SmartMeterDashboardProps {
  userId?: string;
}

const SmartMeterDashboard: React.FC<SmartMeterDashboardProps> = ({ userId = "1" }) => {
  const [energyData, setEnergyData] = useState<EnergyData | null>(null);
  const [historicalData, setHistoricalData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const API_BASE_URL = 'http://localhost:3000/api'; // Adjust based on your backend port

  const fetchRealTimeData = async () => {
    try {
      setError(null);
      const response = await fetch(`${API_BASE_URL}/energy/real-time/${userId}?zone=IN`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        setEnergyData(result.data);
        setLastUpdated(new Date());
      } else {
        throw new Error(result.message || 'Failed to fetch energy data');
      }
    } catch (err) {
      console.error('Error fetching real-time data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch energy data');
    }
  };

  const fetchHistoricalData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/energy/historical/${userId}?days=7&limit=100`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        setHistoricalData(result.data.records);
      } else {
        throw new Error(result.message || 'Failed to fetch historical data');
      }
    } catch (err) {
      console.error('Error fetching historical data:', err);
      // Don't set error for historical data as it's not critical
    }
  };

  const fetchCarbonIntensity = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/energy/carbon-intensity?zone=IN`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.message || 'Failed to fetch carbon intensity');
      }
    } catch (err) {
      console.error('Error fetching carbon intensity:', err);
      return null;
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchRealTimeData(),
        fetchHistoricalData()
      ]);
      setLoading(false);
    };

    loadData();
  }, [userId]);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchRealTimeData();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [autoRefresh, userId]);

  const handleRefresh = () => {
    fetchRealTimeData();
    fetchHistoricalData();
  };

  const calculateEfficiency = () => {
    if (!energyData) return 0;
    
    // Simple efficiency calculation based on power factor and voltage
    const { powerFactor, voltage } = energyData.additionalData;
    const optimalVoltage = 230; // Standard voltage
    const voltageEfficiency = Math.max(0, 1 - Math.abs(voltage - optimalVoltage) / optimalVoltage);
    
    return Math.round((powerFactor * voltageEfficiency) * 100);
  };

  const getStatusColor = (value: number, thresholds: { low: number; high: number }) => {
    if (value < thresholds.low) return 'text-green-500';
    if (value > thresholds.high) return 'text-red-500';
    return 'text-yellow-500';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2">
          <RefreshCw className="h-6 w-6 animate-spin" />
          <span>Loading smart meter data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Smart Meter Dashboard</h1>
          <p className="text-muted-foreground">
            Real-time energy monitoring and carbon footprint tracking
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            variant={autoRefresh ? "default" : "outline"}
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            Auto Refresh {autoRefresh ? 'ON' : 'OFF'}
          </Button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {error}
            <Button
              variant="outline"
              size="sm"
              className="ml-2"
              onClick={handleRefresh}
            >
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Consumption</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {energyData ? `${energyData.energyConsumption.toFixed(2)} kWh` : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              {lastUpdated ? `Updated ${lastUpdated.toLocaleTimeString()}` : 'Never updated'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Carbon Footprint</CardTitle>
            <Leaf className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {energyData ? `${energyData.carbonFootprint.toFixed(2)} kg CO₂` : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              Intensity: {energyData ? `${energyData.carbonIntensity} g/kWh` : 'N/A'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Efficiency</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getStatusColor(calculateEfficiency(), { low: 70, high: 90 })}`}>
              {calculateEfficiency()}%
            </div>
            <p className="text-xs text-muted-foreground">
              Power Factor: {energyData ? energyData.additionalData.powerFactor.toFixed(2) : 'N/A'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Device Status</CardTitle>
            <Wifi className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Badge variant={energyData ? "default" : "destructive"}>
                {energyData ? "Connected" : "Disconnected"}
              </Badge>
              {energyData?.isEstimated && (
                <Badge variant="secondary">Estimated</Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Meter ID: {energyData?.additionalData.meterId || 'N/A'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="realtime" className="space-y-4">
        <TabsList>
          <TabsTrigger value="realtime">Real-time Meter</TabsTrigger>
          <TabsTrigger value="historical">Historical Data</TabsTrigger>
          <TabsTrigger value="carbon">Carbon Footprint</TabsTrigger>
          <TabsTrigger value="devices">Device Status</TabsTrigger>
        </TabsList>

        <TabsContent value="realtime" className="space-y-4">
          <RealTimeMeter energyData={energyData} />
        </TabsContent>

        <TabsContent value="historical" className="space-y-4">
          <HistoricalChart data={historicalData} />
        </TabsContent>

        <TabsContent value="carbon" className="space-y-4">
          <CarbonFootprint energyData={energyData} />
        </TabsContent>

        <TabsContent value="devices" className="space-y-4">
          <DeviceStatus energyData={energyData} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SmartMeterDashboard;
