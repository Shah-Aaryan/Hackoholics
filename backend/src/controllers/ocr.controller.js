import fs from "fs";
import { extractTextFromImage, extractUsageFromText } from "../services/ocr.service.js";
import { extractEnergyDataWithGemini, validateEnergyData } from "../services/gemini.service.js";
import { fetchCarbonIntensity, convertToKgCO2, calculateCarbonFootprint } from "../services/carbonIntensityService.js";

export const processBill = async (req, res) => {
  try {
    // Check for file validation errors
    if (req.fileValidationError) {
      return res.status(400).json({ error: req.fileValidationError });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const imagePath = req.file.path;

    // Run OCR
    const text = await extractTextFromImage(imagePath);

    // Clean up uploaded file
    fs.unlinkSync(imagePath);

    // Extract detailed data using Gemini AI
    const extractedData = await extractEnergyDataWithGemini(text);
    
    // Validate extracted data
    const validation = validateEnergyData(extractedData);
    
    // Calculate carbon footprint using real-time carbon intensity data
    const energyUnits = extractedData.energyConsumption?.units || 0;
    const { zone = "IN" } = req.query; // Default to India, can be overridden
    
    // Fetch real-time carbon intensity data
    const carbonIntensityResult = await fetchCarbonIntensity(zone);
    const carbonIntensityKg = convertToKgCO2(carbonIntensityResult.data.carbonIntensity);
    const carbonFootprint = calculateCarbonFootprint(energyUnits, carbonIntensityKg);

    // Prepare response
    const response = {
      success: true,
      extractedText: text,
      extractedData: extractedData,
      validation: validation,
      electricityUsage: energyUnits,
      carbonFootprintKg: Math.round(carbonFootprint * 100) / 100,
      carbonIntensity: {
        zone: carbonIntensityResult.data.zone,
        intensity: carbonIntensityResult.data.carbonIntensity,
        intensityKg: Math.round(carbonIntensityKg * 1000) / 1000,
        isEstimated: carbonIntensityResult.data.isEstimated,
        apiStatus: carbonIntensityResult.success ? "live" : "fallback"
      },
      processingMethod: extractedData.error ? "fallback" : "gemini-ai"
    };

    return res.json(response);
  } catch (error) {
    console.error("OCR Error:", error);
    return res.status(500).json({ error: "Failed to process bill" });
  }
};
