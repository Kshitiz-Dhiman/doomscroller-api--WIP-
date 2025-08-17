const express = require("express");
const ratelimit = require("express-rate-limit");
const app = express();
const NodeCache = require("node-cache");

// Routes
const gitRoute = require("./routes/git.route");
const devRoute = require("./routes/dev.route");
const stackRoute = require("./routes/stack.route");
const { default: Innertube } = require("youtubei.js");
// Configs
const limiter = ratelimit({
    windowMs: 60 * 1000,
    max: 20,
    message: "Too many requests, please try again later.",
})
const cache = new NodeCache({ stdTTL: 60 * 60 });

// Global middlewares
app.use(limiter);
app.use(express.json());
app.use((req, res, next) => {
    req.cache = cache;
    next();
})

app.get("/", (req, res) => {
    res.send(`
    <body style="font-family: Arial, sans-serif; background: #0d1117; margin: 0; padding: 0; text-align: center; color: #c9d1d9;">
  <div style="max-width: 600px; margin: 50px auto; background: #161b22; border-radius: 12px; padding: 30px; box-shadow: 0 4px 12px rgba(0,0,0,0.5);">

    <h1 style="color: #58a6ff; margin-bottom: 20px;">🚀 Welcome to Doomsroller API</h1>

    <ul style="list-style: none; padding: 0; margin: 0;">
      <li style="margin: 15px 0;">
        <a href="/git" style="text-decoration: none; color: white; background: #238636; padding: 10px 20px; border-radius: 8px; display: inline-block; transition: background 0.3s;">
          GitHub Trending
        </a>
      </li>
      <li style="margin: 15px 0;">
        <a href="/devto" style="text-decoration: none; color: white; background: #f46d01; padding: 10px 20px; border-radius: 8px; display: inline-block; transition: background 0.3s;">
          Dev.to Rising Articles
        </a>
      </li>
      <li style="margin: 15px 0;">
        <a href="/devto?tag=javascript&state=fresh&page=1&per_page=5" style="text-decoration: none; color: #0d1117; background: #f1e05a; padding: 10px 20px; border-radius: 8px; display: inline-block; transition: background 0.3s;">
          Dev.to JavaScript Fresh
        </a>
      </li>
      <li style="margin: 15px 0;">
        <a href="/stack" style="text-decoration: none; color: white; background: #6f42c1; padding: 10px 20px; border-radius: 8px; display: inline-block; transition: background 0.3s;">
          Stack Exchange Questions
        </a>
      </li>
    </ul>
  </div>
</body>

  `);
});
app.get("/cachedkeys", (req, res) => {
    const keys = req.cache.keys();
    res.json({ keys });
})
app.use("/git", gitRoute);
app.use("/devto", devRoute);
app.use("/stack", stackRoute);




app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
