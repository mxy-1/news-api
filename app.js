const express = require("express")
const { getAllTopics } = require("./controllers/topics.controllers")
const { serverError, invalidPath, customError } = require("./errors")
const { getApi } = require("./controllers/api.controllers")
const { getArticleById, getArticleComments,getAllArticles } = require("./controllers/articles.controllers")

const app = express()

app.get("/api/topics", getAllTopics)
app.get("/api", getApi)
app.get("/api/articles/:article_id", getArticleById )
app.get("/api/articles/:article_id/comments", getArticleComments)
app.get("/api/articles", getAllArticles)

app.all("*", invalidPath)

app.use(customError)
app.use(serverError)



module.exports = app
