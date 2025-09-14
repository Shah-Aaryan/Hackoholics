import dotenv from "dotenv"
// @ts-ignore
import connectDB from "./db/db.js"
import app from "./app.js"


dotenv.config();

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000,()=>{
        console.log(`Server running on port ${process.env.PORT || 8000}`);
    })
})
.catch((err)=>{
    console.log("MongoDB connection failed, starting server anyway",err);
    // Start server even if MongoDB fails for OCR functionality
    app.listen(process.env.PORT || 8000,()=>{
        console.log(`Server running on port ${process.env.PORT || 8000} (without MongoDB)`);
    })
})

