import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router";
import ArticlesList from "./pages/ArticlesList.jsx";
import ArticleDetail from "./pages/ArticleDetail.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<ArticlesList />} />
      <Route path="/articles/:id" element={<ArticleDetail />} />
    </Routes>
  </BrowserRouter>
);
