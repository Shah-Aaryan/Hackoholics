import express from "express";
import { upload } from "../middlewares/upload.js";
import { processBill } from "../controllers/ocr.controller.js";

const router = express.Router();

router.post("/upload-bill", upload.single("billImage"), processBill);

export default router;
