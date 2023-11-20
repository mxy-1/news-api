const express = require("express")
const { getAllTopics } = require("./controllers/topics.controllers")
const { serverError, invalidPath } = require("./errors")
const { getApi } = require("./controllers/api.controllers")

const app = express()

app.get("/api/topics", getAllTopics)
app.get("/api", getApi)

app.all("*", invalidPath)

app.use(serverError)



module.exports = app
