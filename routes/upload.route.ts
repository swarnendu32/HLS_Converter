import express from "express";
import { fileServeController, fileUploadController } from "../controller/file.controller";
import { uploadFileMiddleware } from "../middleware/fileUpload";
import { videoUploadMiddleware } from "../middleware/postProcessing";

const router = express.Router();

router.post("/uploads", uploadFileMiddleware, fileUploadController);
router.get("/download/:filename", fileServeController)

export default router;
