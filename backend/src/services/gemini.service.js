import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Extract structured energy consumption data from OCR text using Gemini AI
 * @param {string} ocrText - Raw text extracted from OCR
 * @returns {Promise<Object>} Structured energy consumption data
 */
export async function extractEnergyDataWithGemini(ocrText) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
You are an expert at extracting energy consumption data from electricity bills. 
Extract the following information from the provided OCR text and return it as a JSON object.

OCR Text:
${ocrText}

Please extract and return ONLY a JSON object with the following structure:
{
  "energyConsumption": {
    "units": number, // Energy consumption in kWh/units
    "unitType": "kWh" | "units" | "KWH", // Type of unit
    "previousReading": number, // Previous meter reading if available
    "currentReading": number, // Current meter reading if available
    "billingPeriod": {
      "from": "YYYY-MM-DD", // Billing period start date
      "to": "YYYY-MM-DD" // Billing period end date
    }
  },
  "billingDetails": {
    "billNumber": string, // Bill/Invoice number
    "customerId": string, // Customer ID/Account number
    "billDate": "YYYY-MM-DD", // Bill generation date
    "dueDate": "YYYY-MM-DD", // Payment due date
    "totalAmount": number, // Total bill amount
    "currency": "INR" | "USD" | "EUR" // Currency
  },
  "tariffDetails": {
    "tariffType": string, // Type of tariff (e.g., "Domestic", "Commercial")
    "ratePerUnit": number, // Rate per unit in currency
    "fixedCharges": number, // Fixed charges if any
    "taxes": number // Tax amount if any
  },
  "utilityProvider": {
    "name": string, // Utility company name
    "address": string, // Utility company address
    "contact": string // Contact information
  },
  "extractedAt": "YYYY-MM-DDTHH:mm:ss.sssZ" // Current timestamp
}

Rules:
1. If any information is not found, use null for that field
2. Extract dates in YYYY-MM-DD format
3. Extract numbers as actual numbers, not strings
4. Be precise with energy consumption values
5. Look for patterns like "Units consumed: 150", "kWh: 120", "Previous reading: 1000", "Current reading: 1150"
6. Return ONLY the JSON object, no additional text or explanations
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean the response to extract only JSON
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No valid JSON found in Gemini response");
    }

    const extractedData = JSON.parse(jsonMatch[0]);
    
    // Add current timestamp
    extractedData.extractedAt = new Date().toISOString();

    return extractedData;
  } catch (error) {
    console.error("Gemini extraction error:", error);
    
    // Fallback to basic extraction if Gemini fails
    return {
      energyConsumption: {
        units: extractBasicUsage(ocrText),
        unitType: "kWh",
        previousReading: null,
        currentReading: null,
        billingPeriod: {
          from: null,
          to: null
        }
      },
      billingDetails: {
        billNumber: null,
        customerId: null,
        billDate: null,
        dueDate: null,
        totalAmount: null,
        currency: "INR"
      },
      tariffDetails: {
        tariffType: null,
        ratePerUnit: null,
        fixedCharges: null,
        taxes: null
      },
      utilityProvider: {
        name: null,
        address: null,
        contact: null
      },
      extractedAt: new Date().toISOString(),
      error: "Gemini extraction failed, using basic extraction"
    };
  }
}

/**
 * Fallback function for basic energy usage extraction
 * @param {string} text - OCR text
 * @returns {number} Energy consumption units
 */
function extractBasicUsage(text) {
  // Look for energy consumption patterns
  const patterns = [
    /(\d+)\s*(kWh|units|Units|KWH)/i,
    /consumption[:\s]*(\d+)/i,
    /units[:\s]*(\d+)/i,
    /energy[:\s]*(\d+)/i,
    /(\d{2,5})\s*(?:kWh|units)/i
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      return parseFloat(match[1]);
    }
  }

  // Fallback: look for any 2-5 digit number
  const numMatch = text.match(/(\d{2,5})/);
  return numMatch ? parseFloat(numMatch[1]) : 0;
}

/**
 * Validate extracted energy data
 * @param {Object} data - Extracted energy data
 * @returns {Object} Validation result with isValid and errors
 */
export function validateEnergyData(data) {
  const errors = [];

  if (!data.energyConsumption || !data.energyConsumption.units) {
    errors.push("Energy consumption units not found");
  }

  if (data.energyConsumption && data.energyConsumption.units < 0) {
    errors.push("Invalid energy consumption value");
  }

  if (data.billingDetails && data.billingDetails.totalAmount && data.billingDetails.totalAmount < 0) {
    errors.push("Invalid bill amount");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}
