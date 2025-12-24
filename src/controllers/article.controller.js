const pool = require("../config/db");

// CREATE ARTICLE (Admin)
exports.createArticle = async (req, res) => {
  try {
    const { title, body, category_id } = req.body;

    const result = await pool.query(
      "INSERT INTO articles (title, body, author_id, category_id) VALUES ($1,$2,$3,$4) RETURNING *",
      [title, body, req.user.id, category_id]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// GET ALL ARTICLES (Public)
exports.getArticles = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, title, created_at FROM articles ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET SINGLE ARTICLE
exports.getArticleById = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM articles WHERE id=$1",
      [req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// UPDATE ARTICLE + SAVE VERSION (Admin)
exports.updateArticle = async (req, res) => {
  try {
    const { title, body, category_id } = req.body;
    const articleId = req.params.id;

    // 1️⃣ Get current article
    const current = await pool.query(
      "SELECT title, body FROM articles WHERE id=$1",
      [articleId]
    );

    if (current.rows.length === 0) {
      return res.status(404).json({ message: "Article not found" });
    }

    // 2️⃣ Save old version
    await pool.query(
      "INSERT INTO article_versions (article_id, title, body) VALUES ($1,$2,$3)",
      [articleId, current.rows[0].title, current.rows[0].body]
    );

    // 3️⃣ Update article
    const updated = await pool.query(
      "UPDATE articles SET title=$1, body=$2, category_id=$3 WHERE id=$4 RETURNING *",
      [title, body, category_id, articleId]
    );

    res.json(updated.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// GET ARTICLE VERSIONS
exports.getArticleVersions = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM article_versions WHERE article_id=$1 ORDER BY edited_at DESC",
      [req.params.id]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// FULL TEXT SEARCH
exports.searchArticles = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ message: "Search query required" });
    }

    const result = await pool.query(
      `
      SELECT id, title, created_at
      FROM articles
      WHERE search_vector @@ plainto_tsquery('english', $1)
      ORDER BY ts_rank(search_vector, plainto_tsquery('english', $1)) DESC
      `,
      [q]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

