import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser"
import ocrRoutes from "./routes/ocr.route.js";
import marketplaceRoutes from "./routes/marketplace.js";

const app=express();

app.use(cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:8080",
    credentials: true
}))

app.use(express.json({limit:"16kb"})) //accept data in json format with specified limit

app.use(express.urlencoded({extended:true,limit:"16kb"})) //to handle data that comes from urls and forms

app.use(express.static("public")) //all static files are in public folder

app.use(cookieParser())

app.use("/api/ocr", ocrRoutes);

app.use("/api/marketplace", marketplaceRoutes);


//routes import 
import energyRoutes from "./routes/energyRoutes.js";
import userRoutes from "./routes/userRoutes.js";

//routes declaration
app.use("/api/energy", energyRoutes);
app.use("/api/users", userRoutes);


export default app;