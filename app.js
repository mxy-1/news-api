const express = require("express")
const { getAllTopics } = require("./controllers/topics.controllers")
const { serverError, invalidPath, customError } = require("./errors")
const { getApi } = require("./controllers/api.controllers")
const { getArticleById, getArticleComments,getAllArticles, postCommentById } = require("./controllers/articles.controllers")
const { getAllUsers } = require("./controllers/users.controllers")

const app = express()
app.use(express.json())

app.get("/api/topics", getAllTopics)
app.get("/api", getApi)
app.get("/api/articles/:article_id", getArticleById )
app.get("/api/articles/:article_id/comments", getArticleComments)
app.get("/api/articles", getAllArticles)

app.post("/api/articles/:article_id/comments", postCommentById)

app.get("/api/users", getAllUsers)

app.all("*", invalidPath)

app.use(customError)
app.use(serverError)


module.exports = app



