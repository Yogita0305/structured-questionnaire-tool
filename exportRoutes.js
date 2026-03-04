const express = require("express");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const db = require("../config/db");

const router = express.Router();

router.post("/export", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM answers ORDER BY id ASC"
    );

    if (!rows.length) {
      return res.send("No answers found to export.");
    }

    const filePath = path.join(__dirname, "../output.pdf");

    const doc = new PDFDocument();
    const stream = fs.createWriteStream(filePath);

    doc.pipe(stream);

    rows.forEach(row => {
      doc.fontSize(12).text("Question:");
      doc.text(row.question_text);
      doc.moveDown();

      doc.text("Answer:");
      doc.text(row.generated_answer);
      doc.moveDown();

      doc.text("Citation:");
      doc.text(row.citation);
      doc.moveDown(2);
    });

    doc.end();

    // Wait until file is fully written
    stream.on("finish", () => {
      res.download(filePath);
    });

  } catch (error) {
    console.error(error);
    res.send("Error exporting PDF.");
  }
});

module.exports = router;