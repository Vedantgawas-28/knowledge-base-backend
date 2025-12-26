const express = require("express");
const cors = require("cors");

// ✅ Load env FIRST (important)
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const authRoutes = require("./routes/auth.routes");
const articleRoutes = require("./routes/article.routes");
const categoryRoutes = require("./routes/category.routes");
const authMiddleware = require("./middlewares/auth.middleware");

const app = express();
const express = require("express");
const cors = require("cors");
// ===== Global Middlewares =====
app.use(
  cors({
    origin: [
      "https://knowledge-base-frontend-mi9z.onrender.com",
      "http://localhost:3000"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
  })
);
app.options("*", cors());
app.use(express.json());

// ===== Routes =====
app.use("/api/auth", authRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/categories", categoryRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("Knowledge Base API running");
});

// Protected test route
app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({
    message: "You accessed a protected route",
    user: req.user
  });
});

// ✅ START SERVER (THIS FIXES THE CRASH)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
