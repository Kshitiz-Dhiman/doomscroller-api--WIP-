const { default: axios } = require("axios");

const fetchFromStackApi = async (req, res) => {
    const {
        order = "desc",
        sort = "hot", // "hot" | "activity" | "votes"
        tagged = "",
        filter = "withbody"

    } = req.query;
    const cachekey = `stack-${order}-${sort}-${tagged}-${filter}`;
    const cachedData = req.cache.get(cachekey);
    if (cachedData) {
        return res.json({
            count: cachedData.count,
            isCached: true,
            rateLimit: {
                remaining: req.rateLimit.remaining || req.limiter.max,
                reset: req.rateLimit.resetTime
            },
            questions: cachedData.questions
        })
    }

    const url = `https://api.stackexchange.com/2.3/questions?order=${order}&sort=${sort}&site=stackoverflow&filter=${filter}&tagged=${tagged}`;

    try {
        const response = await axios.get(url);
        const result = {
            count: response.data.count,
            isCached: false,
            rateLimit: {
                remaining: req.rateLimit.remaining || req.limiter.max,
                reset: req.rateLimit.resetTime
            },
            questions: response.data.items.map(question => (
                {
                    id: question.question_id,
                    title: question.title,
                    link: question.link,
                    tags: question.tags,
                    body: question.body
                }
            ))
        }
        req.cache.set(cachekey, result);
        res.status(200).json(result);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Failed to fetch data from Stack Exchange API" });
    }
}
module.exports = fetchFromStackApi;
