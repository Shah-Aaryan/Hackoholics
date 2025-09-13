import Tesseract from "tesseract.js";

/**
 * Extract text from an image using OCR.
 * @param {string} imagePath
 * @returns {Promise<string>}
 */
export async function extractTextFromImage(imagePath) {
  const { data: { text } } = await Tesseract.recognize(imagePath, "eng");
  return text;
}

/**
 * Extract electricity usage from OCR text.
 * Looks for numbers with kWh, Units, etc.
 * @param {string} text
 * @returns {number}
 */
export function extractUsageFromText(text) {
  const usageMatch = text.match(/(\d+)\s*(kWh|units|Units|KWH)/i);
  if (usageMatch) {
    return parseFloat(usageMatch[1]);
  }

  // fallback: first number in the text
  const numMatch = text.match(/(\d{2,5})/);
  return numMatch ? parseFloat(numMatch[1]) : 0;
}
