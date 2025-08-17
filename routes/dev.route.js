const express = require("express");
const route = express.Router();
const fetchFromApi = require("../controller/devapi.controller");
route.get("/", fetchFromApi);
module.exports = route;
