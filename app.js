const express = require("express")
const { getAllTopics } = require("./controllers/topics.controllers")
const { serverError, invalidPath, customError } = require("./errors")
const { getApi } = require("./controllers/api.controllers")
const { getArticleById, getAllArticles, postCommentById } = require("./controllers/articles.controllers")

const app = express()
app.use(express.json())

app.get("/api/topics", getAllTopics)
app.get("/api", getApi)
app.get("/api/articles/:article_id", getArticleById )
app.get("/api/articles", getAllArticles)

app.post("/api/articles/:article_id/comments", postCommentById)

app.all("*", invalidPath)

app.use(customError)
app.use(serverError)



module.exports = app

// Should:

// be available on /api/articles/:article_id/comments.
// add a comment for an article.
// Request body accepts:

// an object with the following properties:
// username
// body
// Responds with:

// the posted comment.



// Consider what errors could occur with this endpoint, and make sure to test for them.

// Remember to add a description of this endpoint to your /api endpoint.