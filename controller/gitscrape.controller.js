const puppeteer = require("puppeteer");
const scrapeTrendingGithub = async (req, res) => {
    const { language = "", since = "daily" } = req.query;

    const cacheKey = `trending-${language}-${since}`;
    const cachedData = req.cache.get(cacheKey);
    if (cachedData) {
        return res.json({
            count: cachedData.count,
            isCached: true,
            rateLimit: {
                remaining: req.rateLimit.remaining || limiter.max,
                reset: req.rateLimit.resetTime
            },
            repos: cachedData.repos,
        });
    }

    let browser;
    try {
        browser = await puppeteer.launch({
            headless: true,
            args: ["--no-sandbox", "--disable-setuid-sandbox"],
        });

        const page = await browser.newPage();
        await page.goto(`https://github.com/trending/${language}?since=${since}`, {
            waitUntil: "domcontentloaded",
        });

        const selector = ".Box-row";
        const trendingRepos = await page.$$eval(selector, (divs) => {
            return divs.map((div) => {
                const author = div.querySelector("h2 a")?.innerText.trim() || "";
                const description =
                    div.querySelector("p")?.innerText.trim() || "No description";

                const langElement = div.querySelector('[itemprop="programmingLanguage"]');
                const language = langElement?.innerText.trim() || "Unknown";

                const starElement = div.querySelector('a[href$="/stargazers"]');
                const stars = starElement?.innerText.trim().replace(",", "") || "0";

                const forkElement = div.querySelector('a[href$="/forks"]');
                const forks = forkElement?.innerText.trim().replace(",", "") || "0";


                const relativeUrl = div.querySelector("h2 a")?.getAttribute("href");
                const url = relativeUrl
                    ? `https://github.com${relativeUrl}`
                    : "";

                return {
                    author,
                    description,
                    language,
                    stars,
                    forks,
                    url,
                };
            });
        });

        const result = {
            count: trendingRepos.length,
            isCached: !!cachedData,
            rateLimit: {
                remaining: req.rateLimit.remaining || limiter.max,
                reset: req.rateLimit.resetTime
            },
            repos: trendingRepos,
        };
        req.cache.set(cacheKey, result);
        res.json(result);
    } catch (error) {
        console.error("Error scraping GitHub trending:", error);
        res.status(500).json({ error: "Failed to scrape GitHub trending" });
    } finally {
        if (browser) await browser.close();
    }
};

module.exports = scrapeTrendingGithub;
