import fs from "fs";
import { extractTextFromImage, extractUsageFromText } from "../services/ocr.service.js";
import { calculateCarbonFootprint } from "../utils/carbon.utils.js";

export const processBill = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const imagePath = req.file.path;

    // Run OCR
    const text = await extractTextFromImage(imagePath);

    // Clean up uploaded file
    fs.unlinkSync(imagePath);

    // Extract usage & calculate footprint
    const usage = extractUsageFromText(text);
    const carbonFootprint = calculateCarbonFootprint(usage);

    return res.json({
      success: true,
      extractedText: text,
      electricityUsage: usage,
      carbonFootprintKg: carbonFootprint.toFixed(2),
    });
  } catch (error) {
    console.error("OCR Error:", error);
    return res.status(500).json({ error: "Failed to process bill" });
  }
};
