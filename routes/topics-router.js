const {getAllTopics} = require("../controllers/topics.controllers")
const express = require("express")

const topicsRouter = express.Router()

topicsRouter
    .route("/")
    .get(getAllTopics)

module.exports = topicsRouter