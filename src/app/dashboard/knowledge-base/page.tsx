"use client";

import { useEffect, useState } from "react";
import { Search, Plus, BookOpen } from "lucide-react";

interface Article {
  id: string;
  title: string;
  content: string;
  category: string;
  isPublished: boolean;
  updatedAt: string;
}

export default function KnowledgeBasePage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetchArticles();
  }, [search, selectedCategory]);

  async function fetchArticles() {
    setLoading(true);
    const params = new URLSearchParams({ orgId: "default" });
    if (search) params.set("search", search);
    if (selectedCategory) params.set("category", selectedCategory);
    const res = await fetch(`/api/knowledge-base?${params}`);
    setArticles(await res.json());
    setLoading(false);
  }

  async function createArticle(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    await fetch("/api/knowledge-base", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.get("title"),
        content: form.get("content"),
        category: form.get("category"),
        isPublished: true,
        orgId: "default",
      }),
    });
    setShowCreateModal(false);
    fetchArticles();
  }

  const categories = Array.from(new Set(articles.map((a) => a.category)));

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Knowledge Base</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <Plus className="h-4 w-4" />
          New Article
        </button>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading...</div>
      ) : articles.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No articles found.
        </div>
      ) : (
        <div className="space-y-4">
          {articles.map((article) => (
            <div
              key={article.id}
              className="bg-white border rounded-lg overflow-hidden"
            >
              <button
                onClick={() =>
                  setExpandedId(
                    expandedId === article.id ? null : article.id
                  )
                }
                className="w-full text-left px-6 py-4 flex items-center gap-3 hover:bg-gray-50"
              >
                <BookOpen className="h-5 w-5 text-blue-500 shrink-0" />
                <div className="flex-1">
                  <h3 className="font-medium">{article.title}</h3>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                    {article.category}
                  </span>
                </div>
              </button>
              {expandedId === article.id && (
                <div className="px-6 pb-4 border-t">
                  <div className="pt-4 prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">
                    {article.content}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
            <h2 className="text-lg font-bold mb-4">New Article</h2>
            <form onSubmit={createArticle} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  name="title"
                  required
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Category
                </label>
                <input
                  name="category"
                  required
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="e.g. Getting Started, Billing, Technical"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Content
                </label>
                <textarea
                  name="content"
                  required
                  rows={8}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Publish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
