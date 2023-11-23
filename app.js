const express = require("express")
const { getAllTopics } = require("./controllers/topics.controllers")
const { serverError, invalidPath, customError } = require("./errors")
const { getApi } = require("./controllers/api.controllers")
const { deleteCommentById } = require("./controllers/comments.controllers")
const { getArticleById, getArticleComments,getAllArticles, patchArticleVotes, postCommentById } = require("./controllers/articles.controllers")
const { getAllUsers } = require("./controllers/users.controllers")

const app = express()
app.use(express.json())

app.get("/api/topics", getAllTopics)
app.get("/api", getApi)
app.get("/api/articles/:article_id", getArticleById )
app.get("/api/articles/:article_id/comments", getArticleComments)
app.get("/api/articles/", getAllArticles)

app.delete("/api/comments/:comment_id", deleteCommentById)
app.patch("/api/articles/:article_id", patchArticleVotes)
app.post("/api/articles/:article_id/comments", postCommentById)

app.get("/api/users", getAllUsers)

app.all("*", invalidPath)

app.use(customError)
app.use(serverError)

module.exports = app

// FEATURE REQUEST An article response object should also now include:

// comment_count, which is the total count of all the comments with this article_id. You should make use of queries to the database in order to achieve this.




