const express = require("express");
const route = express.Router();
const scrapeTrendingGithub = require("../controller/gitscrape.controller");

route.get("/", scrapeTrendingGithub);

module.exports = route;
