const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");
const categoryController = require("../controllers/category.controller");

// Create category (Admin only)
router.post(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN"),
  categoryController.createCategory
);

// Get categories
router.get("/", categoryController.getCategories);

module.exports = router;
