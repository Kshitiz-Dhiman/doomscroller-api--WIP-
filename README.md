# Doomscroller API

Doomscroller is a **Node.js/Express API** that aggregates trending content from GitHub, Dev.to, Stack Overflow, and provides **AI-generated summaries**.  
It features caching, rate limiting, and easy-to-use endpoints for rapid integration.

---

## ✨ Features
- **GitHub Trending**: Scrapes trending repositories.  
- **Dev.to Articles**: Fetches rising/fresh articles.  
- **Stack Overflow**: Retrieves hot/activity/voted questions.  
- **AI Summaries**: Uses Google Gemini to summarize top items.  
- **Caching**: Reduces redundant requests.  
- **Rate Limiting**: Prevents API abuse.  

---

## 🔗 Endpoints
- `/api/git` — Trending GitHub repositories  
- `/api/devto` — Dev.to articles *(supports `tag`, `state`, `page`, `per_page`)*  
- `/api/stack` — Stack Overflow questions *(supports `order`, `sort`, `tagged`, `filter`)*  
- `/api/aisummary` — AI-generated summaries of top GitHub, Dev.to, and Stack Overflow items  
- `/cachedkeys` — View cache keys  

---

## 🚀 Getting Started

### 1. Install dependencies
```bash
npm install
