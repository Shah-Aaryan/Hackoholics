import { useState, useRef } from 'react';
import { Upload, FileImage, Loader2, CheckCircle, AlertCircle, Zap, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';

interface BillUploadProps {
  onBillProcessed: (billData: any) => void;
}

interface ProcessedBillData {
  success: boolean;
  extractedText: string;
  extractedData: {
    energyConsumption: {
      units: number;
      unitType: string;
      previousReading?: number;
      currentReading?: number;
    };
    billingDetails: {
      billNumber?: string;
      customerId?: string;
      totalAmount?: number;
      currency?: string;
    };
    utilityProvider: {
      name?: string;
      address?: string;
      contact?: string;
    };
  };
  electricityUsage: number;
  carbonFootprintKg: number;
  carbonIntensity: {
    zone: string;
    intensity: number;
    intensityKg: number;
    apiStatus: string;
  };
  processingMethod: string;
  validation: {
    isValid: boolean;
    errors: string[];
  };
}

const BillUpload = ({ onBillProcessed }: BillUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processedData, setProcessedData] = useState<ProcessedBillData | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File Type",
        description: "Please upload an image file (JPG, PNG, etc.)",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please upload an image smaller than 10MB",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setProcessedData(null);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const formData = new FormData();
      formData.append('billImage', file);

      const response = await fetch('http://localhost:8000/api/ocr/upload-bill?zone=IN', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ProcessedBillData = await response.json();

      if (data.success) {
        setProcessedData(data);
        onBillProcessed(data);
        
        toast({
          title: "Bill Processed Successfully!",
          description: `Extracted ${data.electricityUsage} kWh with ${data.carbonFootprintKg} kg CO₂ footprint`,
        });
      } else {
        throw new Error('Failed to process bill');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Failed to process bill",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card className="card-eco">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileImage className="w-5 h-5" />
            Upload Electricity Bill
          </CardTitle>
          <CardDescription>
            Upload an image of your electricity bill to automatically extract energy consumption and calculate carbon footprint
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive
                ? 'border-primary bg-primary/5'
                : 'border-muted-foreground/25 hover:border-primary/50'
            } ${isUploading ? 'pointer-events-none opacity-50' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileInputChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={isUploading}
            />
            
            {isUploading ? (
              <div className="space-y-4">
                <Loader2 className="w-12 h-12 mx-auto animate-spin text-primary" />
                <div className="space-y-2">
                  <p className="text-lg font-medium">Processing your bill...</p>
                  <Progress value={uploadProgress} className="w-full max-w-xs mx-auto" />
                  <p className="text-sm text-muted-foreground">
                    {uploadProgress < 30 && "Uploading image..."}
                    {uploadProgress >= 30 && uploadProgress < 60 && "Running OCR..."}
                    {uploadProgress >= 60 && uploadProgress < 90 && "Analyzing with AI..."}
                    {uploadProgress >= 90 && "Calculating carbon footprint..."}
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <Upload className="w-12 h-12 mx-auto text-muted-foreground" />
                <div className="space-y-2">
                  <p className="text-lg font-medium">
                    {dragActive ? "Drop your bill here" : "Drag & drop your bill here"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    or click to browse files
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Supports JPG, PNG, PDF (max 10MB)
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Processing Results */}
      {processedData && (
        <Card className="card-hero">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-success" />
              Bill Analysis Complete
            </CardTitle>
            <CardDescription>
              AI-powered analysis of your electricity bill
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Processing Method */}
            <div className="flex items-center gap-2">
              <Badge variant={processedData.processingMethod === 'gemini-ai' ? 'default' : 'secondary'}>
                {processedData.processingMethod === 'gemini-ai' ? 'AI-Powered' : 'Basic Extraction'}
              </Badge>
              <Badge variant="outline">
                {processedData.carbonIntensity.apiStatus === 'live' ? 'Live Data' : 'Fallback Data'}
              </Badge>
            </div>

            {/* Energy Consumption */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg">
                <Zap className="w-8 h-8 mx-auto mb-2 text-primary" />
                <p className="text-2xl font-bold text-primary">
                  {processedData.electricityUsage} kWh
                </p>
                <p className="text-sm text-muted-foreground">Energy Consumed</p>
              </div>
              
              <div className="text-center p-4 bg-gradient-to-br from-success/10 to-primary/10 rounded-lg">
                <Leaf className="w-8 h-8 mx-auto mb-2 text-success" />
                <p className="text-2xl font-bold text-success">
                  {processedData.carbonFootprintKg} kg
                </p>
                <p className="text-sm text-muted-foreground">CO₂ Footprint</p>
              </div>
              
              <div className="text-center p-4 bg-gradient-to-br from-accent/10 to-primary/10 rounded-lg">
                <div className="w-8 h-8 mx-auto mb-2 text-accent text-2xl">🌍</div>
                <p className="text-2xl font-bold text-accent">
                  {processedData.carbonIntensity.intensity}
                </p>
                <p className="text-sm text-muted-foreground">gCO₂/kWh</p>
              </div>
            </div>

            {/* Detailed Information */}
            {processedData.extractedData && (
              <div className="space-y-4">
                <h4 className="font-semibold">Extracted Information</h4>
                
                {/* Energy Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium text-sm text-muted-foreground mb-2">Energy Consumption</h5>
                    <div className="space-y-1 text-sm">
                      <p>Units: {processedData.extractedData.energyConsumption.units} {processedData.extractedData.energyConsumption.unitType}</p>
                      {processedData.extractedData.energyConsumption.previousReading && (
                        <p>Previous Reading: {processedData.extractedData.energyConsumption.previousReading} kWh</p>
                      )}
                      {processedData.extractedData.energyConsumption.currentReading && (
                        <p>Current Reading: {processedData.extractedData.energyConsumption.currentReading} kWh</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-sm text-muted-foreground mb-2">Billing Details</h5>
                    <div className="space-y-1 text-sm">
                      {processedData.extractedData.billingDetails.billNumber && (
                        <p>Bill #: {processedData.extractedData.billingDetails.billNumber}</p>
                      )}
                      {processedData.extractedData.billingDetails.customerId && (
                        <p>Customer ID: {processedData.extractedData.billingDetails.customerId}</p>
                      )}
                      {processedData.extractedData.billingDetails.totalAmount && (
                        <p>Amount: {processedData.extractedData.billingDetails.totalAmount} {processedData.extractedData.billingDetails.currency}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Utility Provider */}
                {processedData.extractedData.utilityProvider.name && (
                  <div>
                    <h5 className="font-medium text-sm text-muted-foreground mb-2">Utility Provider</h5>
                    <div className="space-y-1 text-sm">
                      <p>{processedData.extractedData.utilityProvider.name}</p>
                      {processedData.extractedData.utilityProvider.address && (
                        <p className="text-muted-foreground">{processedData.extractedData.utilityProvider.address}</p>
                      )}
                      {processedData.extractedData.utilityProvider.contact && (
                        <p className="text-muted-foreground">{processedData.extractedData.utilityProvider.contact}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Validation Status */}
            {!processedData.validation.isValid && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Data Quality Issues:</strong> {processedData.validation.errors.join(', ')}
                </AlertDescription>
              </Alert>
            )}

            {/* Calculation Details */}
            <div className="p-4 bg-muted/50 rounded-lg">
              <h5 className="font-medium text-sm mb-2">Carbon Footprint Calculation</h5>
              <p className="text-sm text-muted-foreground">
                {processedData.electricityUsage} kWh × {processedData.carbonIntensity.intensityKg} kgCO₂/kWh = {processedData.carbonFootprintKg} kg CO₂
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Based on {processedData.carbonIntensity.zone} carbon intensity data ({processedData.carbonIntensity.apiStatus})
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BillUpload;
