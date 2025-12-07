import express from "express";
import "dotenv/config";
import articleRouter from "./routes/articleRouter.js";
import { initDatabase } from "./db.js";
import cors from "cors";
import { seedArticles, startArticleScheduler } from "./services/articleJob.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", articleRouter);

const port = process.env.PORT || 3001;

initDatabase()
  .then(async () => {
    await seedArticles(3);

    startArticleScheduler();

    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to initialize database:", error);
    process.exit(1);
  });
