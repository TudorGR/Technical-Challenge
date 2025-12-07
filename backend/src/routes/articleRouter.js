import { Router } from "express";
import pool from "../db.js";
import { getModelName } from "../services/aiClient.js";

const articleRouter = Router();

articleRouter.get("/articles", async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT id, title, content, tags, created_at FROM articles ORDER BY created_at DESC"
    );
    res.json(rows);
  } catch (error) {
    console.error("Error fetching articles:", error);
    res.status(500).send("Internal Server Error");
  }
});

articleRouter.get("/articles/:id", (req, res) => {
  const { id } = req.params;
  pool
    .query(
      "SELECT id, title, content, tags, created_at FROM articles WHERE id = $1",
      [id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return res.status(404).send("Article not found");
      }
      res.json(rows[0]);
    })
    .catch((error) => {
      console.error("Error fetching article:", error);
      res.status(500).send("Internal Server Error");
    });
});

articleRouter.get("/model-info", (req, res) => {
  res.json({
    model: getModelName(),
  });
});

export default articleRouter;
