import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  LineChart, 
  TrendingUp, 
  Calendar,
  Download,
  Filter
} from 'lucide-react';
import {
  LineChart as RechartsLineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface HistoricalData {
  timestamp: string;
  energyConsumption: number;
  zone: string;
  carbonFootprint: number;
}

interface HistoricalChartProps {
  data: HistoricalData[];
}

const HistoricalChart: React.FC<HistoricalChartProps> = ({ data }) => {
  const [chartType, setChartType] = useState<'line' | 'area' | 'bar'>('line');
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('7d');
  const [viewType, setViewType] = useState<'consumption' | 'carbon' | 'comparison'>('consumption');

  // Process data for different time ranges
  const processData = (rawData: HistoricalData[], range: string) => {
    if (!rawData || rawData.length === 0) return [];

    const now = new Date();
    let cutoffDate: Date;

    switch (range) {
      case '24h':
        cutoffDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    const filteredData = rawData.filter(item => 
      new Date(item.timestamp) >= cutoffDate
    );

    // Group data by time intervals for better visualization
    const groupedData = groupDataByTime(filteredData, range);
    
    return groupedData;
  };

  const groupDataByTime = (data: HistoricalData[], range: string) => {
    const grouped: { [key: string]: { consumption: number; carbon: number; count: number } } = {};

    data.forEach(item => {
      const date = new Date(item.timestamp);
      let key: string;

      switch (range) {
        case '24h':
          key = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
          break;
        case '7d':
          key = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          break;
        case '30d':
          key = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          break;
        default:
          key = date.toLocaleDateString();
      }

      if (!grouped[key]) {
        grouped[key] = { consumption: 0, carbon: 0, count: 0 };
      }

      grouped[key].consumption += item.energyConsumption;
      grouped[key].carbon += item.carbonFootprint;
      grouped[key].count += 1;
    });

    // Convert to array and calculate averages
    return Object.entries(grouped).map(([time, values]) => ({
      time,
      consumption: values.consumption / values.count,
      carbon: values.carbon / values.count,
      totalConsumption: values.consumption,
      totalCarbon: values.carbon,
      readings: values.count
    })).sort((a, b) => {
      // Sort by time
      return new Date(a.time).getTime() - new Date(b.time).getTime();
    });
  };

  const processedData = processData(data, timeRange);

  // Calculate statistics
  const stats = React.useMemo(() => {
    if (processedData.length === 0) {
      return {
        totalConsumption: 0,
        totalCarbon: 0,
        averageConsumption: 0,
        averageCarbon: 0,
        peakConsumption: 0,
        peakCarbon: 0
      };
    }

    const totalConsumption = processedData.reduce((sum, item) => sum + item.totalConsumption, 0);
    const totalCarbon = processedData.reduce((sum, item) => sum + item.totalCarbon, 0);
    const averageConsumption = totalConsumption / processedData.length;
    const averageCarbon = totalCarbon / processedData.length;
    const peakConsumption = Math.max(...processedData.map(item => item.consumption));
    const peakCarbon = Math.max(...processedData.map(item => item.carbon));

    return {
      totalConsumption,
      totalCarbon,
      averageConsumption,
      averageCarbon,
      peakConsumption,
      peakCarbon
    };
  }, [processedData]);

  const renderChart = () => {
    if (processedData.length === 0) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No historical data available</p>
          </div>
        </div>
      );
    }

    const commonProps = {
      data: processedData,
      margin: { top: 5, right: 30, left: 20, bottom: 5 }
    };

    switch (chartType) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <RechartsLineChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="time" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                formatter={(value: any, name: string) => [
                  `${value.toFixed(2)} ${name === 'consumption' ? 'kWh' : 'kg CO₂'}`,
                  name === 'consumption' ? 'Energy Consumption' : 'Carbon Footprint'
                ]}
                labelFormatter={(label) => `Time: ${label}`}
              />
              {viewType === 'consumption' && (
                <Line 
                  type="monotone" 
                  dataKey="consumption" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  dot={{ fill: '#8884d8', strokeWidth: 2, r: 4 }}
                />
              )}
              {viewType === 'carbon' && (
                <Line 
                  type="monotone" 
                  dataKey="carbon" 
                  stroke="#82ca9d" 
                  strokeWidth={2}
                  dot={{ fill: '#82ca9d', strokeWidth: 2, r: 4 }}
                />
              )}
              {viewType === 'comparison' && (
                <>
                  <Line 
                    type="monotone" 
                    dataKey="consumption" 
                    stroke="#8884d8" 
                    strokeWidth={2}
                    dot={{ fill: '#8884d8', strokeWidth: 2, r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="carbon" 
                    stroke="#82ca9d" 
                    strokeWidth={2}
                    dot={{ fill: '#82ca9d', strokeWidth: 2, r: 4 }}
                  />
                </>
              )}
            </RechartsLineChart>
          </ResponsiveContainer>
        );

      case 'area':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="time" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                formatter={(value: any, name: string) => [
                  `${value.toFixed(2)} ${name === 'consumption' ? 'kWh' : 'kg CO₂'}`,
                  name === 'consumption' ? 'Energy Consumption' : 'Carbon Footprint'
                ]}
                labelFormatter={(label) => `Time: ${label}`}
              />
              {viewType === 'consumption' && (
                <Area 
                  type="monotone" 
                  dataKey="consumption" 
                  stroke="#8884d8" 
                  fill="#8884d8"
                  fillOpacity={0.3}
                />
              )}
              {viewType === 'carbon' && (
                <Area 
                  type="monotone" 
                  dataKey="carbon" 
                  stroke="#82ca9d" 
                  fill="#82ca9d"
                  fillOpacity={0.3}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="time" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                formatter={(value: any, name: string) => [
                  `${value.toFixed(2)} ${name === 'consumption' ? 'kWh' : 'kg CO₂'}`,
                  name === 'consumption' ? 'Energy Consumption' : 'Carbon Footprint'
                ]}
                labelFormatter={(label) => `Time: ${label}`}
              />
              {viewType === 'consumption' && (
                <Bar dataKey="consumption" fill="#8884d8" />
              )}
              {viewType === 'carbon' && (
                <Bar dataKey="carbon" fill="#82ca9d" />
              )}
              {viewType === 'comparison' && (
                <>
                  <Bar dataKey="consumption" fill="#8884d8" />
                  <Bar dataKey="carbon" fill="#82ca9d" />
                </>
              )}
            </BarChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>Historical Energy Data</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4" />
              <span className="text-sm font-medium">Chart Type:</span>
              <Select value={chartType} onValueChange={(value: any) => setChartType(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="line">
                    <div className="flex items-center space-x-2">
                      <LineChart className="h-4 w-4" />
                      <span>Line</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="area">
                    <div className="flex items-center space-x-2">
                      <BarChart3 className="h-4 w-4" />
                      <span>Area</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="bar">
                    <div className="flex items-center space-x-2">
                      <BarChart3 className="h-4 w-4" />
                      <span>Bar</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span className="text-sm font-medium">Time Range:</span>
              <Select value={timeRange} onValueChange={(value: any) => setTimeRange(value)}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24h">24h</SelectItem>
                  <SelectItem value="7d">7d</SelectItem>
                  <SelectItem value="30d">30d</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm font-medium">View:</span>
              <Select value={viewType} onValueChange={(value: any) => setViewType(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="consumption">Consumption</SelectItem>
                  <SelectItem value="carbon">Carbon</SelectItem>
                  <SelectItem value="comparison">Both</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.totalConsumption.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">Total kWh</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.totalCarbon.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">Total CO₂ (kg)</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.averageConsumption.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Avg kWh</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.averageCarbon.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Avg CO₂ (kg)</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.peakConsumption.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Peak kWh</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.peakCarbon.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Peak CO₂ (kg)</p>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card>
        <CardContent className="p-6">
          {renderChart()}
        </CardContent>
      </Card>
    </div>
  );
};

export default HistoricalChart;
