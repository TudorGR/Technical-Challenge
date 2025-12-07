const API_BASE = import.meta.env.VITE_API_URL || "/api";

export async function getArticles() {
  const res = await fetch(`${API_BASE}/articles`);
  return res.json();
}

export async function getArticle(id) {
  const res = await fetch(`${API_BASE}/articles/${id}`);
  return res.json();
}

export async function getModelInfo() {
  const res = await fetch(`${API_BASE}/model-info`);
  return res.json();
}
