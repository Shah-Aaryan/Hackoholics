import { useState, useRef } from 'react';
import { Plus, Calculator, TrendingUp, Receipt, Zap, Upload, FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockBills, Bill, EMISSION_FACTOR } from '@/data/mockData';
import { toast } from '@/hooks/use-toast';
import { uploadBillImage, calculateCarbonFootprint } from '@/api/apiClient';
import BillUpload from '@/components/BillUpload';

const Bills = () => {
  const [bills, setBills] = useState<Bill[]>(mockBills);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newBill, setNewBill] = useState({
    units: '',
    amount: '',
    date: ''
  });
  
  // OCR-related state
  const [isUploading, setIsUploading] = useState(false);
  const [ocrData, setOcrData] = useState<{
    extractedText: string;
    electricityUsage: number;
    billingAmount: number;
  } | null>(null);
  const [showOcrPreview, setShowOcrPreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    if (!newBill.units || !newBill.amount || !newBill.date) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields to add your bill.",
        variant: "destructive"
      });
      return;
    }

    const units = parseFloat(newBill.units);
    const amount = parseFloat(newBill.amount);
    const carbonFootprint = units * EMISSION_FACTOR;

    const bill: Bill = {
      id: Date.now().toString(),
      date: newBill.date,
      units,
      amount,
      carbonFootprint
    };

    setBills(prev => [bill, ...prev]);
    setNewBill({ units: '', amount: '', date: '' });
    setIsDialogOpen(false);

    toast({
      title: "Bill Added Successfully",
      description: `Added bill with ${units} kWh generating ${carbonFootprint.toFixed(1)} kg CO₂`,
    });
  };

  const handleBillProcessed = (billData: any) => {
    // Convert OCR processed data to Bill format
    const processedBill: Bill = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0], // Today's date
      units: billData.electricityUsage,
      amount: billData.extractedData?.billingDetails?.totalAmount || 0,
      carbonFootprint: billData.carbonFootprintKg
    };

    setBills(prev => [processedBill, ...prev]);
  };

  const totalUnits = bills.reduce((sum, bill) => sum + bill.units, 0);
  const totalAmount = bills.reduce((sum, bill) => sum + bill.amount, 0);
  const totalCarbon = bills.reduce((sum, bill) => sum + bill.carbonFootprint, 0);

  const calculateCarbonFootprint = (units: number) => {
    return units * EMISSION_FACTOR;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Energy Bills
          </h1>
          <p className="text-muted-foreground">
            Track your electricity bills and carbon footprint
          </p>
        </div>
      </div>

      {/* Tabs for different bill entry methods */}
      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Upload Bill Image
          </TabsTrigger>
          <TabsTrigger value="manual" className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Manual Entry
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-6">
          <BillUpload onBillProcessed={handleBillProcessed} />
        </TabsContent>

        <TabsContent value="manual" className="space-y-6">
          <Card className="card-eco">
            <CardHeader>
              <CardTitle>Manual Bill Entry</CardTitle>
              <CardDescription>
                Enter your electricity bill details manually
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="units">Units Consumed (kWh)</Label>
                  <Input
                    id="units"
                    type="number"
                    placeholder="420"
                    value={newBill.units}
                    onChange={(e) => setNewBill({ ...newBill, units: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="amount">Amount ($)</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    placeholder="89.50"
                    value={newBill.amount}
                    onChange={(e) => setNewBill({ ...newBill, amount: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="date">Bill Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newBill.date}
                    onChange={(e) => setNewBill({ ...newBill, date: e.target.value })}
                  />
                </div>
                
                {/* Live Carbon Calculator */}
                {newBill.units && (
                  <div className="bg-gradient-to-r from-success/10 to-primary/10 rounded-lg p-4">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Calculator className="w-4 h-4" />
                      Carbon Footprint Preview
                    </h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      {parseFloat(newBill.units)} kWh × {EMISSION_FACTOR} kg CO₂/kWh
                    </p>
                    <div className="text-2xl font-bold text-success">
                      {calculateCarbonFootprint(parseFloat(newBill.units)).toFixed(1)} kg CO₂
                    </div>
                  </div>
                )}
                
                <Button onClick={handleSubmit} className="w-full btn-eco">
                  Add Bill & Calculate Impact
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="card-eco">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Usage</CardTitle>
            <Zap className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {totalUnits.toFixed(0)} kWh
            </div>
            <p className="text-xs text-muted-foreground">
              Across {bills.length} bills
            </p>
          </CardContent>
        </Card>

        <Card className="card-eco">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
            <Receipt className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">
              ${totalAmount.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Average ${(totalAmount / bills.length).toFixed(2)} per bill
            </p>
          </CardContent>
        </Card>

        <Card className="card-eco">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Carbon Footprint</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {totalCarbon.toFixed(1)} kg
            </div>
            <p className="text-xs text-muted-foreground">
              CO₂ emissions total
            </p>
          </CardContent>
        </Card>

        <Card className="card-hero">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rate per kWh</CardTitle>
            <Calculator className="h-4 w-4 text-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(totalAmount / totalUnits).toFixed(3)}
            </div>
            <p className="text-xs text-muted-foreground">
              Current energy rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Carbon Footprint Calculator */}
      <Card className="card-hero">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Carbon Footprint Calculator
          </CardTitle>
          <CardDescription>
            Understand how your energy usage impacts the environment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">How We Calculate</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Emission Factor:</span>
                  <span className="font-mono">{EMISSION_FACTOR} kg CO₂/kWh</span>
                </div>
                <div className="flex justify-between">
                  <span>Formula:</span>
                  <span className="font-mono">kWh × {EMISSION_FACTOR}</span>
                </div>
                <div className="text-muted-foreground text-xs">
                  *Based on average US grid electricity emission factor
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-success/20 to-primary/20 rounded-lg p-4">
              <h4 className="font-semibold mb-2">Environmental Impact</h4>
              <div className="space-y-2 text-sm">
                <div>🌳 Your CO₂ equals {(totalCarbon / 22).toFixed(1)} tree seedlings needed</div>
                <div>🚗 Equivalent to {(totalCarbon / 0.411).toFixed(0)} miles driven</div>
                <div>💡 You could offset this with {(totalCarbon / 2.3).toFixed(0)} LED bulb swaps</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bills History */}
      <Card className="card-eco">
        <CardHeader>
          <CardTitle>Recent Bills</CardTitle>
          <CardDescription>
            Your electricity bill history and carbon impact
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {bills.map((bill) => (
              <div 
                key={bill.id} 
                className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gradient-eco rounded-lg flex items-center justify-center">
                    <Receipt className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-medium">
                      {new Date(bill.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {bill.units} kWh • ${bill.amount.toFixed(2)}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="font-semibold text-success">
                    {bill.carbonFootprint.toFixed(1)} kg CO₂
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Carbon footprint
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {bills.length === 0 && (
            <div className="text-center py-8">
              <Receipt className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No bills added yet</p>
              <p className="text-sm text-muted-foreground">
                Add your first electricity bill to start tracking your carbon footprint
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Bills;