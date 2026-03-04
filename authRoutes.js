const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

const router = express.Router();

router.get("/", (req, res) => {
  res.redirect("/login");
});


router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);

  await db.query(
    "INSERT INTO users (email, password_hash) VALUES (?, ?)",
    [email, hash]
  );

  res.redirect("/login");
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const [rows] = await db.query(
    "SELECT * FROM users WHERE email = ?",
    [email]
  );

  if (!rows.length) return res.send("User not found");

  const user = rows[0];
  const valid = await bcrypt.compare(password, user.password_hash);

  if (!valid) return res.send("Invalid credentials");

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

  res.cookie("token", token);
  res.redirect("/dashboard");
});

router.get("/dashboard", (req, res) => {
  res.render("dashboard");
});

module.exports = router;