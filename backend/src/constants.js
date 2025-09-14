import dotenv from "dotenv";
dotenv.config();

export const DB_NAME = "eco";
export const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
export const MONGODB_URI = process.env.MONGODB_URI
export const JWT_SECRET = process.env.JWT_SECRET
export const PORT = process.env.PORT || 8000;