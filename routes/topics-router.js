const {getAllTopics, postTopic} = require("../controllers/topics.controllers")
const express = require("express")

const topicsRouter = express.Router()

topicsRouter
    .route("/")
    .get(getAllTopics)
    .post(postTopic)

module.exports = topicsRouter