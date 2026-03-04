require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");

const uploadRoutes = require("./routes/uploadRoutes");
const authRoutes = require("./routes/authRoutes");
const generateRoutes = require("./routes/generateRoutes");
const exportRoutes = require("./routes/exportRoutes");

const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/", authRoutes);
app.use("/", uploadRoutes);
app.use("/", generateRoutes);
app.use("/", exportRoutes);

app.listen(3000, () => {
  console.log("Running on http://localhost:3000");
});