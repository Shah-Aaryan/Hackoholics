import express from "express";
import mongoose, { connect } from "mongoose";
import { DB_NAME } from "./constants.js";
import dotenv from "dotenv"
// @ts-ignore
import connectDB from "./db/db.js"
import app from "./app.js"


dotenv.config();

//APPROACH 2 TO CONNECT DB
connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000,()=>{
        console.log(`Server running on port ${process.env.PORT}`);
    })
})
.catch((err)=>{
    console.log("MongoDB connection failed",err);
})

