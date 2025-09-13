const API_BASE_URL = "http://localhost:8000/api";

// OCR Upload
export const uploadBillImage = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append("billImage", file);

    console.log("Uploading file:", file.name, "Size:", file.size, "Type:", file.type);

    const response = await fetch(`${API_BASE_URL}/ocr/upload-bill`, {
      method: "POST",
      body: formData,
    });

    console.log("Upload response status:", response.status);
    console.log("Upload response headers:", Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Upload failed:", response.status, errorText);
      throw new Error(`Upload failed: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log("Upload success:", result);
    return result;
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
};

// Energy route – manual entry calculation
export const calculateCarbonFootprint = async (units: number) => {
  try {
    console.log("Calculating carbon footprint for:", units, "kWh");

    const response = await fetch(`${API_BASE_URL}/energy/calculate-carbon-footprint`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ energyConsumption: units }),
    });

    console.log("Carbon calculation response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Carbon calculation failed:", response.status, errorText);
      throw new Error(`Carbon calculation failed: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log("Carbon calculation success:", result);
    
    // Extract carbon footprint from nested response structure
    return {
      carbonFootprintKg: result.data.carbonFootprint
    };
  } catch (error) {
    console.error("Carbon calculation error:", error);
    throw error;
  }
};
