const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const articleRoutes = require("./routes/article.routes");

const authMiddleware = require("./middlewares/auth.middleware");
const categoryRoutes = require("./routes/category.routes");

const app = express();


require("dotenv").config();

// ===== Global Middlewares =====
app.use(cors());
app.use(express.json());

// ===== Routes =====

// Auth routes (register, login)
app.use("/api/auth", authRoutes);

// Article routes (CRUD)
app.use("/api/articles", articleRoutes);

// Category routes (CRUD)
app.use("/api/categories", categoryRoutes);

// Health check / public route
app.get("/", (req, res) => {
  res.send("Knowledge Base API running");
});

// Protected test route (JWT check)
app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({
    message: "You accessed a protected route",
    user: req.user
  });
});

module.exports = app;
