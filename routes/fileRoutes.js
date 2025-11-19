import express, { Router } from "express";
import multer from "multer";

import { uploadFile, getSignedUrl, deleteFile } from "../services/supabaseFileService.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Upload
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const result = await uploadFile(req.file.path, req.file.originalname, req.file.mimetype);
    const signedUrl = await getSignedUrl(result.fileName);

    res.json({
      message: "Uploaded successfully",
      file: result.fileName,
      signedUrl,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get signed URL
router.get("/file/:filename", async (req, res) => {
  try {
    const signedUrl = await getSignedUrl(req.params.filename);
    res.json({ file: req.params.filename, signedUrl });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete
router.delete("/delete/:filename", async (req, res) => {
  try {
    await deleteFile(req.params.filename);
    res.json({ message: "File deleted", file: req.params.filename });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
