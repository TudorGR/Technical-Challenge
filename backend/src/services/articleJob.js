import pool from "../db.js";
import cron from "node-cron";
import { generateArticle } from "./aiClient.js";

export async function createArticle() {
  console.log("Generating new article...");
  const { title, content, tags } = await generateArticle();

  const { rows } = await pool.query(
    "INSERT INTO articles (title, content, tags) VALUES ($1, $2, $3) RETURNING *",
    [title, content, tags || []]
  );

  console.log(`Article created: "${rows[0].title}"`);
  return rows[0];
}

export async function seedArticles(count = 3) {
  const { rows } = await pool.query("SELECT COUNT(*) FROM articles");
  const existingCount = parseInt(rows[0].count);

  if (existingCount >= count) {
    console.log(
      `Database already has ${existingCount} articles (>=${count}). No seeding needed.`
    );
    return;
  }
  const needed = count - existingCount;
  console.log(`Seeding database with ${needed} articles...`);

  for (let i = 0; i < needed; i++) {
    await createArticle();
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
  console.log("Seeding complete");
}

export function startArticleScheduler() {
  // "0 0 * * *" = daily at midnight
  // "* * * * *" = every minute (for testing only)
  cron.schedule("0 0 * * *", async () => {
    console.log("Running scheduled article generation...");
    await createArticle();
  });
  console.log("Article scheduler started (daily at midnight)");
}
