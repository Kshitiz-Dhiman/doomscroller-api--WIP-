const axios = require("axios");
const fetchFromApi = async (req, res) => {
    const {
        tag = "",
        page = 1,
        per_page = 10,
        state = "rising",
        top = "",
    } = req.query;

    const cacheKey = `devto-${tag}-${state}-${page}-${per_page}`;
    const cachedData = req.cache.get(cacheKey);

    if (cachedData) {
        return res.json({
            count: cachedData.count,
            isCached: true,
            rateLimit: {
                remaining: req.rateLimit.remaining || limiter.max,
                reset: req.rateLimit.resetTime
            },
            articles: cachedData.articles
        })
    }

    try {
        const params = {
            state,
            page,
            per_page,
        };

        if (tag) params.tag = tag;
        if (top) params.top = top;

        const rawdata = await axios.get("https://dev.to/api/articles", {
            params,
        });
        const result = {
            count: rawdata.data.length,
            isCached: false,
            rateLimit: {
                remaining: req.rateLimit.remaining || limiter.max,
                reset: req.rateLimit.resetTime
            },
            articles: rawdata.data.map(article => ({
                id: article.id,
                title: article.title,
                description: article.description,
                article_url: article.url,
                cover_image: article.cover_image,
                tag_list: article.tag_list,

            }))
        }
        req.cache.set(cacheKey, result);
        return res.status(200).json(result);
    } catch (e) {
        console.error("Dev.to API error:", e.message);
        return res.status(500).json({ error: "Failed to fetch data from Dev.to" });
    }
}

module.exports = fetchFromApi;
