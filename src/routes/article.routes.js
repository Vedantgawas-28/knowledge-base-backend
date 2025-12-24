const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");
const articleController = require("../controllers/article.controller");

// Routes
router.post(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN"),
  articleController.createArticle
);
// Update article (Admin)
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  articleController.updateArticle
);

// Get article version history
router.get(
  "/:id/versions",
  articleController.getArticleVersions
);
// Search articles
router.get("/search/query", articleController.searchArticles);

router.get("/", articleController.getArticles);
router.get("/:id", articleController.getArticleById);

module.exports = router;
