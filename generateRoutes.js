const express = require("express");
const db = require("../config/db");
const { extractQuestions, generateAnswer } = require("../services/ragService");

const router = express.Router();

/* =========================
   GENERATE ANSWERS ROUTE
========================= */
router.post("/generate-answers", async (req, res) => {
  try {
    // 1️⃣ Get latest questionnaire
    const [qRows] = await db.query(
      "SELECT * FROM questionnaires ORDER BY id DESC LIMIT 1"
    );

    if (!qRows.length) {
      return res.send("No questionnaire uploaded.");
    }

    const questionnaire = qRows[0];

    // 2️⃣ Extract questions
    const questions = extractQuestions(questionnaire.content);

    // 3️⃣ Get reference documents
    const [references] = await db.query(
      "SELECT * FROM reference_docs"
    );

    let results = [];

    // 4️⃣ Generate answers
    for (let question of questions) {
      const result = await generateAnswer(question, references);

      const [insertResult] = await db.query(
        "INSERT INTO answers (questionnaire_id, question_text, generated_answer, citation, confidence) VALUES (?, ?, ?, ?, ?)",
        [
          questionnaire.id,
          question,
          result.answer,
          result.citation,
          result.confidence
        ]
      );

      results.push({
        id: insertResult.insertId,   // ✅ IMPORTANT
        question,
        generated_answer: result.answer,
        citation: result.citation,
        confidence: result.confidence
      });
    }

    // 5️⃣ Coverage Summary
    const total = results.length;
    const answered = results.filter(r => r.citation !== "None").length;
    const notFound = total - answered;

    // 6️⃣ Render Results
    res.render("results", {
      answers: results,
      total,
      answered,
      notFound
    });

  } catch (error) {
    console.error(error);
    res.send("Error generating answers.");
  }
});

/* =========================
   UPDATE ANSWER ROUTE
========================= */
router.post("/update-answer", async (req, res) => {
  try {
    const { id, editedAnswer } = req.body;

    await db.query(
      "UPDATE answers SET generated_answer = ? WHERE id = ?",
      [editedAnswer, id]
    );

    res.redirect("/dashboard");

  } catch (error) {
    console.error(error);
    res.send("Error updating answer.");
  }
});

module.exports = router;