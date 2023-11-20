const express = require("express")
const { getAllTopics } = require("./controllers/topics.controllers")
const { serverError, invalidPath } = require("./errors")

const app = express()

app.get("/api/topics", getAllTopics)

app.all("*", invalidPath)

app.use(serverError)



module.exports = app
