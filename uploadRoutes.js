const express = require("express");
const multer = require("multer");
const fs = require("fs");
const db = require("../config/db");

const router = express.Router();

const upload = multer({ dest: "uploads/" });

// Upload Questionnaire
router.post("/upload-questionnaire", upload.single("file"), async (req, res) => {
  const content = fs.readFileSync(req.file.path, "utf-8");

  await db.query(
    "INSERT INTO questionnaires (user_id, file_name, content) VALUES (?, ?, ?)",
    [1, req.file.originalname, content] // using user_id=1 for now
  );

  res.send("Questionnaire uploaded successfully. Go back to dashboard.");
});

// Upload Reference
router.post("/upload-reference", upload.single("file"), async (req, res) => {
  const content = fs.readFileSync(req.file.path, "utf-8");

  await db.query(
    "INSERT INTO reference_docs (user_id, file_name, content) VALUES (?, ?, ?)",
    [1, req.file.originalname, content]
  );

  res.send("Reference uploaded successfully. Go back to dashboard.");
});

module.exports = router;