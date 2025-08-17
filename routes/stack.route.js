const express = require("express");
const route = express.Router();
const fetchFromStackApi = require("../controller/stackapi.controller");
route.get("/", fetchFromStackApi);

module.exports = route;
