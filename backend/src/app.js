import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser"
import ocrRoutes from "./routes/ocr.route.js";

const app=express();

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(express.json({limit:"16kb"})) //accept data in json format with specified limit

app.use(express.urlencoded({extended:true,limit:"16kb"})) //to handle data that comes from urls and forms

app.use(express.static("public")) //all static files are in public folder

app.use(cookieParser())

app.use("/api/ocr", ocrRoutes);

//routes import 
import energyRoutes from "./routes/energyRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import householdRoutes from "./routes/householdRoutes.js";

//routes declaration
app.use("/api/energy", energyRoutes);
app.use("/api/users", userRoutes);
app.use("/api/households", householdRoutes);


export default app;